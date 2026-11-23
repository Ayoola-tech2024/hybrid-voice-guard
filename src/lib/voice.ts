/**
 * voice.ts
 * Text-to-Speech & Speech-to-Text helpers
 * Uses Web Speech API — zero external dependencies, works fully offline.
 */

export function speak(text: string, lang = 'en-NG'): void {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.95
  utterance.pitch = 1.0
  window.speechSynthesis.speak(utterance)
  if (navigator.vibrate) navigator.vibrate(60)
}

/** Returns a promise that resolves with the transcript, or rejects if unavailable. */
export function startListening(lang = 'en-NG'): Promise<string> {
  return new Promise((resolve, reject) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      reject(new Error('SpeechRecognition not supported'))
      return
    }
    const recognition = new SR()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      resolve(event.results[0][0].transcript as string)
    }
    recognition.onerror = (event: any) => {
      reject(new Error(event.error))
    }
    recognition.onend = () => {
      // If no result yet, resolve empty
    }
    recognition.start()
  })
}

export function stopListening(): void {
  // No-op — promise-based API ends on its own; kept for compatibility
}
