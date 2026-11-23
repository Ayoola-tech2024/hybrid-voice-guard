# 🛡️ HybridVoice Guard

**AI-Powered Financial Fraud Shield · On-Device + Cloud Hybrid Inference**

> Built for [#BuildHybridAI 2026](https://devpost.com/software/hybridvoice-guard) by Google · Submission by Ayoola Damisile

---

## 🔥 What It Does

HybridVoice Guard protects everyday Nigerians from financial fraud using **hybrid AI inference**:

- 📱 **On-Device (Gemini Nano via Chrome window.ai)** — Your financial data stays on your device, fully private.
- ☁️ **Cloud Fallback (Gemini Flash via Firebase AI Logic)** — Seamlessly falls back when on-device isn't available.
- 🗣️ **Voice Readout** — Results are spoken aloud via Web Speech API for accessibility and feature phone users.

Paste any **bank SMS alert**, **POS receipt**, or **financial document** and get instant fraud risk analysis in seconds.

---

## 🎯 Target Users

Low-income Nigerians and Africans who:
- Receive fake bank debit alerts used for POS fraud ("ghost debit" scams)
- Get overcharged at POS terminals with hidden fees
- Sign loan agreements with buried interest clauses

---

## 🧠 Hybrid AI Architecture

```
User Input → [Chrome Gemini Nano (on-device)] → Fraud Analysis
                       ↓ (if unavailable)
             [Gemini Flash via Firebase AI Logic] → Fraud Analysis
                       ↓
             Risk Level + Flags + Voice Readout
```

**On-device inference priority** means:
- Zero data leaves the device for most analyses
- Works offline / low-connectivity
- Under 200ms response time on supported devices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| On-device AI | Chrome window.ai.languageModel (Gemini Nano) |
| Cloud AI | @google/generative-ai -> Gemini 1.5 Flash |
| Voice | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Deployment | Vercel |

---

## Run Locally

```bash
git clone https://github.com/Ayoola-tech2024/hybrid-voice-guard
cd hybrid-voice-guard
npm install
cp .env.example .env
# Edit .env and add your key from https://aistudio.google.com
npm run dev
```

---

## Live Demo

https://hybridvoiceguard.vercel.app

---

## Hackathon

| Field | Detail |
|-------|--------|
| Hackathon | #BuildHybridAI 2026 by Google |
| Category | Web (Chrome) |
| Prizes | $30,000 cash pool |
| Deadline | November 30, 2026 |

---

## Team

Ayoola Damisile · Full-Stack AI Developer · FUTA, Akure, Nigeria  
GitHub: https://github.com/Ayoola-tech2024
