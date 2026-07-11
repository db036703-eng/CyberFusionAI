import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Button } from '../ui/Button'
import { Brain, Send, User, RefreshCw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const AiAnalystPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Good morning Operator #04. I have indexed active log events. How can I assist with threat isolation or host auditing today?' }
  ])
  const [inputVal, setInputVal] = useState('')
  const [typing, setTyping] = useState(false)

  const handleSend = () => {
    if (!inputVal.trim()) return
    const userMsg: Message = { role: 'user', content: inputVal }
    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setTyping(true)

    // Mock AI response
    setTimeout(() => {
      setTyping(false)
      const assistMsg: Message = {
        role: 'assistant',
        content: `I have audited active databases matching your query. Incident INC-2026-001 (adversary SSH bruteforce) is targeting DB-Node 10.0.4.82. I recommend blocking IP 198.51.100.12 and rotating the postgres credentials.`
      }
      setMessages((prev) => [...prev, assistMsg])
    }, 2000)
  }

  const promptChips = [
    'Audit recent database bruteforce logs',
    'Generate firewalls block commands for malicious IPs',
    'Inspect AD session anomaly on HR-workstation'
  ]

  return (
    <PageShell
      title="AI Analyst Chat"
      description="Leverage natural-language cognitive search across security databases, Docker container manifests, and proxy logs."
      breadcrumbs={['Automation', 'AI Analyst']}
    >
      <div className="flex flex-col h-[520px] bg-bg-secondary border border-border-custom rounded-xl overflow-hidden">
        {/* Header banner */}
        <div className="p-4 border-b border-border-custom bg-bg-primary/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-accent animate-pulse" />
            <span className="text-sm font-bold text-white">Cognitive Ingestion Console</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Model: Gemini 3.5 Pro</span>
        </div>

        {/* Message window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user'
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3.5 max-w-xl p-4 rounded-xl border ${
                  isUser 
                    ? 'bg-accent/10 border-accent/20 text-slate-200' 
                    : 'bg-bg-primary/45 border-border-custom/50 text-slate-300'
                }`}>
                  <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center border ${
                    isUser ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                  </div>
                  <div className="text-xs leading-relaxed mt-0.5 space-y-1">
                    <p>{m.content}</p>
                  </div>
                </div>
              </div>
            )
          })}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-bg-primary/30 border border-border-custom/30 text-slate-400 text-xs">
                <RefreshCw className="h-4 w-4 animate-spin text-accent" />
                <span className="font-mono">AI Analyst is auditing log registers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Prompt suggestions */}
        <div className="p-3 border-t border-border-custom bg-bg-primary/10 flex flex-wrap gap-2 shrink-0">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setInputVal(chip)}
              className="text-[10px] font-mono px-3 py-1 bg-bg-secondary border border-border-custom hover:border-accent/40 text-slate-450 hover:text-white rounded-lg transition duration-200 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border-custom bg-bg-primary/35 flex items-center space-x-3 shrink-0">
          <input
            type="text"
            placeholder="Type query to audit subnets, isolation rules or Docker hashes..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-100 placeholder-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!inputVal.trim() || typing}
            className="h-8.5 w-8.5 rounded-lg flex items-center justify-center border border-accent p-0 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
