import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { InputForm } from './components/InputForm';
import { ICPResult } from './components/ICPResult';
import { generateICP } from './services/geminiService';
import { AppState, ICPData } from './types';
import { AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global declaration for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [icpData, setIcpData] = useState<ICPData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Store last inputs for retry logic and refinement context
  const [lastInputs, setLastInputs] = useState<{ text: string, region: string, industry: string } | null>(null);

  const handleGenerate = async (text: string, region: string, industry: string) => {
    setLastInputs({ text, region, industry });
    setAppState(AppState.GENERATING);
    setErrorMsg(null);
    try {
      const data = await generateICP(text, region, industry);
      setIcpData(data);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "An unexpected error occurred while generating the ICP.");
    }
  };

  const handleRetry = () => {
    if (lastInputs) {
      handleGenerate(lastInputs.text, lastInputs.region, lastInputs.industry);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setIcpData(null);
    setErrorMsg(null);
    setLastInputs(null);
  };

  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 relative overflow-x-hidden">
          {/* Background Gradients */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]"></div>
            <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-amber-900/10 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[128px]"></div>
          </div>

          {/* Main Content */}
          <main className="w-full max-w-7xl mx-auto px-4 pb-12 relative z-10">
            <div className="text-center py-12 md:py-20">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-3 drop-shadow-sm">
                Cehpoint
              </h1>
              <p className="text-amber-500/80 text-xs md:text-sm uppercase tracking-[0.3em] font-medium border-t border-amber-500/20 inline-block pt-4 px-8 mt-2">
                Strategic Intelligence & Proposal AI
              </p>
            </div>

            <HeroSection />

            {appState === AppState.IDLE && (
              <div className="glass-panel p-1 rounded-2xl max-w-4xl mx-auto mt-8 animate-fade-in-up">
                <InputForm onSubmit={handleGenerate} isLoading={false} />
              </div>
            )}

            {appState === AppState.GENERATING && (
              <div className="glass-panel rounded-xl p-16 text-center shadow-2xl max-w-2xl mx-auto mt-12 border border-indigo-500/30 relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-2 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-2 border-t-amber-500 border-l-transparent border-b-transparent border-r-transparent rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]"></div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Analyzing Vectors</h3>
                  <p className="text-slate-400 text-sm mb-8">Deploying strategic models for market fit...</p>

                  <div className="space-y-3 max-w-xs mx-auto text-left">
                    <div className="flex items-center gap-3 text-indigo-200/80 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="font-mono">Global Market Scan ... <span className="text-emerald-400">OK</span></p>
                    </div>
                    <div className="flex items-center gap-3 text-indigo-200/80 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse delay-75"></div>
                      <p className="font-mono">Psychographic Profiling ... <span className="text-amber-400">Processing</span></p>
                    </div>
                    <div className="flex items-center gap-3 text-indigo-200/80 text-xs">
                      <div className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse delay-150"></div>
                      <p className="font-mono">Proposal Synthesis ... <span className="text-slate-500">Pending</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {appState === AppState.ERROR && (
              <div className="max-w-xl mx-auto mt-10">
                <div className="bg-red-950/40 border border-red-900/50 rounded p-6 shadow-lg flex items-start gap-4 backdrop-blur-sm">
                  <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-400 text-sm uppercase mb-2 tracking-wide">Analysis Interrupted</h3>
                    <p className="text-red-200/80 text-sm leading-relaxed mb-6">{errorMsg}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleRetry}
                        className="px-5 py-2 bg-red-900/50 hover:bg-red-800 text-white text-xs font-bold uppercase rounded border border-red-700 hover:border-red-500 transition-all"
                      >
                        Retry Operation
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-5 py-2 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold uppercase rounded border border-slate-700 hover:border-slate-500 transition-all"
                      >
                        New Strategy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {appState === AppState.COMPLETE && icpData && (
              <ICPResult
                data={icpData}
                originalInput={lastInputs?.text || ''}
                onReset={handleReset}
                onRetry={handleRetry}
              />
            )}

          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800/50 mt-20 py-8 text-center text-slate-600 text-xs no-print uppercase tracking-[0.2em] font-medium relative z-10">
            Cehpoint • Intelligent Systems
          </footer>
        </div>
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;