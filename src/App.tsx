import React, { useState } from 'react'
import { analyzeWithHybridAI, type HybridResult, type AnalysisType } from './lib/hybridAI'
import { speak } from './lib/voice'
import InputPanel from './components/InputPanel'
import { ResultCard } from './components/ResultCard'
import { InferenceBadge } from './components/InferenceBadge'
import HybridArchDiagram from './components/HybridArchDiagram'
import { Shield, Scan, MessageSquare, FileText } from 'lucide-react'
import clsx from 'clsx'

type Mode = 'receipt' | 'sms' | 'document'

const ANALYSIS_TYPE: Record<Mode, AnalysisType> = {
  receipt: 'receipt',
  sms: 'sms-alert',
  document: 'image-document',
}

const MODES: { id: Mode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'receipt', label: 'POS / Receipt', icon: <Scan className="w-6 h-6" />, desc: 'Paste any POS slip or printed receipt to detect overcharging or fake merchants.' },
  { id: 'sms', label: 'Bank SMS Alert', icon: <MessageSquare className="w-6 h-6" />, desc: 'Paste an SMS bank alert to verify transactions and spot phishing attempts.' },
  { id: 'document', label: 'Financial Doc', icon: <FileText className="w-6 h-6" />, desc: 'Paste loan agreements, invoices, or statements to flag hidden charges.' },
]

export default function App() {
  const [mode, setMode] = useState<Mode>('sms')
  const [result, setResult] = useState<HybridResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async (text: string) => {
    setIsLoading(true)
    setResult(null)
    try {
      const res = await analyzeWithHybridAI(text, ANALYSIS_TYPE[mode])
      setResult(res)
      const summary = `${res.fraudFlag ? 'WARNING! Fraud detected. ' : ''}${res.result}`
      speak(summary)
    } catch {
      setResult({
        mode: 'cloud-fallback',
        latencyMs: 0,
        result: 'Analysis failed. Please try again.',
        confidence: 'low',
        fraudFlag: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">HybridVoice Guard</h1>
              <p className="text-[11px] text-slate-500">AI Financial Fraud Shield · Firebase AI Logic</p>
            </div>
          </div>
          {result && <InferenceBadge mode={result.mode} latencyMs={result.latencyMs} />}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-900/30 border border-emerald-800 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          🏆 Google #BuildHybridAI 2026
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          Protect Your Money.<br />On-Device. In Your Language.
        </h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Paste any bank SMS, POS receipt, or financial document. Our hybrid AI — running{' '}
          <strong className="text-slate-200">on-device via Gemini Nano</strong> — instantly detects fraud,
          hidden charges, and phishing. Voice readout included.
        </p>
      </section>

      {/* Mode selector */}
      <section className="max-w-4xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setResult(null) }}
              className={clsx(
                'p-4 rounded-2xl border text-left transition-all group',
                mode === m.id
                  ? 'bg-emerald-900/30 border-emerald-600 ring-1 ring-emerald-500/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-600'
              )}
            >
              <div className={clsx(
                'w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors',
                mode === m.id ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
              )}>
                {m.icon}
              </div>
              <div className="font-semibold text-sm mb-1">{m.label}</div>
              <div className="text-xs text-slate-500">{m.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Input + Result */}
      <section className="max-w-4xl mx-auto px-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <InputPanel mode={mode} onAnalyze={handleAnalyze} isLoading={isLoading} />
          {result && <ResultCard result={result} />}
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="max-w-4xl mx-auto px-4 mb-10">
        <HybridArchDiagram />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-600">
        <p>Built with Firebase AI Logic · Gemini Nano (on-device) + Gemini Flash (cloud) · Web Speech API</p>
        <p className="mt-1">HybridVoice Guard · #BuildHybridAI 2026 · &copy; Ayoola Damisile</p>
      </footer>
    </div>
  )
}
