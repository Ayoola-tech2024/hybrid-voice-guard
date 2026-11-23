# Devpost Submission: HybridVoice Guard

**Hackathon:** [#BuildHybridAI 2026](https://buildhybridai2026.devpost.com/)  
**Tagline:** AI-powered financial fraud shield using on-device Gemini Nano + cloud Gemini Flash fallback with voice readout to protect users from POS scams and fake alerts.  
**Live Demo:** [https://hybrid-voice-guard.vercel.app](https://hybrid-voice-guard.vercel.app)  
**GitHub Repository:** [https://github.com/Ayoola-tech2024/hybrid-voice-guard](https://github.com/Ayoola-tech2024/hybrid-voice-guard)  

---

## 💡 Inspiration

In Nigeria and across Sub-Saharan Africa, mobile money, POS terminals, and digital banking have unlocked incredible financial inclusion. However, they have also created a breeding ground for fraud:
- **Ghost Debit Alerts:** Scammers use spoofed SMS alerts resembling bank debits to trick merchants and consumers.
- **POS Terminal Overcharging:** Hidden merchant fees and unverified surcharge deductions slip by uninspected.
- **Predatory Loan Terms:** Fine-print hidden interest rates trap unbanked individuals into debt cycles.

For vulnerable individuals, including the visually impaired and elderly, inspecting complex receipts or SMS alerts is stressful and error-prone. Furthermore, users should not have to upload sensitive financial account numbers and balance details to third-party servers. We built **HybridVoice Guard** to solve this with private, on-device intelligence backed by resilient cloud hybrid routing.

---

## ⚡ What It Does

HybridVoice Guard is an intelligent fraud defense web application designed around Google's hybrid inference paradigm:

1. **Three Specialized Analysis Modes:**
   - **Bank SMS Alert:** Scans transaction alerts to verify format validity, detect fake reference codes, and warn against phishing sender IDs.
   - **POS / Receipt Slip:** Parses paper slip texts to confirm approved/declined status, extract exact naira amounts, and identify fee gouging.
   - **Financial Documents:** Analyzes loan agreements or invoice descriptions to isolate hidden charges and extortionate interest clauses.

2. **Hybrid Inference Engine:**
   - **On-Device First (Chrome Gemini Nano / `window.ai`):** Prompts execute locally right in the user's browser. Sensitive balance numbers and transaction details never leave the machine, guaranteeing zero data leakage, zero network latency, and offline operability.
   - **Graceful Cloud Fallback (Gemini 1.5 Flash):** When run on devices lacking hardware NPU support or Chrome AI enablement, it automatically falls back to Gemini 1.5 Flash via Google/Firebase AI Logic with zero user disruption.

3. **Accessible Voice Readout & Haptics:**
   - Immediate speech output using the Web Speech API (`SpeechSynthesis`) speaks verdicts aloud with tailored prosody (urgent warning for high risk, reassuring confirmation for verified transactions).
   - Voice input (`SpeechRecognition`) allows hands-free query submission for low-literacy or visually impaired users.

---

## 🛠️ How We Built It

- **Frontend & UI:** React 18, TypeScript, Tailwind CSS, Lucide Icons, and Vite for ultra-fast bundling.
- **Hybrid AI Architecture:**
  - `src/lib/hybridAI.ts`: Implements detection of Chrome `window.ai.languageModel` capabilities. If available, prompts run directly against the local on-device Gemini Nano model.
  - Automatic fallback handler connects to Google Generative AI (`gemini-1.5-flash`), with structured JSON enforcement and error normalization.
- **Voice & Accessibility:** `src/lib/voice.ts` coordinates speech synthesis, speech recognition, and mobile vibration patterns.
- **Deployment:** Continuous production hosting on Vercel Edge Network with sub-second asset delivery worldwide.

---

## 🚧 Challenges We Ran Into

1. **Structured Extraction on Constrained Models:** Prompting on-device Gemini Nano to return strictly clean, parseable JSON required careful system prompt tuning and defensive regex sanitization for Markdown codeblocks.
2. **Offline vs. Online State Transitions:** Balancing real-time latency feedback with informative UI states so users understand whether an analysis happened privately on their device or via cloud acceleration.

---

## 🏆 Accomplishments We're Proud Of

- Successfully achieved a clean hybrid routing architecture that gracefully switches between on-device Gemini Nano and cloud Gemini Flash without breaking execution flow.
- Fully accessible interface supporting TalkBack, voice input, screen readers, and high-contrast dark mode.
- Deployed a production-ready web app in under 24 hours that solves an acute, real-world financial challenge in emerging markets.

---

## 📚 What We Learned

- How to integrate Google's emerging Chrome AI (`window.ai`) APIs with modern React application state.
- Best practices for designing hybrid fallback chains that balance data sovereignty with universal accessibility.

---

## 🚀 What's Next for HybridVoice Guard

- Direct camera-based OCR via Mobile Vision to scan physical thermal POS receipts directly in real-time.
- Local multilingual translation for Nigerian native languages (Yoruba, Hausa, Igbo, Nigerian Pidgin) running entirely on-device.
- Dedicated Chrome Extension that monitors web banking tabs automatically.
