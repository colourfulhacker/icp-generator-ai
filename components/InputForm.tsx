import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Database, Mic, MicOff } from 'lucide-react';

interface InputFormProps {
  onSubmit: (text: string, region: string, industry: string) => void;
  isLoading: boolean;
}

const DEFAULT_PLACEHOLDER = `Cehpoint
Technologies • Innovation • Intelligence

Service Catalog 2025-26
www.cehpoint.co.in

Vision & Mission
Cehpoint is more than a software company; we are a Digital Sovereign...`;

// Mapping Countries to specific Hubs/Cities
const MARKET_MAPPING: Record<string, string[]> = {
  "USA": ["New York", "San Francisco / Silicon Valley", "Austin", "Chicago", "Boston"],
  "United Kingdom": ["London", "Manchester", "Edinburgh"],
  "Germany": ["Munich", "Berlin", "Frankfurt", "Hamburg"],
  "Canada": ["Toronto", "Calgary", "Vancouver", "Montreal"],
  "Australia": ["Sydney", "Melbourne", "Brisbane"],
  "UAE": ["Dubai", "Abu Dhabi"],
  "India": ["Bangalore", "Mumbai", "Gurgaon", "Kolkata", "Hyderabad"],
  "Singapore": ["Singapore City"],
  "Switzerland": ["Zurich", "Geneva"],
  "Global / Remote": ["Worldwide"]
};

const HIGH_VALUE_INDUSTRIES = [
  "BFSI (Banking, Financial Services, Insurance)",
  "Enterprise SaaS & Cloud Computing",
  "Healthcare & Life Sciences (Biotech)",
  "Manufacturing & Industrial IoT",
  "E-Commerce & Retail Tech",
  "Real Estate & PropTech",
  "Energy, Oil & Gas (Cleantech)",
  "Logistics & Supply Chain Management",
  "Government & Public Sector",
  "Legal Tech & Professional Services",
  "Automotive & Autonomous Systems",
  "Education Technology (EdTech)"
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');

  const [country, setCountry] = useState("USA");
  const [city, setCity] = useState(MARKET_MAPPING["USA"][0]);
  const [industry, setIndustry] = useState(HIGH_VALUE_INDUSTRIES[0]);
  const [customIndustry, setCustomIndustry] = useState("");

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (MARKET_MAPPING[country]) {
      setCity(MARKET_MAPPING[country][0]);
    }
  }, [country]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        // Append to existing text or handle interim
        if (event.results[event.results.length - 1].isFinal) {
          setText(prev => prev + ' ' + event.results[event.results.length - 1][0].transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        // Auto restart if still listening state is true (optional, or just stop)
        if (isListening) {
          // recognitionRef.current.start(); 
          // Ideally we just respect the state, but simple toggle is safer for UX
          setIsListening(false);
        }
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleUseExample = () => {
    setText(DEFAULT_PLACEHOLDER);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const finalRegion = `${city}, ${country}`;
      const finalIndustry = customIndustry.trim() ? customIndustry : industry;
      onSubmit(text, finalRegion, finalIndustry);
    }
  };

  return (
    <div className="bg-white rounded border border-slate-300 overflow-hidden no-print mb-8">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm uppercase tracking-wide">
          <Database className="w-4 h-4 text-slate-500" />
          <span>Configuration</span>
        </div>
        <button
          onClick={handleUseExample}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
        >
          Load Catalog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">

        {/* Strategy Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Country Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Target Country
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-none text-sm text-slate-900 focus:border-slate-800 outline-none appearance-none"
                disabled={isLoading}
              >
                {Object.keys(MARKET_MAPPING).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Target Market / City
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-none text-sm text-slate-900 focus:border-slate-800 outline-none appearance-none"
                disabled={isLoading}
              >
                {MARKET_MAPPING[country]?.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              Target Industry
            </label>
            <div className="relative">
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setCustomIndustry(""); // Clear custom if dropdown used
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-none text-sm text-slate-900 focus:border-slate-800 outline-none appearance-none mb-2"
                disabled={isLoading}
              >
                {HIGH_VALUE_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
                <option value="Other">Other (Specify below)</option>
              </select>
              {industry === "Other" && (
                <input
                  type="text"
                  placeholder="Enter specific industry..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 text-sm"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="companyData" className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Service Capabilities & Offerings</span>
            {isListening && <span className="text-xs text-red-500 font-bold animate-pulse">● Listening...</span>}
          </label>
          <div className="relative">
            <textarea
              id="companyData"
              rows={8}
              className="w-full p-3 rounded-none border border-slate-300 bg-white text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:border-slate-800 outline-none resize-y pr-12"
              placeholder="Paste your service catalog, OR use the microphone to dictate your capabilities..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2 bottom-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-900'}`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white
              transition-all
              ${!text.trim() || isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
              }
            `}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              <>
                Generate Analysis
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};