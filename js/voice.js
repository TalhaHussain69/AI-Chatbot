import { setInputValue, getInputValue } from './ui.js';

const micBtn = document.getElementById('micBtn');
const listeningIndicator = document.getElementById('listeningIndicator');

let recognition = null;
let isListening = false;
let isStarting = false;

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function isSecureContextOk() {
  return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

async function requestMicPermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      alert('Microphone permission denied. Please allow microphone access in your browser settings and try again.');
    } else if (err.name === 'NotFoundError') {
      alert('No microphone found. Please connect a microphone and try again.');
    } else {
      alert('Could not access microphone: ' + err.message);
    }
    return false;
  }
}

function createRecognitionInstance() {
  const SpeechRecognition = getSpeechRecognition();
  const instance = new SpeechRecognition();
  instance.lang = 'en-US';
  instance.continuous = false;
  instance.interimResults = false;
  instance.maxAlternatives = 1;
  return instance;
}

async function startListening() {
  if (isListening || isStarting) return;

  const SpeechRecognition = getSpeechRecognition();

  if (!SpeechRecognition) {
    alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
    return;
  }

  if (!isSecureContextOk()) {
    alert('Voice input requires HTTPS or localhost. Please run this site through a local server (not file://).');
    return;
  }

  isStarting = true;

  const permissionGranted = await requestMicPermission();

  if (!permissionGranted) {
    isStarting = false;
    return;
  }

  recognition = createRecognitionInstance();

  recognition.onstart = () => {
    isListening = true;
    isStarting = false;
    micBtn.classList.add('recording');
    listeningIndicator.classList.add('active');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const existingText = getInputValue();
    const newText = existingText ? `${existingText} ${transcript}` : transcript;
    setInputValue(newText);
  };

  recognition.onerror = (event) => {
    isStarting = false;

    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      alert('Microphone permission denied. Please allow microphone access.');
    } else if (event.error === 'no-speech') {
      alert('No speech detected. Please try again and speak clearly.');
    } else if (event.error === 'audio-capture') {
      alert('No microphone was found. Please check your device.');
    } else if (event.error === 'network') {
      alert('Network error occurred during speech recognition. Please check your internet connection.');
    } else if (event.error !== 'aborted') {
      alert('Voice recognition error: ' + event.error);
    }
  };

  recognition.onend = () => {
    isListening = false;
    isStarting = false;
    micBtn.classList.remove('recording');
    listeningIndicator.classList.remove('active');
  };

  try {
    recognition.start();
  } catch (err) {
    isStarting = false;
    alert('Could not start voice recognition. Please try again.');
  }
}

function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
  }
}

export function initVoiceInput() {
  const SpeechRecognition = getSpeechRecognition();

  if (!SpeechRecognition) {
    micBtn.style.opacity = '0.4';
    micBtn.title = 'Voice input not supported in this browser';
  } else if (!isSecureContextOk()) {
    micBtn.style.opacity = '0.4';
    micBtn.title = 'Voice input requires HTTPS or localhost';
  }

  micBtn.addEventListener('click', () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  });
}