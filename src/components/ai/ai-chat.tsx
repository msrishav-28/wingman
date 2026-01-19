'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import HolographicCard from '@/components/ui/holographic/HolographicCard'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatProps {
  conversationId: string
  onSendMessage: (message: string) => Promise<string>
  context?: any
}

export default function AIChat({ conversationId, onSendMessage, context }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await onSendMessage(input)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-2xl overflow-hidden border border-white/5">
      {/* Chat Header */}
      <div className="p-4 bg-white/5 border-b border-white/10 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center shadow-[0_0_15px_rgba(123,97,255,0.2)]">
            <Bot className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white tracking-wide">NEURAL COMPANION</h3>
            <p className="text-[10px] font-mono text-neon-purple tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-white/20" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>

                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border
                  ${message.role === 'user' ? 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue' : 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'}
                `}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`
                  p-4 rounded-xl text-sm leading-relaxed border
                  ${message.role === 'user'
                    ? 'bg-neon-blue/10 border-neon-blue/20 text-white rounded-tr-none'
                    : 'bg-white/5 border-white/10 text-text-secondary rounded-tl-none'
                  }
                `}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-[9px] font-mono opacity-40 mt-2 uppercase tracking-wider">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-neon-purple" />
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Query neural database..."
            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 pr-12 text-sm font-mono focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(123,97,255,0.1)] transition-all placeholder:text-white/20"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-neon-purple/20 rounded-md text-neon-purple transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
