const chatArea = document.getElementById('chatArea');
const emptyState = document.getElementById('emptyState');
const typingIndicator = document.getElementById('typingIndicator');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarList = document.getElementById('sidebarList');

export function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function hideEmptyState() {
  if (emptyState) emptyState.style.display = 'none';
}

export function showEmptyState() {
  if (emptyState) emptyState.style.display = 'flex';
}

export function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

export function renderMessage(role, text, timestamp) {
  hideEmptyState();

  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? 'U' : 'AI';

  const content = document.createElement('div');
  content.className = 'message-content';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  const meta = document.createElement('div');
  meta.className = 'message-meta';

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = formatTime(timestamp ? new Date(timestamp) : new Date());

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.setAttribute('aria-label', 'Copy message');
  copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1200);
    });
  });

  meta.appendChild(time);
  meta.appendChild(copyBtn);

  content.appendChild(bubble);
  content.appendChild(meta);

  messageEl.appendChild(avatar);
  messageEl.appendChild(content);

  chatArea.appendChild(messageEl);
  scrollToBottom();

  return messageEl;
}

export function showTypingIndicator() {
  typingIndicator.classList.add('active');
  scrollToBottom();
}

export function hideTypingIndicator() {
  typingIndicator.classList.remove('active');
}

export function clearChatUI() {
  const messages = chatArea.querySelectorAll('.message');
  messages.forEach(m => m.remove());
  showEmptyState();
}

export function updateSendButtonState() {
  sendBtn.disabled = messageInput.value.trim().length === 0;
}

export function autoResizeInput() {
  messageInput.style.height = 'auto';
  messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

export function clearInput() {
  messageInput.value = '';
  autoResizeInput();
  updateSendButtonState();
}

export function getInputValue() {
  return messageInput.value.trim();
}

export function setInputValue(text) {
  messageInput.value = text;
  autoResizeInput();
  updateSendButtonState();
}

export function renderSidebarSessions(sessions, activeId, callbacks) {
  sidebarList.innerHTML = '';

  sessions.slice().reverse().forEach(session => {
    const item = document.createElement('div');
    item.className = 'session-item' + (session.id === activeId ? ' active' : '');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'session-title';
    titleSpan.textContent = session.title;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'session-delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete conversation');
    deleteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`;

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      callbacks.onDelete(session.id);
    });

    item.addEventListener('click', () => {
      callbacks.onSelect(session.id);
    });

    item.appendChild(titleSpan);
    item.appendChild(deleteBtn);
    sidebarList.appendChild(item);
  });
}

export function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
}

export function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

export function toggleSidebar() {
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}