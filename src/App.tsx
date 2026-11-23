import { useState } from 'react'
import { analyzeWithHybridAI, type HybridResult } from './lib/hybridAI'
import { speak } from './lib/voice'
import { ResultCard } from './components/ResultCard'
import { 
  ShieldCheck, 
  MessageSquareWarning, 
  Receipt, 
  FileWarning, 
  Sparkles, 
  Lock,
  Cpu,
  Cloud
} from 'lucide-react'

type Mode = 'sms' | 'receipt' | 'document'

interface SampleCase {
  title: string
  label: string
  text: string
}

const SAMPLE_CASES: Record<Mode, SampleCase[]> = {
  sms: [
    {
      title: 'Fake Transfer Alert (Scam)',
      label: 'Fake N50,000 Credit Alert',
      text: 'Credit: NGN50,000.00 from ALHAJI MUSA USMAN. Date: 23-Nov-2026 11:42. Bal: NGN142,300.00. Ref: GTB/TX/993821098. Dial *737*0# to confirm.'
    },
    {
      title: 'Legitimate Debit Alert',
      label: 'Real N5,000 Grocery Debit',
      text: 'Acct: **4521 Debited: NGN5,000.00 on 23-Nov-2026 09:15:00 at SUPERMARKET POS. Avail Bal: NGN28,500.00. Ref: 20261123449102.'
    }
  ],
  receipt: [
    {
      title: 'POS Surcharge Overcharge',
      label: 'Overcharged POS Slip',
      text: 'MERCHANT: CORNER SHOP EXPRESS POS\nTERMINAL: 20394811\nDATE: 23/11/2026 10:14:00\nPURCHASE: NGN 2,500.00\nCONVENIENCE FEE: NGN 600.00\nTOTAL CHARGED: NGN 3,100.00\nSTATUS: APPROVED'
    },
    {
      title: 'Normal POS Slip',
      label: 'Normal Fuel Purchase',
      text: 'TOTAL OIL STATION VI LAGOS\nSTAN: 094821\nDATE: 23/11/2026 08:30:11\nAMOUNT: NGN 12,000.00\nSURCHARGE: NGN 0.00\nTOTAL: NGN 12,000.00\nAUTH CODE: 559021\nTRANSACTION APPROVED'
    }
  ],
  document: [
    {
      title: 'Predatory Loan Fine Print',
      label: 'Predatory Quick Loan Terms',
      text: 'Instant Cash Loan Agreement: Principal Amount: NGN 100,000. Repayment Period: 30 days. Daily administrative holding fee: 2.5% compounded daily. Late penalty: 15% flat per day overdue. Default entitles lender to broadcast contacts.'
    },
    {
      title: 'Standard Invoice',
      label: 'Verified Vendor Invoice',
      text: 'INVOICE #INV-2026-881\nBilled To: Ayoola Tech\nItems: Cloud Hosting (1 Month) - NGN 15,000.00\nTax (VAT 7.5%): NGN 1,125.00\nTotal Due: NGN 16,125.00\nPayment Terms: Net 30 days. Bank: Zenith Bank.'
    }
  ]
}

export default function App() {
  const [mode, setMode] = useState<Mode>('sms')
  const [inputText, setInputText] = useState(SAMPLE_CASES.sms[0].text)
  const [result, setResult] = useState<HybridResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    setIsLoading(true)
    setResult(null)
    try {
      const res = await analyzeWithHybridAI(inputText, mode === 'sms' ? 'sms-alert' : mode === 'receipt' ? 'receipt' : 'image-document')
      setResult(res)
      const speechMsg = res.fraudFlag 
        ? `Warning! Fraud Risk Detected. ${res.result}` 
        : `Verified. ${res.result}`
      speak(speechMsg)
    } catch {
      setResult({
        mode: 'cloud-fallback',
        latencyMs: 0,
        result: 'Analysis could not be completed. Please verify your input and retry.',
        confidence: 'low',
        fraudFlag: false
      })
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode: Mode) => {
    setMode(newMode)
    setInputText(SAMPLE_CASES[newMode][0].text)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">HybridVoice Guard</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Google Hybrid AI
                </span>
              </div>
              <p className="text-xs text-slate-400">On-Device & Cloud AI Financial Fraud Shield</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Private Local Inference
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro Banner */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Instant Financial Fraud Check
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Spot fake bank debit alerts, hidden POS surcharge fees, and predatory loan terms in seconds. 
            Runs <strong className="text-emerald-400 font-semibold">privately on your device</strong> with voice readout.
          </p>
        </section>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => switchMode('sms')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              mode === 'sms'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>Bank SMS Alert</span>
          </button>

          <button
            onClick={() => switchMode('receipt')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              mode === 'receipt'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>POS / Receipt Slip</span>
          </button>

          <button
            onClick={() => switchMode('document')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
              mode === 'document'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileWarning className="w-4 h-4" />
            <span>Loan / Agreement</span>
          </button>
        </div>

        {/* Input Box Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Quick Sample Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Try a real-life Nigerian scenario:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CASES[mode].map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(s.text)
                    setResult(null)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    inputText === s.text
                      ? 'bg-slate-800 border-emerald-500/60 text-emerald-300 font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste SMS text, POS printout text, or financial document details here..."
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Prioritizes local <strong>Gemini Nano</strong> (zero latency)</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with Hybrid AI...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Check For Fraud Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <section className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Analysis Verdict</span>
              </h2>
            </div>
            <ResultCard result={result} />
          </section>
        )}

        {/* Architectural Explainer for Judges & Users */}
        <section className="border border-slate-800/80 bg-slate-900/40 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>How Hybrid AI Protects Financial Privacy</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Tier 1: On-Device (Gemini Nano)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When supported by Chrome AI (<code className="text-slate-300">window.ai</code>), analysis executes directly on your phone or PC. Bank balances, names, and account numbers never touch external servers.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Cloud className="w-4 h-4" />
                <span>Tier 2: Cloud Fallback (Gemini Flash)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If your device lacks local NPU hardware, queries automatically route to Google's Gemini 1.5 Flash via Firebase AI Logic, ensuring 100% universal compatibility across every phone.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>Built for the <strong>#BuildHybridAI 2026</strong> Hackathon by Google</p>
        <p>Accessible financial security for everyday Nigerians · Built by Ayoola Damisile</p>
      </footer>
    </div>
  )
}
