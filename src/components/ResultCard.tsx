import type { HybridResult } from '../lib/hybridAI'
import { speak } from '../lib/voice'
import { AlertIcon, CheckIcon, VolumeIcon, DeviceIcon, CloudIcon } from './Icons'

interface ResultCardProps {
  result: HybridResult
}

export function ResultCard({ result }: ResultCardProps) {
  const isFraud = result.fraudFlag
  const isApproved = result.status === 'APPROVED'

  const handleSpeak = () => {
    const text = isFraud
      ? `Warning. Potential fraud detected. ${result.result}`
      : `Verified. ${result.result}`
    speak(text)
  }

  return (
    <div className="border border-zinc-800 bg-zinc-900/60 rounded-xl p-5 space-y-4">
      {/* Status Bar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {isFraud ? (
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <AlertIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckIcon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-zinc-100">
              {isFraud ? 'High risk detected' : isApproved ? 'Transaction verified' : 'Audit complete'}
            </div>
            <div className="text-xs text-zinc-400">
              {isFraud 
                ? 'Details deviate from standard banking formats' 
                : 'Structure and references match known patterns'}
            </div>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-xs text-zinc-300 font-medium cursor-pointer"
          title="Read audit aloud"
        >
          <VolumeIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span>Read aloud</span>
        </button>
      </div>

      {/* Structured Ledger (If amount/sender exists) */}
      {(result.amount || result.sender) && (
        <div className="grid grid-cols-2 gap-3 py-2 border-y border-zinc-800/80 text-xs">
          {result.amount && (
            <div>
              <div className="text-zinc-500 text-[11px]">Parsed amount</div>
              <div className="font-mono text-sm text-zinc-200 font-medium mt-0.5">{result.amount}</div>
            </div>
          )}
          {result.sender && (
            <div>
              <div className="text-zinc-500 text-[11px]">Merchant / Sender</div>
              <div className="font-medium text-zinc-200 mt-0.5">{result.sender}</div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Finding */}
      <div className="text-xs text-zinc-300 leading-relaxed font-normal">
        {result.result}
      </div>

      {/* Model Footnote */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
        <div className="flex items-center gap-1.5">
          {result.mode === 'on-device' ? (
            <>
              <DeviceIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Processed locally (Gemini Nano)</span>
            </>
          ) : (
            <>
              <CloudIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Processed via Cloud Fallback (Gemini Flash)</span>
            </>
          )}
        </div>
        {result.latencyMs > 0 && (
          <span className="font-mono">{result.latencyMs}ms</span>
        )}
      </div>
    </div>
  )
}
