"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  Type,
  Sparkles,
  X,
  UploadCloud,
  RotateCcw,
  Layers,
  ShieldCheck,
  AlertCircle,
  Check,
  ArrowRight,
  Info,
  FileCheck,
} from "lucide-react";
import { DEMO_SCENARIOS } from "@/data/demoScenarios";
import { AttachedFile } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  compressImageClient,
  readFileAsBase64,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_DOC_TYPES,
} from "@/lib/fileUtils";

interface UniversalInputProps {
  onAnalyze: (
    text: string,
    files: AttachedFile[],
    scenarioId?: string,
    inputSources?: Array<"text" | "voice" | "image" | "document">
  ) => void;
  isLoading: boolean;
}

type TabType = "text" | "voice" | "image" | "document";

export const UniversalInput: React.FC<UniversalInputProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [inputText, setInputText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Map active language to speech recognition locale code
  const getSpeechLangCode = (lang: string) => {
    switch (lang) {
      case "hi":
        return "hi-IN";
      case "kn":
        return "kn-IN";
      case "en":
      default:
        return "en-US";
    }
  };

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getSpeechLangCode(language);

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setInputText((prev) => {
              const cleaned = prev.endsWith(" ") ? prev : prev ? prev + " " : "";
              return cleaned + currentTranscript;
            });
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition notice:", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, [language]);

  // Timer for audio recording state
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    setVoiceNotice(null);
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
    } else {
      if (speechSupported && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          startSimulatedVoice();
        }
      } else {
        setVoiceNotice(
          "Voice input isn't supported in this browser. You can type your situation instead."
        );
        startSimulatedVoice();
      }
    }
  };

  const startSimulatedVoice = () => {
    setIsRecording(true);
    const sampleVoiceText =
      "I am reporting an emergency. My elderly neighbor collapsed on the staircase, breathing is shallow, and our elevator is broken.";
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx += 6;
      if (charIdx <= sampleVoiceText.length) {
        setInputText(sampleVoiceText.slice(0, charIdx));
      } else {
        clearInterval(interval);
        setIsRecording(false);
      }
    }, 120);
  };

  const processFileSelection = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`"${file.name}" exceeds the 10MB limit. Please attach a smaller file.`);
        continue;
      }

      const isImage = file.type.startsWith("image/");
      const isDoc =
        SUPPORTED_DOC_TYPES.includes(file.type) ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".docx");

      if (!isImage && !isDoc) {
        setUploadError(`"${file.name}" format is not supported. Please upload an image, PDF, or text document.`);
        continue;
      }

      try {
        if (isImage) {
          const { base64, previewUrl } = await compressImageClient(file);
          const newFile: AttachedFile = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type || "image/jpeg",
            size: `${(file.size / 1024).toFixed(1)} KB`,
            previewUrl,
            base64,
          };
          setAttachedFiles((prev) => [...prev, newFile]);
        } else {
          const { base64, textContent } = await readFileAsBase64(file);
          const newFile: AttachedFile = {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type || "application/pdf",
            size: `${(file.size / 1024).toFixed(1)} KB`,
            base64,
            extractedText: textContent,
          };
          setAttachedFiles((prev) => [...prev, newFile]);
        }
      } catch (err: any) {
        console.error("File read error:", err);
        setUploadError(`Failed to process "${file.name}". Please try again.`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileSelection(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileSelection(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const selectScenario = (scenarioId: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenarioId(scenario.id);
    setInputText(scenario.inputText);

    const scenarioFiles: AttachedFile[] = scenario.attachedFile ? [scenario.attachedFile] : [];
    setAttachedFiles(scenarioFiles);
    setActiveTab("text");

    // Derive multimodal sources
    const sources: Array<"text" | "voice" | "image" | "document"> = ["text"];
    if (scenario.attachedFile) {
      if (scenario.attachedFile.type.startsWith("image/")) sources.push("image");
      else sources.push("document");
    }

    // Automatically trigger analysis through the live Gemini pipeline
    onAnalyze(scenario.inputText, scenarioFiles, scenario.id, sources);
  };

  const calculateInputSources = (): Array<"text" | "voice" | "image" | "document"> => {
    const sources: Array<"text" | "voice" | "image" | "document"> = [];
    if (inputText.trim()) {
      if (activeTab === "voice") sources.push("voice");
      else sources.push("text");
    }
    if (attachedFiles.some((f) => f.type.startsWith("image/"))) {
      sources.push("image");
    }
    if (attachedFiles.some((f) => !f.type.startsWith("image/"))) {
      sources.push("document");
    }
    return sources.length > 0 ? sources : ["text"];
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && attachedFiles.length === 0) return;
    const sources = calculateInputSources();
    onAnalyze(inputText, attachedFiles, selectedScenarioId || undefined, sources);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearAll = () => {
    setInputText("");
    setAttachedFiles([]);
    setSelectedScenarioId(null);
    setUploadError(null);
    setVoiceNotice(null);
    if (isRecording) {
      toggleRecording();
    }
  };

  return (
    <div id="workspace" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. EXAMPLE SITUATION TEMPLATES */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold">
              EXAMPLE SITUATION TEMPLATES
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline font-mono">
            Load an example scenario to test structured analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => selectScenario(scenario.id)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-600/15 border-blue-500/50 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30"
                    : "bg-white hover:bg-slate-50 dark:bg-[#0d101a] dark:hover:bg-[#121624] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 text-base group-hover:scale-110 transition-transform">
                      {scenario.iconName}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 font-medium">
                      {scenario.badgeText.split(" → ")[1] || "Action"}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                    {scenario.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {scenario.tagline}
                  </p>
                </div>

                {scenario.attachedFile && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.05] flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                    <FileCheck className="w-3 h-3" />
                    <span className="truncate">{scenario.attachedFile.name}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. UNIVERSAL INPUT WORKSPACE */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-white/[0.1] shadow-xl dark:shadow-2xl relative">
        {/* Workspace Title & Subtitle */}
        <div className="pb-5 border-b border-slate-200 dark:border-white/[0.08] mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                GIVE SAHAAYA ANYTHING
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Speak it. Type it. Upload it. SAHAAYA turns messy information into clear next steps.
              </p>
            </div>

            {/* Clear All Workspace button */}
            {(inputText || attachedFiles.length > 0 || selectedScenarioId) && (
              <button
                type="button"
                onClick={clearAll}
                className="self-start sm:self-auto text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Workspace</span>
              </button>
            )}
          </div>

          {/* 4 Input Modes Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#080a11] p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.06] mt-4 w-fit max-w-full overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "text"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>✍ TEXT</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("voice");
                if (!isRecording) toggleRecording();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "voice" || isRecording
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>🎙 VOICE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("image");
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "image"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>📷 IMAGE</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("document");
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "document"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📄 DOCUMENT</span>
            </button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="image/png,image/jpeg,image/webp,.pdf,.txt,.doc,.docx"
          className="hidden"
        />

        {/* Error Notice if Upload / Format Fails */}
        {uploadError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="p-1 text-rose-600 dark:text-rose-400 hover:text-rose-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Voice recording guidance */}
        {activeTab === "voice" && (
          <div className="mb-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 flex items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-rose-500 animate-ping" : "bg-slate-400"}`} />
              <div className="text-xs font-mono">
                <span className="font-bold text-rose-800 dark:text-rose-300">
                  {isRecording ? `Recording... (${recordingSeconds}s)` : "Microphone ready"}
                </span>
                <span className="text-slate-600 dark:text-slate-400 ml-2">
                  {isRecording ? "Speak normally in any language" : "Click to speak your situation"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRecording}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                isRecording
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
                  : "bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20"
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Speaking"}
            </button>
          </div>
        )}

        {/* Voice Notice (if unsupported) */}
        {voiceNotice && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between animate-fadeIn">
            <span>{voiceNotice}</span>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="text-xs font-semibold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Drag & Drop Zone for Image & Document Modes */}
        {(activeTab === "image" || activeTab === "document") && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mb-4 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
              dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-600/10 scale-[1.01]"
                : "border-slate-300 dark:border-white/[0.12] hover:border-blue-500/40 bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100/80 dark:hover:bg-white/[0.04]"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
              Drag & Drop {activeTab === "image" ? "Photo (PNG, JPG, WEBP)" : "Document (PDF, TXT, DOCX)"} here
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              or click to browse from your device (Max 10MB)
            </p>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={5}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (selectedScenarioId) setSelectedScenarioId(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tell us what happened, even if you don't know what to do next..."
            className="w-full bg-white dark:bg-[#080a11]/90 border border-slate-300 dark:border-white/[0.08] focus:border-blue-500 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-sans leading-relaxed shadow-sm dark:shadow-inner"
          />

          {/* Bottom character counter */}
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {inputText.length} chars
            </span>
          </div>
        </div>

        {/* 3. INPUT PREVIEW & ATTACHED ARTIFACTS */}
        {attachedFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/[0.06]">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>DOCUMENT / IMAGE ATTACHED ({attachedFiles.length})</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-2.5 pr-3 rounded-2xl bg-slate-100 dark:bg-[#0c0f18] border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15 transition-all text-xs"
                >
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 dark:text-slate-100 max-w-[170px] truncate">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {file.size || "Artifact"} • {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-white/[0.06] transition-all ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy & Security UX Statement */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
          <div>
            <span>
              <strong>Privacy Notice:</strong> Your information is used to generate this analysis. Avoid uploading information you are not authorized to share.
            </span>
            <span className="block text-slate-500 mt-0.5">
              SAHAAYA provides decision support, not professional diagnosis or official eligibility determination.
            </span>
          </div>
        </div>

        {/* Bottom Submission Action Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px]">
              Ready for Gemini Multimodal Analysis
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-all font-mono"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Attach File</span>
            </button>

            <button
              type="button"
              disabled={isLoading || (!inputText.trim() && attachedFiles.length === 0)}
              onClick={() => handleSubmit()}
              className={`flex-1 sm:flex-initial px-7 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl font-mono ${
                isLoading || (!inputText.trim() && attachedFiles.length === 0)
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-white/[0.05] cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? "Analyzing Situation..." : "Analyze with SAHAAYA"}</span>
              <span className="hidden sm:inline text-[11px] opacity-70 font-mono ml-1">
                ⌘↵
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
