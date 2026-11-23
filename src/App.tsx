import { useState } from 'react'
import { analyzeWithHybridAI, type HybridResult } from './lib/hybridAI'
import { speak } from './lib/voice'
import { ResultCard } from './components/ResultCard'
import { ArrowUpRight, DeviceIcon, CloudIcon } from './components/Icons'

type Mode = 'sms' | 'receipt' | 'document'

interface Preset {
  label: string
  text: string
}

const PRESETS: Record<Mode, Preset[]> = {
  sms: [
    {
      label: 'Fake N50,000 alert',
      text: 'Credit: NGN50,000.00 from ALHAJI MUSA USMAN. Date: 23-Nov-2026 11:42. Bal: NGN142,300.00. Ref: GTB/TX/993821098. Dial *737*0# to confirm.'
    },
    {
      label: 'Legitimate debit alert',
      text: 'Acct: **4521 Debited: NGN5,000.00 on 23-Nov-2026 09:15:00 at SUPERMARKET POS. Avail Bal: NGN28,500.00. Ref: 20261123449102.'
    }
  ],
  receipt: [
    {
      label: 'POS surcharge overcharge',
      text: 'MERCHANT: CORNER SHOP EXPRESS POS\nTERMINAL: 20394811\nDATE: 23/11/2026 10:14:00\nPURCHASE: NGN 2,500.00\nCONVENIENCE FEE: NGN 600.00\nTOTAL CHARGED: NGN 3,100.00\nSTATUS: APPROVED'
    },
    {
      label: 'Normal fuel receipt',
      text: 'TOTAL OIL STATION VI LAGOS\nSTAN: 094821\nDATE: 23/11/2026 08:30:11\nAMOUNT: NGN 12,000.00\nSURCHARGE: NGN 0.00\nTOTAL: NGN 12,000.00\nAUTH CODE: 559021\nTRANSACTION APPROVED'
    }
  ],
  document: [
    {
      label: 'Predatory loan agreement',
      text: 'Instant Cash Loan Agreement: Principal Amount: NGN 100,000. Repayment Period: 30 days. Daily administrative holding fee: 2.5% compounded daily. Late penalty: 15% flat per day overdue. Default entitles lender to broadcast contacts.'
    },
    {
      label: 'Standard vendor invoice',
      text: 'INVOICE #INV-2026-881\nBilled To: Ayoola Tech\nItems: Cloud Hosting (1 Month) - NGN 15,000.00\nTax (VAT 7.5%): NGN 1,125.00\nTotal Due: NGN 16,125.00\nPayment Terms: Net 30 days. Bank: Zenith Bank.'
    }
  ]
}

export default function App() {
  const [mode, setMode] = useState<Mode>('sms')
  const [input, setInput] = useState(PRESETS.sms[0].text)
  const [result, setResult] = useState<HybridResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (!input.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const type = mode === 'sms' ? 'sms-alert' : mode === 'receipt' ? 'receipt' : 'image-document'
      const data = await analyzeWithHybridAI(input, type)
      setResult(data)
      const readout = data.fraudFlag 
        ? `Warning: Potential fraud detected. ${data.result}` 
        : `Verified. ${data.result}`
      speak(readout)
    } catch {
      setResult({
        mode: 'cloud-fallback',
        latencyMs: 0,
        result: 'Could not parse transaction. Please check the text and try again.',
        confidence: 'low',
        fraudFlag: false
      })
    } finally {
      setLoading(false)
    }
  }

  const changeMode = (m: Mode) => {
    setMode(m)
    setInput(PRESETS[m][0].text)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      {/* Minimal Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-zinc-200">VoiceGuard</span>
            <span className="text-zinc-500 hidden sm:inline">/</span>
            <span className="text-zinc-500 hidden sm:inline">Transaction auditor</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">Hybrid AI (Nano + Flash)</span>
            <a 
              href="https://github.com/Ayoola-tech2024/hybrid-voice-guard" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-zinc-200"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-2xl mx-auto w-full px-4 py-12 space-y-8">
        {/* Restrained Headline: 2 lines, regular weight, no AI buzzwords */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-100">
            Verify transactions.<br />
            Catch fraud before money moves.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed">
            Audit Nigerian bank SMS alerts, POS receipts, and loan fine print. 
            Runs on-device when supported, with audio readouts.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5 space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-850 text-xs">
            <button
              onClick={() => changeMode('sms')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors ${
                mode === 'sms'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bank SMS
            </button>
            <button
              onClick={() => changeMode('receipt')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors ${
                mode === 'receipt'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              POS receipt
            </button>
            <button
              onClick={() => changeMode('document')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors ${
                mode === 'document'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Loan terms
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-zinc-500 text-[11px]">Samples:</span>
            {PRESETS[mode].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(p.text)
                  setResult(null)
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] border cursor-pointer transition-colors ${
                  input === p.text
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-200'
                    : 'border-zinc-850 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Text Area */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Paste transaction text here..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono leading-relaxed"
          />

          {/* Button Row - Clean solid, no hover shadow */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500 font-mono">
              Zero data leaves device on supported browsers
            </span>

            <button
              onClick={handleRun}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Auditing...' : 'Run audit'}
            </button>
          </div>
        </div>

        {/* Audit Output */}
        {result && (
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Audit output</div>
            <ResultCard result={result} />
          </div>
        )}

        {/* Calm Technical Notes */}
        <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-900 text-xs">
          <div className="space-y-1">
            <div className="text-zinc-300 font-medium flex items-center gap-1.5">
              <DeviceIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>On-device Nano</span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Executes via Chrome <code className="text-zinc-400">window.ai</code>. Your account balance and personal names stay on your computer or phone.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-zinc-300 font-medium flex items-center gap-1.5">
              <CloudIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Cloud fallback</span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              If your browser lacks hardware acceleration, queries route through Gemini 1.5 Flash via Firebase AI Logic.
            </p>
          </div>
        </div>
      </main>

      {/* Restrained Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>VoiceGuard · #BuildHybridAI 2026 submission · Ayoola Damisile</p>
      </footer>
    </div>
  )
}
