import { Cpu, Cloud, ArrowRight, Wifi, WifiOff } from 'lucide-react'

export default function HybridArchDiagram() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
        How Hybrid Inference Works
      </h3>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-900/40 border border-emerald-700 flex items-center justify-center">
            <span className="text-2xl">📄</span>
          </div>
          <span className="text-xs text-slate-400 max-w-[80px]">Your Text Input</span>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

        {/* Step 2 — On-device */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-900/40 border border-blue-600 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-xs text-slate-400 max-w-[80px]">On-Device<br/>Gemini Nano</span>
          <div className="flex items-center gap-1">
            <WifiOff className="w-3 h-3 text-green-500" />
            <span className="text-[10px] text-green-400">Private</span>
          </div>
        </div>

        {/* OR */}
        <div className="text-slate-600 text-xs font-bold">OR</div>

        {/* Step 3 — Cloud */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-purple-900/40 border border-purple-600 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-xs text-slate-400 max-w-[80px]">Cloud Fallback<br/>Gemini Flash</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] text-purple-300">Firebase AI</span>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />

        {/* Step 4 — Output */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-900/40 border border-amber-600 flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
          <span className="text-xs text-slate-400 max-w-[80px]">Fraud Alert + Voice Readout</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-5">
        Gemini Nano runs <strong className="text-slate-400">on your device</strong> — your financial data never leaves unless cloud fallback is needed.
      </p>
    </div>
  )
}
