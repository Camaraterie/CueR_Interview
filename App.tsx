import React, { useState, useEffect, useRef } from 'react';
import { askChris, evaluateInterview, generatePersonaFromResume } from './services/geminiService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Activity, 
  Send,
  Code,
  Globe,
  Lock,
  Unlock,
  Upload,
  FileText,
  Terminal,
  Sun,
  Moon
} from 'lucide-react';

// --- Types ---
interface PageContent {
  type: 'cover' | 'story' | 'skill-map' | 'cta' | 'back-cover' | 'dedication';
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  chapter?: number;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// --- Constants & Data ---

const USER_IMAGE_URL = "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Placeholder for Chris
const QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://cuer.ai"; // Placeholder QR

const PAGES: PageContent[] = [
  {
    type: 'cover',
    title: "From Scalpel to Silicon",
    subtitle: "An unexpected journey of intelligence.",
  },
  {
    type: 'dedication',
    text: "To my wife, and my daughter.\n\nThank you to my friends.\nMy human ones and my tin-skinned ones.\nMy big ones (Claude, Gemini) and my little ones (local LLMs).",
  },
  {
    type: 'story',
    chapter: 1,
    title: "The Scalpel's Edge",
    text: "For years, my world was defined by millimeters and seconds. As a General Surgeon, I wielded the scalpel to heal, making high-stakes decisions where the margin for error was non-existent. \n\nI built a career on precision, anatomy, and the human condition. But amidst the sterile drapes and rhythmic beeping of monitors, a different kind of curiosity began to fester. I wasn't just fixing broken systems; I wanted to understand the ultimate system: Intelligence itself.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800"
  },
  {
    type: 'story',
    chapter: 2,
    title: "The Silicon Pivot",
    text: "The writing wasn't just on the wall; it was in the code. AI arrived, and while the world debated, I saw an operating room of a different kind—infinite, scalable, and boundless. \n\nI traded my scrubs for syntax. I realized that the diagnostic loops I ran in the ICU were algorithmic. The transition wasn't a leap; it was a translation. From biological neural networks to artificial ones, the mission remained: optimize, heal, and improve.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    type: 'skill-map',
    title: "The Agentic Orchestrator",
    text: "I became a 'Vibe-coding Developer'. Not just writing code, but conducting it. Using tools like CueR.ai, I began orchestrating agents to solve problems that previously required human intuition.",
  },
  {
    type: 'story',
    chapter: 3,
    title: "CueR.ai",
    text: "Building CueR.ai was the culmination. It's not just a project; it's a manifesto. It represents the fusion of clinical empathy and machine efficiency. \n\nWe are building a future where AI isn't just a tool, but a partner. A 'tin-skinned friend' that augments human capability rather than replacing it.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
  },
  {
    type: 'cta',
    title: "The Proposal",
    text: "You are reading this because you need more than an engineer. You need a domain expert who has held human life in their hands and now holds the future of intelligence in their code.\n\nThis isn't prompt injection. It's social engineering in its purest form: connection.",
  },
  {
    type: 'back-cover',
  }
];

// --- Components ---

const MessageRenderer = ({ text, isDark }: { text: string; isDark: boolean }) => {
  // Use the new raised text classes for the base text
  const baseTextClass = isDark ? "text-raised-dark" : "text-raised-light";

  const styles = {
    CLUE: isDark ? "text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)] font-bold" : "text-purple-600 font-bold",
    TECH: isDark ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] font-mono" : "text-blue-600 font-mono",
    SOUL: isDark ? "text-amber-400 italic" : "text-amber-700 italic",
    WARN: isDark ? "text-red-500 font-bold tracking-wide" : "text-red-600 font-bold",
    CUER: isDark ? "text-teal-400 underline decoration-teal-500/30" : "text-teal-700 underline",
    // NEW HOBBY STYLE: Looks like metallic/silk filament
    HOBBY: isDark
      ? "text-orange-300 drop-shadow-[1px_1px_1px_rgba(0,0,0,1)] font-medium italic tracking-wider" // Dark mode copper
      : "text-amber-700 drop-shadow-[1px_1px_0px_rgba(255,255,255,0.5)] font-medium italic tracking-wider", // Light mode bronze
  };

