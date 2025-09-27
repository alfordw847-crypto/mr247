"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface RefCodeProps {
  refCode: string;
}

export default function RefCodeBox({ refCode }: RefCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  };

  return (
    <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl">
      <input
        type="text"
        value={refCode}
        readOnly
        className="flex-1 bg-transparent border-none outline-none text-purple-700 font-medium"
      />
      <button
        onClick={handleCopy}
        className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-purple-700" />
        )}
      </button>
    </div>
  );
}
