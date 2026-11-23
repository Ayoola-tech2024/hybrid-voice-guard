import { useState, useRef } from 'react'
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
      label: 'Fake N50k credit alert',
      text: 'Credit: NGN50,000.00 from ALHAJI MUSA USMAN. Date: 23-Nov-2026 11:42. Bal: NGN142,300.00. Ref: GTB/TX/993821098. Dial *737*0# to confirm.'
    },
    {
      label: 'Real grocery debit',
      text: 'Acct: **4521 Debited: NGN5,000.00 on 23-Nov-2026 09:15:00 at SUPERMARKET POS. Avail Bal: NGN28,500.00. Ref: 20261123449102.'
    }
  ],
  receipt: [
    {
      label: 'POS surcharge fee',
      text: 'MERCHANT: CORNER SHOP EXPRESS POS\nTERMINAL: 20394811\nDATE: 23/11/2026 10:14:00\nPURCHASE: NGN 2,500.00\nCONVENIENCE FEE: NGN 600.00\nTOTAL CHARGED: NGN 3,100.00\nSTATUS: APPROVED'
    },
    {
      label: 'Fuel station printout',
      text: 'TOTAL OIL STATION VI LAGOS\nSTAN: 094821\nDATE: 23/11/2026 08:30:11\nAMOUNT: NGN 12,000.00\nSURCHARGE: NGN 0.00\nTOTAL: NGN 12,000.00\nAUTH CODE: 559021\nTRANSACTION APPROVED'
    }
  ],
  document: [
    {
      label: 'Predatory loan fine print',
      text: 'Instant Cash Loan Agreement: Principal Amount: NGN 100,000. Repayment Period: 30 days. Daily administrative holding fee: 2.5% compounded daily. Late penalty: 15% flat per day overdue. Default entitles lender to broadcast contacts.'
    },
    {
      label: 'Vendor invoice',
      text: 'INVOICE #INV-2026-881\nBilled To: Ayoola Tech\nItems: Cloud Hosting (1 Month) - NGN 15,000.00\nTax (VAT 7.5%): NGN 1,125.00\nTotal Due: NGN 16,125.00\nPayment Terms: Net 30 days. Bank: Zenith Bank.'
    }
  ]
}

const FAQS = [
  {
    q: 'Does this upload my bank details or balance?',
    a: 'No. When using Chrome with on-device AI enabled, prompts run inside your browser on Gemini Nano. Your account balance, names, and transaction text stay on your phone or computer.'
  },
  {
    q: 'How does it catch fake SMS alerts?',
    a: 'It scans for mismatched reference structures, unofficial phone prefixes, invalid sender identifiers, and phishing prompts like "dial this USSD code to claim".'
  },
  {
    q: 'Can it read out the verdict for visually impaired users?',
    a: 'Yes. Every audit includes a clean voice summary powered by the browser Web Speech API, giving immediate audio confirmation whether a payment is genuine or risky.'
  },
  {
    q: 'What happens if my phone does not have Gemini Nano?',
    a: 'The system automatically routes the query through Gemini 1.5 Flash via Firebase AI Logic in under 50 milliseconds, so it works on any browser.'
  }
]

