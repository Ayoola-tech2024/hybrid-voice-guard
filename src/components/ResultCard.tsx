import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  Volume2,
  Shield,
  XCircle,
} from "lucide-react";
import type { HybridResult } from "../lib/hybridAI";
import { InferenceBadge } from "./InferenceBadge";
import { speak } from "../lib/voice";

interface ResultCardProps {
  result: HybridResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isFraud = result.fraudFlag;
  const isApproved = result.status === "APPROVED";

  const speakResult = () => {
    const msg = isFraud
      ? `Warning! Fraud detected. ${result.result}`
      : `${result.status || "Analysis complete"}. ${result.amount ? `Amount: ${result.amount}.` : ""} ${result.sender ? `From: ${result.sender}.` : ""} ${result.result}`;
    speak(msg);
  };

  return (
    <div
      className={`rounded-2xl border p-6 space-y-4 transition-all ${
        isFraud
          ? "border-rose-500/40 bg-rose-500/5"
          : isApproved
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-slate-700 bg-slate-900/60"
      }`}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {isFraud ? (
            <XCircle className="h-7 w-7 text-rose-400 shrink-0" />
          ) : isApproved ? (
            <CheckCircle className="h-7 w-7 text-emerald-400 shrink-0" />
          ) : (
            <Shield className="h-7 w-7 text-sky-400 shrink-0" />
          )}
          <div>
            <p
              className={`text-lg font-extrabold ${
                isFraud
                  ? "text-rose-400"
                  : isApproved
                  ? "text-emerald-400"
                  : "text-sky-400"
              }`}
            >
              {isFraud
                ? "⚠ Fraud Risk Detected"
                : result.status === "APPROVED"
                ? "✓ Transaction Verified"
                : result.status === "DECLINED"
                ? "✗ Transaction Declined"
                : "Analysis Complete"}
            </p>
            <p className="text-xs text-slate-400">
              Confidence:{" "}
              <span
                className={`font-bold ${
                  result.confidence === "high"
                    ? "text-emerald-400"
                    : result.confidence === "medium"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {result.confidence?.toUpperCase()}
              </span>
            </p>
          </div>
        </div>

        {/* Speak Button */}
        <button
          onClick={speakResult}
          aria-label="Read result aloud"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors"
        >
          <Volume2 className="h-4 w-4 text-indigo-400" />
          Read Aloud
        </button>
      </div>

      {/* Key Fields */}
      {(result.amount || result.sender) && (
        <div className="grid grid-cols-2 gap-3">
          {result.amount && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                Amount
              </p>
              <p className="text-xl font-black text-white mt-0.5">
                {result.amount}
              </p>
            </div>
          )}
          {result.sender && (
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                Sender / Bank
              </p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">
                {result.sender}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
        <p className="text-sm text-slate-200 leading-relaxed">{result.result}</p>
      </div>

      {/* Fraud Warning */}
      {isFraud && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-300 leading-relaxed font-medium">
            Do NOT confirm this transaction or enter your PIN until you have
            independently verified this alert by calling your bank directly.
          </p>
        </div>
      )}

      {/* Inference Badge */}
      <InferenceBadge mode={result.mode} latencyMs={result.latencyMs} />
    </div>
  );
};
