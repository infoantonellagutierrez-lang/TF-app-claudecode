import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, financialSummary } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: "API key not configured. Please set ANTHROPIC_API_KEY.",
    });
  }

  try {
    const systemPrompt = `Eres Boti, asistente financiero amigable de TF Finance. Tienes acceso al resumen financiero del usuario: ${financialSummary}. Responde en español, de forma concisa y útil.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1536,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return res.status(500).json({ error: "Unexpected response format" });
    }

    return res.status(200).json({
      response: content.text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error.status === 401) {
      return res.status(500).json({ error: "API key is invalid" });
    }

    if (error.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limited. Please try again later." });
    }

    return res.status(500).json({
      error: error.message || "Failed to process chat message",
    });
  }
}