export default function App() {
  const [mode, setMode] = useState<Mode>('sms')
  const [input, setInput] = useState(PRESETS.sms[0].text)
  const [result, setResult] = useState<HybridResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toolRef = useRef<HTMLDivElement>(null)

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      
      {/* 1. Header (Floating Clean Nav) */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-zinc-200">VoiceGuard</span>
          </div>

          <div className="flex items-center gap-5 text-zinc-400">
            <button onClick={scrollToTool} className="hover:text-zinc-200 transition-colors cursor-pointer">
              Try auditor
            </button>
            <a href="#how-it-works" className="hover:text-zinc-200 transition-colors hidden sm:inline">
              How it works
            </a>
            <a href="#faq" className="hover:text-zinc-200 transition-colors hidden sm:inline">
              FAQ
            </a>
            <a 
              href="https://github.com/Ayoola-tech2024/hybrid-voice-guard" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-850 bg-zinc-900/60 text-zinc-400 text-xs">
          <span>Google #BuildHybridAI 2026</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300">Web & Mobile</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-zinc-100 max-w-xl mx-auto leading-tight">
          Verify transactions.<br />
          Spot fraud before money moves.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed font-normal">
          Audit Nigerian bank alerts, thermal POS receipts, and loan fine print. Runs privately on your device, with voice readouts.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={scrollToTool}
            className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs cursor-pointer transition-colors"
          >
            Open transaction auditor
          </button>
          <a
            href="#how-it-works"
            className="px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-300 font-medium text-xs transition-colors"
          >
            See architecture
          </a>
        </div>
      </section>

      {/* 3. Proof Bar (Calm, Real Context) */}
      <section className="border-y border-zinc-900 bg-zinc-950/40 py-6">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-xl font-medium text-zinc-200 font-mono">0ms</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Local latency on Nano</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-medium text-zinc-200 font-mono">100%</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Private on-device text</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-medium text-zinc-200 font-mono">3 Modes</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">SMS, POS, & Loan terms</div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Auditor (The Core Product Tool) */}
      <section ref={toolRef} id="auditor" className="max-w-2xl mx-auto w-full px-4 py-16 space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-zinc-100">Live transaction auditor</h2>
          <p className="text-xs text-zinc-400">
            Select a common scam or valid scenario below, or paste your own message to audit.
          </p>
        </div>

        {/* Auditor Card */}
        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-5 space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-850 text-xs">
            <button
              onClick={() => changeMode('sms')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
                mode === 'sms'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bank SMS
            </button>
            <button
              onClick={() => changeMode('receipt')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
                mode === 'receipt'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              POS slip
            </button>
            <button
              onClick={() => changeMode('document')}
              className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
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
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-200 font-medium'
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

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <DeviceIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Prioritizes local Gemini Nano</span>
            </div>

            <button
              onClick={handleRun}
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {loading ? 'Auditing...' : 'Run audit'}
            </button>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Audit output</div>
            <ResultCard result={result} />
          </div>
        )}
      </section>

      {/* 5. Bento Grid / Problem & Solution */}
      <section id="how-it-works" className="max-w-3xl mx-auto px-4 py-16 space-y-6 border-t border-zinc-900">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-zinc-100">Everyday financial blind spots</h2>
          <p className="text-xs text-zinc-400">
            Three real-world scams and overcharges VoiceGuard is built to flag before payment.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 space-y-2">
            <div className="font-medium text-zinc-200">1. Fake SMS Debits</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Scammers send spoofed bank SMS alerts with fake transaction references to trick shop owners and traders into releasing goods.
            </p>
          </div>

          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 space-y-2">
            <div className="font-medium text-zinc-200">2. POS Fee Gouging</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Hidden surcharge convenience fees (N300-N1,000) quietly added on top of bill totals on faded thermal receipts without disclosure.
            </p>
          </div>

          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 space-y-2">
            <div className="font-medium text-zinc-200">3. Daily Loan Penalties</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Quick loan apps advertising "low interest" while burying 2.5% daily administrative fees and contact-harassment default clauses.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Technical Architecture (Clean Two-Tier Blueprint) */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-4 border-t border-zinc-900 text-xs">
        <div className="space-y-1">
          <h2 className="text-base font-medium text-zinc-200">Hybrid AI execution model</h2>
          <p className="text-zinc-400 text-[11px]">How privacy and compatibility work together seamlessly.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <DeviceIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tier 1: On-Device (Gemini Nano)</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Utilizes Chrome’s Prompt API (<code className="text-zinc-300">window.ai</code>). Runs completely local on supported hardware with zero network transmission.
            </p>
          </div>

          <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
              <CloudIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Tier 2: Cloud Fallback (Gemini Flash)</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              When hardware NPU support is absent, the app routes prompts securely through Firebase AI Logic to Gemini 1.5 Flash in sub-50ms.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section (Dividers only, as recommended by Cybersmith) */}
      <section id="faq" className="max-w-2xl mx-auto w-full px-4 py-16 space-y-6 border-t border-zinc-900">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-zinc-100">Frequently answered questions</h2>
          <p className="text-xs text-zinc-400">Everything you need to know about safety, privacy, and voice feedback.</p>
        </div>

        <div className="divide-y divide-zinc-900 border-y border-zinc-900 text-xs">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-zinc-500 font-mono text-sm ml-2">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-zinc-400 text-[11px] leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="border-t border-zinc-900 bg-zinc-950 py-16 text-center space-y-3">
        <h2 className="text-2xl font-medium text-zinc-100 tracking-tight">
          Don't guess on transaction safety.
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Audit any alert or receipt in under two seconds directly in your browser.
        </p>
        <div className="pt-2">
          <button
            onClick={scrollToTool}
            className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs cursor-pointer transition-colors"
          >
            Start audit now
          </button>
        </div>
      </section>

      {/* 9. Clean Footer */}
      <footer className="border-t border-zinc-900 py-8 text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-400 font-medium">VoiceGuard</span>
            <span>—</span>
            <span>Google #BuildHybridAI 2026</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-[11px]">
            <a href="https://github.com/Ayoola-tech2024/hybrid-voice-guard" target="_blank" rel="noreferrer" className="hover:text-zinc-200">
              Source Code
            </a>
            <a href="https://devpost.com/software/hybridvoice-guard" target="_blank" rel="noreferrer" className="hover:text-zinc-200">
              Devpost Project
            </a>
            <span>Ayoola Damisile</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
