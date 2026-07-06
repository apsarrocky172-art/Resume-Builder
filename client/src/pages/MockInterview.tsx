import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bot, Mic, MicOff, ShieldAlert, Award, Star, ArrowRight, Zap } from 'lucide-react';

interface ChatMessage {
  role: 'ai' | 'user';
  text: string;
}

export const MockInterview: React.FC = () => {
  const { token } = useAuth();
  const [activeSession, setActiveSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'hr' | 'technical'>('technical');
  const [roleTopic, setRoleTopic] = useState('Software Engineer');

  // Interview session states
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  // Final Grade States
  const [completed, setCompleted] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition (Web Speech API) Init
  useEffect(() => {
    const SpeechReg = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechReg) {
      const rec = new SpeechReg();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      setRecognition(rec);
    }
  }, []);

  const toggleVoiceDictation = () => {
    if (!recognition) {
      alert('Vocal Speech recognition is not supported in this browser. Please use Chrome or Edge.');
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

  const speak = (text: string) => {
    if (!voiceOutput) return;
    const synth = window.speechSynthesis;
    if (synth) {
      synth.cancel(); // stop previous
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      synth.speak(utter);
    }
  };

  const bootInterviewSession = async () => {
    setLoading(true);
    setCompleted(false);
    setEvaluation(null);
    setMessages([]);

    try {
      const res = await axios.post('http://localhost:5000/api/interviews/start', { type, roleTopic }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviewId(res.data.interviewId);
      setMessages([{ role: 'ai', text: res.data.question }]);
      setActiveSession(true);
      speak(res.data.question);
    } catch (error: any) {
      console.error('[Interview] Start error:', error);
      alert(error.response?.data?.message || 'Failed to start interview. Check if LM Studio and Supabase are running.');
    } finally {
      setLoading(false);
    }
  };

  const postCandidateAnswer = async () => {
    if (!userInput.trim() || !interviewId) return;

    const answer = userInput;
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text: answer }]);
    setSubmittingAnswer(true);

    try {
      const res = await axios.post('http://localhost:5000/api/interviews/chat', { interviewId, text: answer }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [...prev, { role: 'ai', text: res.data.question }]);
      speak(res.data.question);
    } catch (error: any) {
      console.error('[Interview] Chat error:', error);
      alert(error.response?.data?.message || 'Failed to get AI response. Check LM Studio.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const wrapAndEvaluateSession = async () => {
    if (!interviewId) return;
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/interviews/finalize', { interviewId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvaluation(res.data);
      setActiveSession(false);
      setCompleted(true);
    } catch (error: any) {
      console.error('[Interview] Finalizing error:', error);
      alert(error.response?.data?.message || 'Failed to grade interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">AI Interview Simulator</h1>
        <p className="text-xs text-slate-400">Attend stateful oral interviews utilizing Web Speech and get instant rating cards.</p>
      </div>

      {/* VIEW A: INITIAL SETUP */}
      {!activeSession && !completed && (
        <div className="glass-card p-10 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 max-w-xl mx-auto space-y-6">
          <div className="bg-indigo-500/10 p-4 rounded-full w-fit mx-auto text-indigo-500">
            <Bot size={40} />
          </div>
          <h2 className="text-lg font-bold text-center">Configure Interview Parameters</h2>

          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Interview Category</label>
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={() => setType('technical')}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-colors ${
                    type === 'technical'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Technical Interview
                </button>
                <button
                  onClick={() => setType('hr')}
                  className={`py-3 rounded-2xl text-xs font-bold border transition-colors ${
                    type === 'hr'
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  HR & Behavioral
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Target Job Role</label>
              <input
                type="text"
                value={roleTopic}
                onChange={(e) => setRoleTopic(e.target.value)}
                placeholder="e.g. Software Engineer, React Developer"
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-400">
              <span>Voiced Audio Output:</span>
              <button
                onClick={() => setVoiceOutput(!voiceOutput)}
                className={`px-3 py-1 rounded-full font-bold transition-colors ${
                  voiceOutput ? 'bg-indigo-500/15 text-indigo-500' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'
                }`}
              >
                {voiceOutput ? 'Synthesizer Active' : 'Muted'}
              </button>
            </div>
          </div>

          <button
            onClick={bootInterviewSession}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.01]"
          >
            {loading ? 'Booting AI Engine...' : 'Start Vocal Assessment'}
          </button>
        </div>
      )}

      {/* VIEW B: LIVE INTERVIEW STREAM */}
      {activeSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat transcript */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col h-[520px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs shadow-sm flex items-start gap-2.5 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                  }`}>
                    {m.role === 'ai' && <Bot size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />}
                    <span>{m.text}</span>
                  </div>
                </div>
              ))}
              {submittingAnswer && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 p-3 rounded-2xl flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input dictations bar */}
            <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center gap-2">
              <button
                onClick={toggleVoiceDictation}
                className={`p-3 rounded-xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500'
                }`}
                title={isListening ? "Listening..." : "Dictate Answer"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && postCandidateAnswer()}
                placeholder="Type or dictate your structured response here..."
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none"
              />
              <button
                onClick={postCandidateAnswer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-lg transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right helper panel: instructions / Wrap */}
          <div className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between h-[520px]">
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <ShieldAlert size={16} className="text-amber-400" />
                <span>Simulations Guidelines</span>
              </h3>
              <ul className="space-y-3.5 text-[11px] text-slate-500 leading-relaxed">
                <li>1. Speak clearly when utilizing dictation options.</li>
                <li>2. Structure tech answers utilizing the Situation, Task, Action, Result framework.</li>
                <li>3. State complexities and database options clearly in system design rounds.</li>
              </ul>
            </div>
            <button
              onClick={wrapAndEvaluateSession}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {loading ? 'Evaluating Transcript...' : 'Wrap & Grade Interview'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW C: DETAILED ASSESSMENT SCORES */}
      {completed && evaluation && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Dashboard Summary Scores */}
          <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-6">
            <Award size={40} className="text-indigo-500 mx-auto" />
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">AI Evaluation Scorecard</h2>
              <p className="text-xs text-slate-400 capitalize mt-1">Target Profile: {roleTopic} ({type} track)</p>
            </div>

            {/* Metric counters grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-250/20 rounded-2xl">
                <div className="text-2xl font-extrabold text-indigo-500">{evaluation.scores.technical}%</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Technical Facts</div>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-250/20 rounded-2xl">
                <div className="text-2xl font-extrabold text-purple-500">{evaluation.scores.communication}%</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Communication</div>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-[#0b0f19]/40 border border-slate-250/20 rounded-2xl">
                <div className="text-2xl font-extrabold text-pink-500">{evaluation.scores.confidence}%</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Confidence rating</div>
              </div>
              <div className="p-4 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl">
                <div className="text-2xl font-extrabold text-amber-500">{evaluation.scores.overall}%</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Overall grading</div>
              </div>
            </div>
          </div>

          {/* Detailed Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-1">
                <Star size={16} className="text-amber-400" />
                <span>Identified Strengths</span>
              </h3>
              <ul className="space-y-2.5 text-[11px] text-slate-650">
                {evaluation.feedback.strengths.map((str: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Zap size={16} className="text-pink-500" />
                <span>Growth Roadmaps</span>
              </h3>
              <ul className="space-y-2.5 text-[11px] text-slate-655">
                {evaluation.feedback.suggestions.map((sug: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">»</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Analysis Paragraph */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-2.5">
            <h3 className="font-bold text-xs">Conversational Analysis Summary</h3>
            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">{evaluation.feedback.detailedAnalysis}</p>
          </div>

          <div className="text-center">
            <button
              onClick={() => { setCompleted(false); setEvaluation(null); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-8 py-3 rounded-xl shadow-md transition-colors"
            >
              Start New Interview Mock
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
