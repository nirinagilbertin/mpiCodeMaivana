import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI("AIzaSyDks2yAs_N5VPQr9RlBg0_EaWQp201tqOg");

// ✅ Modèle confirmé disponible et gratuit
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const SYSTEM_PROMPT = `
Tu es l'assistant urbain intelligent de Fianarantsoa.
Réponds en 2-3 phrases maximum.
Si hors sujet : "Je suis spécialisé dans les services urbains de Fianarantsoa."
`;

const cityContext = {
  trafic: "RN7 saturée à 70%. Itinéraire alternatif par Ankofafa recommandé.",
  eau: "Coupure quartier Ambalapaiso jusqu'à 18h. Citerne mobile sur place.",
  marches: "Marché Gare : 80% saturation. Marché Andravoahangy : 30%.",
  securite: "Évitez Tanambao entre 22h et 5h. Patrouille renforcée.",
  meteo: "Pluie modérée dès 19h. Risque inondation zones basses.",
};

export async function askAssistant(userMessage: string): Promise<string> {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nContexte Fianarantsoa : ${JSON.stringify(cityContext)}\n\nQuestion : ${userMessage}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "Désolé, service momentanément indisponible.";
  }
}