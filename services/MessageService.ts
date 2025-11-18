interface SendMessageWaapi {
  phoneNumber: string;
  message: string;
}

interface SendMessageAssistant {
  phoneNumber: string;
  message: string;
  assistant: string | null;
}

interface SendMediaParams {
  phoneNumber: string;
  message: string;
  type?: string;
  url: string;
  assistant?: string | null;
}

export const messageService = {
  sendWaMessageWaapi: async ({ phoneNumber, message }: SendMessageWaapi) => {
    const fetchedMessage = await fetch('/api/wpp-service/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message }),
    });

    return await fetchedMessage.json();
  },

  sendMessageAssistant: async ({ phoneNumber, message, assistant }: SendMessageAssistant) => {
    const fetchedMessage = await fetch('/api/wpp-service/send-message-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, message, assistant }),
    });

    return await fetchedMessage.json();
  },

  sendMedia: async ({ phoneNumber, message, type, url, assistant }: SendMediaParams) => {
    const fetchedSentMediaMessage = await fetch('/api/wpp-service/send-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        message,
        type,
        url,
        assistant,
      }),
    });

    return await fetchedSentMediaMessage.json();
  },
};
