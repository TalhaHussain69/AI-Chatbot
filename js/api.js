import { API_URL, API_KEY, MODEL_NAME } from '../config.js';

function buildMessagesPayload(chatHistory) {
  return chatHistory.map(msg => ({
    role: msg.role === 'ai' ? 'assistant' : 'user',
    content: msg.content
  }));
}

export async function sendMessageToAI(chatHistory) {
  const payload = {
    model: MODEL_NAME,
    messages: buildMessagesPayload(chatHistory)
  };

  let response;

  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (networkError) {
    throw new Error('NETWORK_ERROR');
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('INVALID_API_KEY');
    } else if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    } else {
      throw new Error('API_ERROR');
    }
  }

  let data;

  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('PARSE_ERROR');
  }

  const aiMessage = data?.choices?.[0]?.message?.content;

  if (!aiMessage) {
    throw new Error('EMPTY_RESPONSE');
  }

  return aiMessage.trim();
}