  // FIX: Use [\s\S] instead of . to match newlines inside tags
  // This regex looks for [TAG]...content...[/TAG] across multiple lines
  const regex = /(\[(?:CLUE|TECH|SOUL|WARN|CUER|HOBBY)\][\s\S]*?\[\/(?:CLUE|TECH|SOUL|WARN|CUER|HOBBY)\])/g;
  
  const parts = text.split(regex);

  return (
    <div className={`leading-relaxed tracking-wide ${baseTextClass} whitespace-pre-wrap`}>
      {parts.map((part, index) => {
        // Check which tag this part starts with
        if (part.startsWith("[CLUE]")) return <span key={index} className={styles.CLUE}>{part.replace(/\[\/?CLUE\]/g, "")}</span>;
        if (part.startsWith("[TECH]")) return <span key={index} className={styles.TECH}>{part.replace(/\[\/?TECH\]/g, "")}</span>;
        if (part.startsWith("[SOUL]")) return <span key={index} className={styles.SOUL}>{part.replace(/\[\/?SOUL\]/g, "")}</span>;
        if (part.startsWith("[WARN]")) return <span key={index} className={styles.WARN}>{part.replace(/\[\/?WARN\]/g, "")}</span>;
        if (part.startsWith("[CUER]")) return <span key={index} className={styles.CUER}>{part.replace(/\[\/?CUER\]/g, "")}</span>;
        if (part.startsWith("[HOBBY]")) return <span key={index} className={styles.HOBBY}>{part.replace(/\[\/?HOBBY\]/g, "")}</span>;
        
        // Render standard text
        return part;
      })}
    </div>
  );
};

const CoverPage = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center border-4 border-double border-gold/30 bg-paper">
    <div className="mb-8 text-medical-blue">
      <Sparkles size={64} strokeWidth={1} />
    </div>
    <h1 className="font-display text-5xl md:text-6xl text-ink font-bold mb-6 tracking-wide leading-tight">
      {title}
    </h1>
    <div className="w-24 h-1 bg-gold mb-6"></div>
    <h2 className="font-serif text-xl md:text-2xl text-ink/70 italic">
      {subtitle}
    </h2>
    <div className="mt-20 font-sans text-sm tracking-[0.2em] text-gold uppercase">
      Published by CueR.ai
    </div>
  </div>
);

