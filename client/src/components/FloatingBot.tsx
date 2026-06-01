import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, Volume2, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const FloatingBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hello! I am your AI Placement Assistant. Ask me anything about resume optimization, mock interviews, or preparation tips!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition setup (Web Speech API)
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel(); // stop any current speaking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      synth.speak(utterance);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: textToSend }]);
    setInput('');
    setIsTyping(true);

    // Simulate standard prompt queries locally
    setTimeout(() => {
      let reply = "That's a great question. Let me look that up for you. To score high in ATS tests, ensure your resume contains key tools (e.g. Docker, SQL) rather than generalized nouns. Also, utilize the STAR framework (Situation, Task, Action, Result) in behavioral mocks!";
      
      const query = textToSend.toLowerCase();
      if (query.includes('resume') || query.includes('cv')) {
        reply = "For a high resume score, use a single-column, clear layout. List your technical skills near the header, and always quantify achievements (e.g., 'Enhanced query efficiency by 30% using Redis indexing').";
      } else if (query.includes('interview') || query.includes('mock')) {
        reply = "When preparing for interviews, start with a confident 60-second summary. In technical rounds, always walk through your algorithmic approach out loud before writing a single line of code!";
      } else if (query.includes('roadmap') || query.includes('prepare')) {
        reply = "Our Job portal offers specific roadmaps for companies like Deloitte, Amazon, and Razorpay. Review standard Quantitative Aptitude and trees/graphs algorithmic puzzles daily.";
      } else if (query.includes('hello') || query.includes('hi')) {
        reply = "Hello there! Happy placement preparation. Ask me any resume, interview, or coding challenge questions.";
      }

      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: reply }]);
      setIsTyping(false);
      speak(reply);
    }, 1500);
  };

  const quickPrompts = [
    { label: 'Resume tips', text: 'How do I score over 85% on the ATS resume analyzer?' },
    { label: 'Interview help', text: 'What are the most common HR interview questions?' },
    { label: 'Roadmaps', text: 'How do I prepare for Razorpay and Amazon placement assessments?' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="glass-card glow-ring w-96 h-[500px] mb-4 rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-white/90 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot size={20} className="text-pink-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Placement Assistant AI</h3>
                  <span className="text-[10px] text-indigo-200 flex items-center gap-1">
                    <Sparkles size={10} className="animate-pulse" /> Online and Ready
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    voiceEnabled ? 'bg-white/20 text-pink-300' : 'text-indigo-200 hover:bg-white/10'
                  }`}
                  title={voiceEnabled ? "Voice Output Active" : "Voice Output Inactive"}
                >
                  <Volume2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#070b13]/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-50/30 dark:bg-slate-950/20">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-950">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
                title={isListening ? "Listening..." : "Dictate Prompt"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask your assistant..."
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleSend(input)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bot Bubble */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 glow-ring relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};
