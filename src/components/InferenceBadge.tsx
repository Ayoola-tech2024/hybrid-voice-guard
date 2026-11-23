import React from "react";
import { Cpu, Cloud, Zap } from "lucide-react";
import type { InferenceMode } from "../lib/hybridAI";

interface InferenceBadgeProps {
  mode: InferenceMode;
  latencyMs?: number;
}

const config = {
  "on-device": {
    icon: Cpu,
    label: "On-Device (Gemini Nano)",
    sub: "Private · Zero Latency · Offline",
    color: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
  },
  "cloud-fallback": {
    icon: Cloud,
    label: "Cloud Fallback (Gemini 1.5 Flash)",
    sub: "Firebase AI Logic · Enhanced Accuracy",
    color: "text-sky-400",
    border: "border-sky-500/30",
    bg: "bg-sky-500/10",
  },
  hybrid: {
    icon: Zap,
    label: "Hybrid Routing Active",
    sub: "On-Device → Cloud Fallback",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
};

export const InferenceBadge: React.FC<InferenceBadgeProps> = ({
  mode,
  latencyMs,
}) => {
  const { icon: Icon, label, sub, color, border, bg } = config[mode];
  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${border} ${bg}`}
    >
      <Icon className={`h-4 w-4 ${color} shrink-0`} />
      <div>
        <p className={`text-xs font-bold ${color}`}>{label}</p>
        <p className="text-[10px] text-slate-400">
          {sub}
          {latencyMs !== undefined && ` · ${latencyMs}ms`}
        </p>
      </div>
    </div>
  );
};
