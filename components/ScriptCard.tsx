
import React, { useState } from 'react';
import { VideoScript } from '../types';
import { Copy, Check } from 'lucide-react';

interface ScriptCardProps {
  script: VideoScript;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const fullText = `Título: ${script.title}\nObjetivo: ${script.objective}\n\nHOOK:\n${script.hook}\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}`;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-border-gray rounded-2xl p-5 sm:p-6 flex flex-col gap-4 h-full hover:border-innovation-blue transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-base sm:text-lg font-bold text-deep-infinity font-heading leading-tight line-clamp-2">
          {script.title}
        </h3>
        <span className="bg-soft-sky text-innovation-blue text-[9px] uppercase tracking-wider font-extrabold px-2 py-1 rounded shrink-0">
          {script.objective}
        </span>
      </div>

      <div className="space-y-4 font-body text-ink-black text-xs sm:text-sm flex-grow">
        <div className="bg-soft-sky/30 p-3 rounded-xl border border-innovation-blue/5">
          <p className="text-[10px] uppercase font-bold text-innovation-blue mb-1 tracking-wider opacity-70">Gancho (0-3s)</p>
          <p className="italic font-medium leading-relaxed">"{script.hook}"</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-gray mb-1 tracking-wider opacity-70">Conteúdo (Valor)</p>
          <p className="text-slate-gray leading-relaxed whitespace-pre-line">{script.body}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-innovation-blue mb-1 tracking-wider opacity-70">Conversão (CTA)</p>
          <p className="font-semibold underline decoration-innovation-blue/20 underline-offset-4 decoration-2">{script.cta}</p>
        </div>
      </div>

      <div className="pt-4 border-t border-border-gray mt-auto">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-2 text-deep-infinity font-semibold hover:bg-soft-sky rounded-xl transition-all active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check size={16} className="text-success-green" />
              <span className="text-success-green text-sm">Copiado!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span className="text-sm">Copiar Roteiro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
