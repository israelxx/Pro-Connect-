
import React, { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp, ExternalLink, Instagram, Music2, Globe, Sparkles } from 'lucide-react';
import { ClientData, AppState, OBJECTIVE_OPTIONS, VideoScript } from './types';
import { InfinityLogo, PROCESSING_PHRASES } from './constants';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { ScriptCard } from './components/ScriptCard';
import { generateScripts } from './services/geminiService';
import { syncWithBackend } from './services/webhookService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [formData, setFormData] = useState<ClientData>({
    name: '',
    niche: '',
    instagram: '',
    tiktok: '',
    website: '',
    objectives: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientData, string>>>({});
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(true);

  useEffect(() => {
    let interval: any;
    if (state === AppState.PROCESSING) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % PROCESSING_PHRASES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.niche) newErrors.niche = "Nicho é obrigatório";
    if (!formData.instagram) newErrors.instagram = "Instagram é obrigatório";
    if (formData.objectives.length === 0) newErrors.objectives = "Selecione ao menos um objetivo";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleObjective = (obj: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(obj) 
        ? prev.objectives.filter(o => o !== obj)
        : [...prev.objectives, obj]
    }));
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    
    setState(AppState.PROCESSING);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      // 1. Gera os roteiros imediatamente usando o Gemini
      const generated = await generateScripts(formData);
      setScripts(generated);
      
      // 2. Sincroniza com seu webhook (n8n) em segundo plano
      syncWithBackend(formData, generated);
      
      setState(AppState.OUTPUT);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
      setState(AppState.INPUT);
    }
  };

  const resetApp = () => {
    setFormData({
      name: '',
      niche: '',
      instagram: '',
      tiktok: '',
      website: '',
      objectives: []
    });
    setScripts([]);
    setErrors({});
    setState(AppState.INPUT);
    setIsHeaderCollapsed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadAll = () => {
    const content = scripts.map(s => (
      `ROTEIRO: ${s.title}\nOBJETIVO: ${s.objective}\n\nHOOK: ${s.hook}\n\nBODY: ${s.body}\n\nCTA: ${s.cta}\n\n-------------------------\n\n`
    )).join('');
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ProRoteiro_${formData.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-pure-white selection:bg-soft-sky selection:text-deep-infinity pb-safe">
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={resetApp}>
            <InfinityLogo className="w-7 h-7 sm:w-8 sm:h-8" color="#0EA5E9" />
            <h1 className="font-heading text-lg sm:text-xl font-bold text-ink-black tracking-tight">
              ProRoteiro <span className="text-innovation-blue">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={resetApp}
              className="text-slate-gray hover:text-innovation-blue transition-colors font-medium text-xs sm:text-sm"
            >
              Novo Projeto
            </button>
            <div className="w-px h-5 sm:h-6 bg-border-gray"></div>
            <span className="text-slate-gray text-[10px] sm:text-xs font-body hidden md:block">v1.0 • Inovação Real</span>
          </div>
        </div>
      </header>

      <main className={`pt-20 sm:pt-24 px-4 sm:px-6 ${state === AppState.OUTPUT ? 'pb-40' : 'pb-20'}`}>
        {state === AppState.INPUT && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 sm:mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink-black mb-2">
                Vamos criar conteúdo estratégico?
              </h2>
              <p className="text-sm sm:text-base text-slate-gray font-body px-4">A IA gerará roteiros prontos e sincronizará com seu back-end.</p>
            </div>

            <div className="bg-white border border-border-gray rounded-2xl p-5 sm:p-8 shadow-sm space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <Input 
                  label="Nome do Cliente" 
                  placeholder="Ex: Dra. Ana Silva"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  error={errors.name}
                />
                <Input 
                  label="Nicho / Área de Atuação" 
                  placeholder="Ex: Harmonização Facial"
                  value={formData.niche}
                  onChange={e => setFormData({...formData, niche: e.target.value})}
                  error={errors.niche}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                <div className="relative">
                  <Input 
                    label="Instagram" 
                    placeholder="@perfil"
                    value={formData.instagram}
                    onChange={e => setFormData({...formData, instagram: e.target.value})}
                    error={errors.instagram}
                  />
                  <Instagram size={14} className="absolute right-3 top-[37px] text-slate-gray opacity-50" />
                </div>
                <div className="relative">
                  <Input 
                    label="TikTok (Opcional)" 
                    placeholder="@perfil"
                    value={formData.tiktok}
                    onChange={e => setFormData({...formData, tiktok: e.target.value})}
                  />
                  <Music2 size={14} className="absolute right-3 top-[37px] text-slate-gray opacity-50" />
                </div>
                <div className="relative">
                  <Input 
                    label="Website (Opcional)" 
                    placeholder="https://..."
                    value={formData.website}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                  />
                  <Globe size={14} className="absolute right-3 top-[37px] text-slate-gray opacity-50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-gray font-body block mb-3">
                  Qual o objetivo desses vídeos?
                </label>
                <div className="flex flex-wrap gap-2">
                  {OBJECTIVE_OPTIONS.map(obj => (
                    <button
                      key={obj}
                      onClick={() => toggleObjective(obj)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all transform active:scale-95 ${
                        formData.objectives.includes(obj)
                          ? 'bg-innovation-blue text-white shadow-md shadow-innovation-blue/20'
                          : 'bg-soft-sky text-deep-infinity border border-innovation-blue/10 hover:border-innovation-blue'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
                {errors.objectives && <p className="text-[11px] text-alert-red mt-2">{errors.objectives}</p>}
              </div>

              <div className="pt-4">
                <Button 
                  onClick={handleGenerate}
                  className="w-full h-14 text-base sm:text-lg shadow-lg shadow-innovation-blue/10"
                >
                  <Sparkles size={18} />
                  Gerar Roteiros Agora
                </Button>
                <p className="text-center text-[10px] sm:text-xs text-slate-gray mt-4 font-body opacity-60">
                  Os roteiros aparecerão em segundos e serão enviados ao seu webhook.
                </p>
              </div>
            </div>
          </div>
        )}

        {state === AppState.PROCESSING && (
          <div className="max-w-md mx-auto py-20 text-center flex flex-col items-center animate-in zoom-in duration-300">
            <InfinityLogo className="w-24 h-24 sm:w-32 sm:h-32 mb-8" color="#0EA5E9" />
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-ink-black mb-2 px-4">Gerando Roteiros Estratégicos</h2>
            <div className="h-6">
               <p className="text-innovation-blue font-semibold text-sm sm:text-base animate-pulse">
                {PROCESSING_PHRASES[loadingPhraseIndex]}
              </p>
            </div>
          </div>
        )}

        {state === AppState.OUTPUT && (
          <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="mb-8 bg-white border border-border-gray rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-soft-sky/30 transition-colors"
              >
                <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-[9px] uppercase text-slate-gray font-bold tracking-tight">Cliente</span>
                    <span className="font-bold text-sm text-ink-black truncate max-w-[120px] sm:max-w-none">{formData.name}</span>
                  </div>
                  <div className="hidden xs:flex flex-col items-start min-w-0">
                    <span className="text-[9px] uppercase text-slate-gray font-bold tracking-tight">Nicho</span>
                    <span className="font-semibold text-sm text-ink-black truncate max-w-[120px] sm:max-w-none">{formData.niche}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 ml-2">
                  <span className="text-[10px] sm:text-xs text-innovation-blue font-semibold whitespace-nowrap">Detalhes</span>
                  {isHeaderCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </div>
              </button>
              
              {!isHeaderCollapsed && (
                <div className="p-4 sm:p-6 border-t border-border-gray bg-soft-sky/10 grid grid-cols-1 sm:grid-cols-3 gap-5 animate-in slide-in-from-top-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-gray uppercase">Redes Sociais</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-black">
                      <span className="flex items-center gap-1"><Instagram size={12}/> {formData.instagram}</span>
                      {formData.tiktok && <span className="flex items-center gap-1"><Music2 size={12}/> {formData.tiktok}</span>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-gray uppercase">Website</p>
                    <p className="text-xs text-ink-black">{formData.website || "Não informado"}</p>
                  </div>
                  <div className="flex items-end justify-start sm:justify-end">
                    <Button variant="secondary" onClick={() => setState(AppState.INPUT)} className="h-9 text-[10px] py-0 px-4">
                      Novo Projeto
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="masonry-grid">
              {scripts.map((script, idx) => (
                <div key={script.id || idx} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
                  <ScriptCard script={script} />
                </div>
              ))}
            </div>

            <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-40">
              <Button 
                onClick={downloadAll}
                className="w-full shadow-2xl shadow-innovation-blue/30 flex items-center justify-center gap-3 h-14 sm:h-16 active:scale-95 transform transition-transform"
              >
                <Download size={20} />
                <span className="text-sm sm:text-base">Baixar Todos (.TXT)</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-10 border-t border-border-gray bg-white mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <InfinityLogo className="w-5 h-5" color="#64748B" />
            <span className="text-slate-gray text-[10px] sm:text-xs font-body text-center">© 2026 ProRoteiro AI. IA Local + Sync Webhook.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
