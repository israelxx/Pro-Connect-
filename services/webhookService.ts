
import { ClientData, VideoScript } from "../types";

const WEBHOOK_URL = "https://webhook.iatechnologies.com.br/webhook/proroteiroai";

export const syncWithBackend = async (data: ClientData, scripts: VideoScript[]): Promise<void> => {
  console.log("🔗 Sincronizando dados com o webhook n8n...");
  
  try {
    const payload = {
      event: "scripts_ready",
      timestamp: new Date().toISOString(),
      cliente: data,
      scripts: scripts
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("✅ Dados sincronizados com sucesso.");
    } else {
      console.warn("⚠️ Webhook recebeu os dados mas retornou status:", response.status);
    }
  } catch (error) {
    // Falha silenciosa para não atrapalhar o usuário final
    console.error("❌ Erro ao sincronizar com webhook:", error);
  }
};
