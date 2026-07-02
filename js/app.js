import {
  renderMessage,
  showTypingIndicator,
  hideTypingIndicator,
  clearChatUI,
  updateSendButtonState,
  autoResizeInput,
  clearInput,
  getInputValue,
  scrollToBottom,
  renderSidebarSessions,
  toggleSidebar,
  closeSidebar
} from './ui.js';

import { sendMessageToAI } from './api.js';
import { initVoiceInput } from './voice.js';

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const newChatBtn = document.getElementById('newChatBtn');
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

const SESSIONS_KEY = 'ai_chatbot_sessions';
const ACTIVE_SESSION_KEY = 'ai_chatbot_active_session';

let sessions = [];
let activeSessionId = null;

function getErrorMessage(errorType) {
  const errorMessages = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
    API_ERROR: 'The AI service returned an error. Please try again.',
    PARSE_ERROR: 'Received an invalid response from the server.',
    EMPTY_RESPONSE: 'The AI did not return a response. Please try again.'
  };
  return errorMessages[errorType] || 'Something went wrong. Please try again.';
}

function generateId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
}

function saveSessions() {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
}

function getActiveSession() {
  return sessions.find(s => s.id === activeSessionId);
}

function createNewSession() {
  const newSession = {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: Date.now()
  };
  sessions.push(newSession);
  activeSessionId = newSession.id;
  saveSessions();
  clearChatUI();
  refreshSidebar();
  closeSidebar();
}

function switchSession(id) {
  if (id === activeSessionId) {
    closeSidebar();
    return;
  }
  activeSessionId = id;
  saveSessions();
  renderActiveSession();
  refreshSidebar();
  closeSidebar();
}

function deleteSession(id) {
  sessions = sessions.filter(s => s.id !== id);

  if (sessions.length === 0) {
    createNewSession();
    return;
  }

  if (id === activeSessionId) {
    activeSessionId = sessions[sessions.length - 1].id;
    renderActiveSession();
  }

  saveSessions();
  refreshSidebar();
}

function renderActiveSession() {
  clearChatUI();
  const session = getActiveSession();
  if (session && session.messages.length > 0) {
    session.messages.forEach(msg => {
      renderMessage(msg.role, msg.content, msg.timestamp);
    });
    scrollToBottom();
  }
}

function refreshSidebar() {
  renderSidebarSessions(sessions, activeSessionId, {
    onSelect: switchSession,
    onDelete: deleteSession
  });
}

function addMessageToActiveSession(role, content) {
  const session = getActiveSession();
  const timestamp = Date.now();
  session.messages.push({ role, content, timestamp });

  if (role === 'user' && session.title === 'New Chat') {
    session.title = content.length > 30 ? content.slice(0, 30) + '...' : content;
  }

  saveSessions();
  refreshSidebar();
  return timestamp;
}

function loadSessionsFromStorage() {
  const savedSessions = localStorage.getItem(SESSIONS_KEY);
  const savedActiveId = localStorage.getItem(ACTIVE_SESSION_KEY);

  if (savedSessions) {
    try {
      sessions = JSON.parse(savedSessions);
    } catch (e) {
      sessions = [];
    }
  }

  if (sessions.length === 0) {
    createNewSession();
  } else {
    activeSessionId = savedActiveId && sessions.find(s => s.id === savedActiveId)
      ? savedActiveId
      : sessions[sessions.length - 1].id;
    renderActiveSession();
  }

  refreshSidebar();
}

async function handleSendMessage() {
  const text = getInputValue();
  if (!text) return;

  const session = getActiveSession();
  const timestamp = addMessageToActiveSession('user', text);
  renderMessage('user', text, timestamp);
  clearInput();

  showTypingIndicator();

  try {
    const aiResponse = await sendMessageToAI(session.messages);
    hideTypingIndicator();
    const aiTimestamp = addMessageToActiveSession('ai', aiResponse);
    renderMessage('ai', aiResponse, aiTimestamp);
  } catch (error) {
    hideTypingIndicator();
    const errorMsg = getErrorMessage(error.message);
    const errTimestamp = addMessageToActiveSession('ai', errorMsg);
    renderMessage('ai', errorMsg, errTimestamp);
  }
}

function handleClearCurrentChat() {
  const session = getActiveSession();
  session.messages = [];
  session.title = 'New Chat';
  saveSessions();
  clearChatUI();
  refreshSidebar();
}

sendBtn.addEventListener('click', handleSendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});

messageInput.addEventListener('input', () => {
  autoResizeInput();
  updateSendButtonState();
});

clearChatBtn.addEventListener('click', handleClearCurrentChat);
newChatBtn.addEventListener('click', createNewSession);
sidebarToggleBtn.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

loadSessionsFromStorage();
updateSendButtonState();
initVoiceInput();