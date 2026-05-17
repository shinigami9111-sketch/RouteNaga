
interface WebhookResponse {
  output?: string;
  response?: string;
  message?: string;
  text?: string;
}

export async function getWebhookChatResponse(chatInput: string, sessionId: string): Promise<string> {
  const webhookUrl = "https://supong9111.app.n8n.cloud/webhook/5138c420-2193-4bc7-8e67-4c04c58bf217/chat";
  
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatInput,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    const data = await response.json();
    
    // Adjust based on expected n8n response structure. 
    // Usually it's an array or an object with specific keys.
    if (Array.isArray(data)) {
        return data[0]?.output || data[0]?.response || data[0]?.text || "No response details found.";
    }
    
    return data.output || data.response || data.text || data.message || "I've received your message but I'm processing it.";
  } catch (error) {
    console.error("Webhook Chat Error:", error);
    return "I'm having trouble connecting to my travel servers. Please check your internet or try again later!";
  }
}
