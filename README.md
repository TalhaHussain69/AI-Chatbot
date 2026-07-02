# 🤖 AI Chatbot

A modern, minimal, and fully responsive AI chatbot web application built entirely with **HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no bloat. Inspired by the clean, professional aesthetic of ChatGPT.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made with](https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)

---

## 📖 About

**AI Chatbot** is a lightweight, framework-free conversational AI interface designed to demonstrate clean architecture, thoughtful UX, and modern browser capabilities — all without a single external UI library. It connects to any OpenAI-compatible chat completion API (Groq, OpenRouter, Google Gemini, etc.) and delivers a smooth, ChatGPT-like experience directly in the browser.

The project was built with a strong focus on:
- **Simplicity** — no build tools, no bundlers, just open and run
- **Readability** — clean, modular, well-organized ES6 code
- **Privacy** — chat data stays in the browser via LocalStorage; API keys never touch the codebase pushed to GitHub
- **Accessibility** — semantic HTML and proper ARIA labels throughout

Whether you're learning frontend development, prototyping a chatbot UI, or looking for a minimal starting point for your own AI-powered project, this repository is built to be easy to read, easy to extend, and easy to deploy.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 Real-time Chat | Instant user messages with AI typing indicator |
| 🎙️ Voice Input | Speech-to-text using the Web Speech API |
| 🗂️ Chat History Sidebar | Multiple conversations, switch and delete anytime |
| 💾 LocalStorage Persistence | Conversations survive page refresh |
| 📋 Copy Messages | One-click copy for any message |
| 🧹 Clear Chat | Wipe the current conversation instantly |
| 📱 Fully Responsive | Optimized for desktop, tablet, and mobile |
| ⌨️ Enter to Send | Send messages via button or Enter key |
| 🚫 Smart Input Lock | Send button disabled when input is empty |
| ⚠️ Error Handling | Graceful handling of network/API failures |
| 🌙 Dark Theme | Clean, distraction-free dark UI |

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, flexbox, mobile-first responsive design
- **Vanilla JavaScript (ES6 Modules)** — zero dependencies
- **Web Speech API** — native browser voice recognition
- **Fetch API** — communicates with any OpenAI-compatible LLM endpoint

No React. No Vue. No Tailwind. No Bootstrap. Just the platform.

---

## 📁 Project Structure

```
ai-chatbot/
│
├── index.html              # Main HTML structure
├── config.example.js       # API config template (safe to commit)
├── config.js               # Your real API config (gitignored)
├── .gitignore
├── README.md
│
├── css/
│   └── style.css           # All styling, mobile-first
│
└── js/
    ├── app.js               # App state, event wiring, chat sessions
    ├── api.js               # API request logic (fetch calls)
    ├── voice.js              # Web Speech API integration
    └── ui.js                # DOM rendering & UI helpers
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

### 2. Set up your API config

This project keeps API keys out of version control by default.

```bash
cp config.example.js config.js
```

Open `config.js` and add your API key:

```javascript
export const API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const API_KEY = "your_actual_api_key_here";
export const MODEL_NAME = "llama-3.3-70b-versatile";
```

### 3. Get a free API key

This project works out of the box with **[Groq](https://console.groq.com)** — no credit card required, generous free tier, extremely fast inference.

Other compatible options: [OpenRouter](https://openrouter.ai) · [Google Gemini](https://aistudio.google.com/app/apikey)

### 4. Run locally

Since this project uses ES6 Modules, it must be served via a local server (opening `index.html` directly will trigger a CORS error).

**Using VS Code:**
Install the "Live Server" extension → right-click `index.html` → **Open with Live Server**

**Using Python:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

**Using Node.js:**
```bash
npx serve
```

---

## 🔐 Security Notes

- `config.js` (containing your real API key) is listed in `.gitignore` and will **never** be pushed to GitHub
- Only `config.example.js` (a placeholder template) is committed
- If an API key is ever accidentally exposed, revoke it immediately from your provider's dashboard and generate a new one

---

## 🌐 Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---|:---:|:---:|:---:|:---:|
| Core Chat UI | ✅ | ✅ | ✅ | ✅ |
| Voice Input (Web Speech API) | ✅ | ✅ | ✅ | ⚠️ Limited |

Voice input requires a secure context (`https://` or `localhost`).

---

## 🔄 Swapping the AI Provider

All API logic lives in a single file: `js/api.js`. To switch providers, just update `config.js` with the new base URL, key, and model name — no other code changes required, as long as the provider offers an OpenAI-compatible `/chat/completions` endpoint.

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 👤 Author

**Talha Hussain**

If you found this project useful, consider giving it a ⭐ on GitHub!