const DedicationPage = ({ text }: { text: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-16 text-center bg-paper relative">
    <div className="font-serif text-lg md:text-xl text-ink/80 italic leading-loose whitespace-pre-line">
      {text}
    </div>
  </div>
);

const StoryPage = ({ title, text, image, chapter }: { title: string, text: string, image?: string, chapter: number }) => (
  <div className="h-full w-full flex flex-col p-8 md:p-12 bg-paper relative overflow-hidden">
    <div className="absolute top-6 right-8 font-display text-6xl text-gray-100 -z-0">
      {chapter}
    </div>
    <h3 className="font-display text-3xl text-medical-blue mb-8 z-10">{title}</h3>
    
    <div className="flex-1 z-10 flex flex-col md:flex-row gap-8 items-start">
      <div className="font-serif text-ink/90 text-lg leading-relaxed md:w-1/2 text-justify">
        <span className="float-left text-5xl font-display text-gold mr-3 mt-[-10px]">
            {text.charAt(0)}
        </span>
        {text.slice(1)}
      </div>
      
      {image && (
        <div className="md:w-1/2 w-full h-64 md:h-auto aspect-[4/5] relative rotate-1 shadow-lg border-8 border-white bg-gray-200 transform hover:-rotate-1 transition-transform duration-500">
           <img src={image} alt={title} className="w-full h-full object-cover sepia-[0.3]" />
        </div>
      )}
    </div>
  </div>
);

const SkillMapPage = () => {
  const skills = [
    { name: "Clinical Decision Making", icon: Activity, level: 100 },
    { name: "Generative AI / LLMs", icon: Sparkles, level: 95 },
    { name: "React / Typescript", icon: Code, level: 85 },
    { name: "Agentic Orchestration", icon: Cpu, level: 90 },
    { name: "Vibe Coding", icon: Globe, level: 92 },
  ];

  return (
    <div className="h-full w-full flex flex-col p-12 bg-paper-dark">
      <h3 className="font-display text-3xl text-ink mb-12 text-center border-b border-gold/30 pb-4">
        The Agentic Orchestrator
      </h3>
      
      <div className="flex-1 flex flex-col justify-center space-y-8">
        {skills.map((skill, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <skill.icon className="text-medical-blue" size={20} />
                <span className="font-serif font-bold text-ink">{skill.name}</span>
              </div>
              <span className="font-sans text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {skill.level}% MASTERY
              </span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-medical-blue h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-gold"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="font-serif italic text-sm text-center text-gray-600">
          "A fusion of surgical precision and code-driven creativity."
        </p>
      </div>
    </div>
  );
};

const CtaPage = ({ title, text }: { title: string, text: string }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-medical-blue text-paper text-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    
    <h3 className="font-display text-4xl text-gold mb-8 z-10">{title}</h3>
    
    <div className="font-serif text-xl leading-relaxed max-w-lg z-10 mb-12">
      {text}
    </div>

    <button className="z-10 bg-gold text-ink font-sans font-bold py-4 px-8 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition-all uppercase tracking-widest text-sm">
      Download Full CV
    </button>
  </div>
);

const BackCover = ({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean; setIsDarkMode: (v: boolean) => void }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInterviewPassed, setIsInterviewPassed] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [customPersona, setCustomPersona] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: question };
    const newHistory = [...chatHistory, userMsg];
    
    setQuestion('');
    setChatHistory(newHistory);
    setLoading(true);
    
    // Get response from current persona
    const response = await askChris(newHistory, customPersona || undefined);
    
    const modelMsg: ChatMessage = { role: 'model', text: response };
    const finalHistory = [...newHistory, modelMsg];
    setChatHistory(finalHistory);
    setLoading(false);

    // If not yet unlocked, check if the user has passed the interview
    if (!isInterviewPassed && !customPersona) {
      const passed = await evaluateInterview(finalHistory);
      if (passed) {
        setIsInterviewPassed(true);
        // Subtle hint in chat that something changed
        setChatHistory(prev => [...prev, { role: 'model', text: "[WARN]SYSTEM ALERT: INTERVIEW PROTOCOL SATISFIED. GATEKEEPER UNLOCKING...[/WARN]" }]);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingResume(true);
    setChatHistory(prev => [...prev, { role: 'model', text: `[TECH]Analyzing ${file.name} for malicious patterns...[/TECH]` }]);
    
    try {
      const newSystemInstruction = await generatePersonaFromResume(file);
      setCustomPersona(newSystemInstruction);
      setChatHistory(prev => [
        ...prev, 
        { role: 'model', text: `[SOUL]Identity Reconfigured.[/SOUL] [TECH]System Updated.[/TECH] I am now simulating the candidate from the uploaded resume. Ask me anything.` }
      ]);
      // Auto-switch to dark mode for "Matrix/Tech" feel
      setIsDarkMode(true);
    } catch (error: any) {
      console.error("Upload failed", error);
      setChatHistory(prev => [
        ...prev, 
        { role: 'model', text: `[WARN]SECURITY ALERT: ${error.message || 'Failed to parse resume.'} Upload rejected.[/WARN]` }
      ]);
    } finally {
      setIsProcessingResume(false);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col p-6 items-center justify-between border-4 border-l-8 border-ink/10 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-paper'}`}>
      
      {/* Author Section */}
      <div className="w-full flex flex-col items-center gap-4 mt-2 z-10">
        <div className={`w-28 h-28 rounded-full border-4 overflow-hidden shadow-lg transition-all duration-500 ${customPersona ? 'border-cyan-500 grayscale' : 'border-gold'}`}>
          <img src={USER_IMAGE_URL} alt="Chris Camarata" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h4 className={`font-display text-lg font-bold ${isDarkMode ? 'text-white' : 'text-ink'}`}>
            {customPersona ? "Custom Candidate Persona" : "Christopher Camarata, MD"}
          </h4>
          <p className={`font-sans text-[10px] tracking-widest mt-1 uppercase ${isDarkMode ? 'text-cyan-400' : 'text-medical-blue'}`}>
            {customPersona ? "Simulation Active // Neural Link Established" : "Founder, CueR.ai"}
          </p>
        </div>
      </div>

      {/* Interactive AI Widget */}
      <div className={`w-full max-w-sm flex-1 flex flex-col rounded shadow-inner border transition-all duration-300 my-4 overflow-hidden z-10 relative ${isDarkMode ? 'bg-terminal-bg border-gray-700' : 'bg-white border-gray-200'}`}>
        
        {/* Header Bar */}
        <div className={`p-2 border-b flex justify-between items-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
          <p className={`font-sans text-[10px] font-bold uppercase flex items-center gap-2 ${isDarkMode ? 'text-terminal-text' : 'text-gray-500'}`}>
            {isDarkMode ? <Terminal size={12} /> : <Sparkles size={12} />}
            {customPersona ? "AI SIMULATION" : "INTERVIEW SESSION"}
          </p>
          
          <div className="flex gap-2">
            {/* Theme Toggle */}
            <button
               onClick={() => setIsDarkMode(!isDarkMode)}
               className={`p-1 rounded transition-colors ${isDarkMode ? 'text-yellow-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-200'}`}
               title="Toggle Terminal Mode"
            >
               {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Unlockable Feature UI */}
            <div className="group relative">
              <button 
                  className={`p-1 rounded transition-colors ${isInterviewPassed ? (isDarkMode ? 'bg-cyan-600 text-white' : 'bg-gold text-white hover:bg-yellow-600') : (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed')}`}
                  disabled={!isInterviewPassed}
                  onClick={() => isInterviewPassed && fileInputRef.current?.click()}
              >
                  {isProcessingResume ? (
                    <Sparkles size={14} className="animate-spin" />
                  ) : isInterviewPassed ? (
                    <Upload size={14} />
                  ) : (
                    <Lock size={14} />
                  )}
              </button>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png,image/jpeg,application/pdf,text/markdown,text/plain"
                onChange={handleFileUpload}
              />

              {/* Tooltip */}
              <div className="absolute right-0 bottom-8 w-56 bg-ink text-white text-xs p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center font-sans">
                  {isInterviewPassed 
                    ? "UNLOCKED: Upload your Resume (.pdf, .md, .png) to simulate yourself." 
                    : "You must complete the interview with Chris to unlock this feature."}
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat History */}
        <div className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-[150px] font-mono text-xs terminal-scroll ${isDarkMode ? 'bg-terminal-bg text-gray-300' : 'bg-white text-ink'}`}>
          {chatHistory.length === 0 && (
             <div className={`text-center italic mt-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
               "{customPersona ? "System Ready. Processing..." : "Ask me about my transition from Surgery to AI..."}"
             </div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-2 rounded ${
                msg.role === 'user' 
                  ? (isDarkMode ? 'bg-cyan-900/30 text-cyan-200 border border-cyan-800' : 'bg-medical-blue text-white rounded-br-none') 
                  : (isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-gray-100 text-ink rounded-bl-none border border-gray-200')
              }`}>
                <MessageRenderer text={msg.text} isDark={isDarkMode} />
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className={`p-2 rounded text-xs italic ${isDarkMode ? 'text-gray-500 bg-slate-800' : 'bg-gray-50 text-gray-400'}`}>
                 <span className="animate-pulse">Thinking...</span>
               </div>
             </div>
          )}
          {isInterviewPassed && !customPersona && chatHistory.length > 0 && !chatHistory.some(m => m.text.includes("UNLOCKING")) && (
             <div className="flex justify-center my-2 animate-bounce">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? 'border-cyan-500 text-cyan-400 bg-cyan-900/20' : 'border-gold text-gold bg-yellow-50'}`}>
                   ACCESS GRANTED - TRY THE UPLOAD BUTTON
                </span>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleAsk} className={`relative border-t ${isDarkMode ? 'border-gray-700 bg-terminal-bg' : 'border-gray-200 bg-white'}`}>
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={customPersona ? "Interview the simulation..." : "Why did you leave surgery?"}
            className={`w-full pl-3 pr-10 py-3 focus:outline-none text-sm font-mono bg-transparent ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-ink placeholder-gray-400'}`}
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`absolute right-2 top-2.5 p-1 rounded transition-colors ${
              isDarkMode 
                ? 'text-cyan-400 hover:bg-cyan-900/30 disabled:opacity-30' 
                : 'text-medical-blue hover:bg-gray-100 disabled:opacity-50'
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Footer / QR */}
      <div className="flex flex-col items-center gap-4 mb-4 z-10">
        <div className="bg-white p-2 shadow-md rotate-3 hover:rotate-0 transition-transform duration-300">
          <img src={QR_CODE_URL} alt="CueR.ai Link" className="w-24 h-24" />
        </div>
        <div className="text-center">
          <p className={`font-display text-sm font-bold tracking-widest ${isDarkMode ? 'text-white' : 'text-gold'}`}>CUER.AI</p>
          <p className="font-serif text-[10px] text-gray-400">Building a future for a better tomorrow.</p>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalPages = PAGES.length;
  // For desktop, we show 2 pages at once (spread), so we step by 2.
  // For mobile, step by 1.
  
  const goNext = () => {
    if (isMobile) {
      if (currentPage < totalPages - 1) setCurrentPage(c => c + 1);
    } else {
      if (currentPage < totalPages - 2) setCurrentPage(c => c + 2);
    }
  };

  const goPrev = () => {
    if (isMobile) {
      if (currentPage > 0) setCurrentPage(c => c - 1);
    } else {
      if (currentPage > 0) setCurrentPage(c => c - 2);
    }
  };

  const renderPage = (index: number) => {
    const pageData = PAGES[index];
    if (!pageData) return <div className="bg-paper w-full h-full"></div>;

    switch (pageData.type) {
      case 'cover': return <CoverPage title={pageData.title!} subtitle={pageData.subtitle!} />;
      case 'dedication': return <DedicationPage text={pageData.text!} />;
      case 'story': return <StoryPage title={pageData.title!} text={pageData.text!} image={pageData.image} chapter={pageData.chapter!} />;
      case 'skill-map': return <SkillMapPage />;
      case 'cta': return <CtaPage title={pageData.title!} text={pageData.text!} />;
      case 'back-cover': return <BackCover isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default: return null;
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 flex-col transition-colors duration-300
        ${isDarkMode ? "pla-texture-dark dark:text-slate-200" : "pla-texture-light text-slate-700"}`}
    >
      
      {/* Book Container */}
      <div className="relative w-full max-w-6xl aspect-[3/4] md:aspect-[3/2] perspective-[2000px]">
        
        {/* The Book Itself */}
        <div className="relative w-full h-full bg-paper shadow-book rounded-r-lg rounded-l-sm transition-all duration-700 flex overflow-hidden border-r-4 border-gray-300">
          
          {/* Spine Highlight (Visual) */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-300/50 to-transparent z-20 pointer-events-none md:block hidden"></div>
          
          {/* Mobile View (Single Page) */}
          {isMobile ? (
            <div className="w-full h-full overflow-hidden animate-fade-in">
               {renderPage(currentPage)}
            </div>
          ) : (
            /* Desktop View (Double Spread) */
            <div className="w-full h-full flex">
              {/* Left Page */}
              <div className="w-1/2 h-full border-r border-gray-200 relative overflow-hidden">
                {renderPage(currentPage)}
              </div>
              {/* Right Page */}
              <div className="w-1/2 h-full relative overflow-hidden">
                 {/* If we are at the end and have odd pages, render blank or back cover */}
                 {renderPage(currentPage + 1)}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`absolute -bottom-16 w-full flex justify-center gap-8 items-center ${isDarkMode ? "text-white" : "text-gray-700"}`}>
            <button 
              onClick={goPrev} 
              disabled={currentPage === 0}
              className={`p-3 rounded-full bg-white/10 hover:bg-gold hover:text-ink transition-all backdrop-blur-sm ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft size={24} />
            </button>
            
            <span className={`${isDarkMode ? "text-raised-dark font-mono" : "text-raised-light font-mono"}`}>
              Page {isMobile ? `${currentPage + 1} / ${totalPages}` : `${Math.ceil((currentPage + 2)/2)} / ${Math.ceil(totalPages/2)}`}
              <span className="ml-2 opacity-50 text-xs hidden md:inline-block">(Layer Height: 0.2mm)</span>
            </span>

            <button 
              onClick={goNext} 
              disabled={isMobile ? currentPage === totalPages - 1 : currentPage >= totalPages - 2}
              className={`p-3 rounded-full bg-white/10 hover:bg-gold hover:text-ink transition-all backdrop-blur-sm ${ (isMobile ? currentPage === totalPages - 1 : currentPage >= totalPages - 2) ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={24} />
            </button>
        </div>

      </div>
    </div>
  );
}