import React, { useState } from 'react'
import { Mic, MicOff, ClipboardPaste, Loader2, Scan, MessageSquare, FileText } from 'lucide-react'
import { startListening } from '../lib/voice'
import clsx from 'clsx'

type Mode = 'receipt' | 'sms' | 'document'

interface InputPanelProps {
  mode: Mode
  onAnalyze: (text: string) => void
  isLoading: boolean
}

const PLACEHOLDERS: Record<Mode, string> = {
  receipt: `Paste your POS slip or receipt text here...\n\nExample:\nMerchant: GTBank POS\nAmount: NGN 5,500.00\nDate: 23/11/2026 14:32:01\nTrans ID: 00284773821\nStatus: APPROVED`,
  sms: `Paste your bank SMS alert here...\n\nExample:\nGT Bank: Acct ****4521 debited NGN15,000.00 on 23-Nov-2026 14:30 Trf to JOHN DOE. Avail bal: NGN32,450.00. Ref: 00291847`,
  document: `Paste the text from your financial document here...\n\nExample:\nLoan Agreement - Principal: NGN500,000\nMonthly Interest Rate: 2.5%\nTenor: 12 months\nMonthly Payment: NGN48,750`,
}

const MODE_ICONS: Record<Mode, React.ReactNode> = {
  receipt: <Scan className="w-5 h-5" />,
  sms: <MessageSquare className="w-5 h-5" />,
  document: <FileText className="w-5 h-5" />,
}

export default function InputPanel({ mode, onAnalyze, isLoading }: InputPanelProps) {
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')

  const handleVoiceToggle = async () => {
    if (listening) {
      setListening(false)
      return
    }
    setVoiceError('')
    setListening(true)
    try {
      const transcript = await startListening()
      setText(prev => (prev ? prev + '\n' + transcript : transcript))
    } catch {
      setVoiceError('Voice input not available. Please type your text.')
    } finally {
      setListening(false)
    }
  }

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText()
      setText(prev => (prev ? prev + '\n' + clip : clip))
    } catch {
      setVoiceError('Clipboard access denied. Please paste manually.')
    }
  }

  const handleSubmit = () => {
    if (!text.trim()) return
    onAnalyze(text.trim())
  }

  return (
    <div className="space-y-4">
      {/* Textarea */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2 text-sm text-slate-400">
          {MODE_ICONS[mode]}
          <span className="capitalize font-medium">{mode === 'sms' ? 'Bank SMS Alert' : mode === 'receipt' ? 'POS / Receipt Slip' : 'Financial Document'}</span>
        </div>
        <textarea
          className="w-full h-44 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          placeholder={PLACEHOLDERS[mode]}
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Voice error */}
      {voiceError && (
        <p className="text-xs text-amber-400 flex items-center gap-1">
          ⚠️ {voiceError}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        {/* Voice */}
        <button
          onClick={handleVoiceToggle}
          disabled={isLoading}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
            listening
              ? 'bg-red-900/40 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
          )}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {listening ? 'Stop' : 'Voice Input'}
        </button>

        {/* Paste */}
        <button
          onClick={handlePaste}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300 transition-all"
        >
          <ClipboardPaste className="w-4 h-4" />
          Paste
        </button>

        {/* Clear */}
        {text && (
          <button
            onClick={() => setText('')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-700 transition-all"
          >
            Clear
          </button>
        )}

        {/* Analyze — primary CTA */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !text.trim()}
          className={clsx(
            'ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg',
            isLoading || !text.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50 hover:shadow-emerald-700/40'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>🛡️ Analyze</>
          )}
        </button>
      </div>

      {/* Loading shimmer */}
      {isLoading && (
        <div className="space-y-2 mt-2 animate-pulse">
          <div className="h-3 bg-slate-700 rounded-full w-3/4" />
          <div className="h-3 bg-slate-700 rounded-full w-1/2" />
          <div className="h-3 bg-slate-700 rounded-full w-5/6" />
        </div>
      )}
    </div>
  )
}
