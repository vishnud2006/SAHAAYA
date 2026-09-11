import { SupportedLanguage } from "@/types";

export interface TranslationDictionary {
  [key: string]: string | undefined;
  appName: string;
  tagline: string;
  navDashboard: string;
  navNewAnalysis: string;
  navMyCases: string;
  navFieldMode: string;
  navProfile: string;
  navLogin: string;
  navSignup: string;
  navLogout: string;
  startAnalyzing: string;
  
  // Workspace
  workspaceTitle: string;
  workspaceSubtitle: string;
  tabText: string;
  tabVoice: string;
  tabImage: string;
  tabDocument: string;
  placeholderText: string;
  voiceStart: string;
  voiceStop: string;
  voiceListening: string;
  voiceUnsupported: string;
  btnAnalyze: string;
  btnAnalyzing: string;
  
  // Benchmark scenarios
  benchmarkScenarios: string;
  orTrySample: string;
  
  // Result Sections
  priorityBannerTitle: string;
  urgencyClassification: string;
  whatUnderstood: string;
  whatUnderstoodSub: string;
  yourIntent: string;
  yourIntentSub: string;
  detectedInfo: string;
  detectedInfoSub: string;
  supportedByInput: string;
  supportedByInputSub: string;
  needsConfirmation: string;
  needsConfirmationSub: string;
  nextBestAction: string;
  nextBestActionSub: string;
  actionProgress: string;
  whyThisMatters: string;
  possibleHelp: string;
  possibleHelpSub: string;
  sourceEvidenceTitle: string;
  sourceConfirms: string;
  sourceStillNeedsConfirm: string;
  openSource: string;
  importantWarnings: string;
  trustLayer: string;
  trustUnderstood: string;
  trustSeparated: string;
  trustUncertainty: string;

  // Actions Bar
  btnShareSummary: string;
  btnExportDossier: string;
  btnPrintDossier: string;
  btnSaveOffline: string;
  btnOfflineReady: string;
  btnSaveCloud: string;
  btnSaved: string;
  btnCreateHandoff: string;
  btnBackToCases: string;
  btnNewAnalysis: string;

  // Smart Handoff Modal
  handoffTitle: string;
  handoffWhoFor: string;
  handoffSelectRole: string;
  handoffReviewNotice: string;
  handoffReviewedCheck: string;
  btnCopyBrief: string;
  btnCopied: string;
  btnShare: string;
  btnExportHandoffPdf: string;
  btnCancel: string;

  // Priorities
  priorityCritical: string;
  priorityCriticalSub: string;
  priorityHigh: string;
  priorityHighSub: string;
  priorityMedium: string;
  priorityMediumSub: string;
  priorityLow: string;
  priorityLowSub: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "SAHAAYA",
    tagline: "Messy human problems → verified actions that help.",
    navDashboard: "Dashboard",
    navNewAnalysis: "New Analysis",
    navMyCases: "My Cases",
    navFieldMode: "Field Mode",
    navProfile: "Profile",
    navLogin: "Login",
    navSignup: "Sign Up",
    navLogout: "Log Out",
    startAnalyzing: "Start analyzing",

    workspaceTitle: "GIVE SAHAAYA ANYTHING",
    workspaceSubtitle: "Speak it. Type it. Upload it. SAHAAYA turns messy information into clear next steps.",
    tabText: "✍ Text",
    tabVoice: "🎙 Voice",
    tabImage: "📷 Image",
    tabDocument: "📄 Document",
    placeholderText: "Describe what is happening in your own words — include symptoms, roadblocks, family needs, or urgent issues...",
    voiceStart: "Start Voice Input",
    voiceStop: "Stop Voice Recording",
    voiceListening: "Listening... speak naturally in your chosen language",
    voiceUnsupported: "Voice input is not supported in this browser. Please use text input instead.",
    btnAnalyze: "ANALYZE SITUATION →",
    btnAnalyzing: "GEMINI ANALYZING...",

    benchmarkScenarios: "TRY REAL-WORLD BENCHMARK SCENARIOS",
    orTrySample: "Or test a live scenario:",

    priorityBannerTitle: "URGENCY CLASSIFICATION",
    urgencyClassification: "Urgency Level",
    whatUnderstood: "WHAT WE UNDERSTOOD",
    whatUnderstoodSub: "Synthesis of reported situation & constraints",
    yourIntent: "YOUR INTENT",
    yourIntentSub: "Core objective SAHAAYA is bridging toward",
    detectedInfo: "DETECTED INFORMATION",
    detectedInfoSub: "Extracted situational metrics, vitals, and reported variables",
    supportedByInput: "✓ SUPPORTED BY INPUT",
    supportedByInputSub: "Based on information provided to SAHAAYA.",
    needsConfirmation: "⚠ NEEDS CONFIRMATION",
    needsConfirmationSub: "Information that may require confirmation before acting.",
    nextBestAction: "NEXT BEST ACTION",
    nextBestActionSub: "Prioritized sequence designed for immediate execution",
    actionProgress: "ACTION PROGRESS",
    whyThisMatters: "Why this matters:",
    possibleHelp: "POSSIBLE HELP — SOURCE-AWARE RESOURCE BRIDGE",
    possibleHelpSub: "Authoritative external sources separated from AI reasoning to ground your next steps.",
    sourceEvidenceTitle: "SOURCE EVIDENCE & GUIDELINES",
    sourceConfirms: "✓ WHAT THE SOURCE CONFIRMS",
    sourceStillNeedsConfirm: "⚠ STILL NEEDS CONFIRMATION",
    openSource: "OPEN SOURCE",
    importantWarnings: "IMPORTANT",
    trustLayer: "SAHAAYA TRUST LAYER",
    trustUnderstood: "Input understood",
    trustSeparated: "Evidence separated from assumptions",
    trustUncertainty: "Uncertainty identified",

    btnShareSummary: "SHARE SUMMARY",
    btnExportDossier: "FIELD DOSSIER",
    btnPrintDossier: "PRINT DOSSIER",
    btnSaveOffline: "SAVE OFFLINE",
    btnOfflineReady: "Offline ready ✓",
    btnSaveCloud: "SAVE CLOUD",
    btnSaved: "Saved ✓",
    btnCreateHandoff: "CREATE HANDOFF",
    btnBackToCases: "← All Cases",
    btnNewAnalysis: "← New analysis",

    handoffTitle: "SMART HUMAN HANDOFF",
    handoffWhoFor: "WHO IS THIS FOR?",
    handoffSelectRole: "Select recipient type to adapt the case briefing:",
    handoffReviewNotice: "Review this briefing before sharing. It may contain sensitive personal information.",
    handoffReviewedCheck: "I have reviewed this briefing for accuracy and consent",
    btnCopyBrief: "COPY BRIEF",
    btnCopied: "Brief copied ✓",
    btnShare: "SHARE",
    btnExportHandoffPdf: "EXPORT HANDOFF PDF",
    btnCancel: "Close",

    priorityCritical: "CRITICAL PRIORITY",
    priorityCriticalSub: "Immediate attention recommended",
    priorityHigh: "HIGH PRIORITY",
    priorityHighSub: "Prompt attention recommended",
    priorityMedium: "MEDIUM PRIORITY",
    priorityMediumSub: "Action recommended",
    priorityLow: "LOW PRIORITY",
    priorityLowSub: "Informational / low urgency"
  },

  hi: {
    appName: "सहाय (SAHAAYA)",
    tagline: "जटिल मानवीय समस्याएं → सत्यापित मददगार कदम।",
    navDashboard: "डैशबोर्ड",
    navNewAnalysis: "नया विश्लेषण",
    navMyCases: "मेरे मामले",
    navFieldMode: "फील्ड मोड",
    navProfile: "प्रोफ़ाइल",
    navLogin: "लॉग इन",
    navSignup: "साइन अप",
    navLogout: "लॉग आउट",
    startAnalyzing: "विश्लेषण शुरू करें",

    workspaceTitle: "सहाय को कुछ भी बताएं",
    workspaceSubtitle: "बोलें। लिखें। अपलोड करें। सहाय किसी भी इनपुट को स्पष्ट अगले कदमों में बदलता है।",
    tabText: "✍ टेक्स्ट",
    tabVoice: "🎙 आवाज",
    tabImage: "📷 फोटो",
    tabDocument: "📄 दस्तावेज",
    placeholderText: "अपनी स्थिति अपने शब्दों में बताएं — लक्षण, रुकावटें, पारिवारिक जरूरतें या जरूरी समस्याएं लिखें...",
    voiceStart: "बोलना शुरू करें",
    voiceStop: "रिकॉर्डिंग रोकें",
    voiceListening: "सुन रहे हैं... कृपया स्पष्ट आवाज में बोलें",
    voiceUnsupported: "इस ब्राउज़र में इस भाषा का वॉयस इनपुट समर्थित नहीं है। कृपया टेक्स्ट का उपयोग करें।",
    btnAnalyze: "स्थिति का विश्लेषण करें →",
    btnAnalyzing: "जेमिनी विश्लेषण कर रहा है...",

    benchmarkScenarios: "वास्तविक परिदृश्य का परीक्षण करें",
    orTrySample: "या एक लाइव नमूना आज़माएं:",

    priorityBannerTitle: "प्राथमिकता वर्गीकरण",
    urgencyClassification: "आपात स्तर",
    whatUnderstood: "हमने क्या समझा",
    whatUnderstoodSub: "दर्ज की गई स्थिति और बाधाओं का सार",
    yourIntent: "आपका उद्देश्य",
    yourIntentSub: "वह मुख्य लक्ष्य जिसकी दिशा में सहाय सहायता कर रहा है",
    detectedInfo: "पहचानी गई जानकारी",
    detectedInfoSub: "निकाले गए महत्वपूर्ण माप, लक्षण और दर्ज विवरण",
    supportedByInput: "✓ इनपुट द्वारा समर्थित",
    supportedByInputSub: "सहाय को प्रदान की गई सीधी जानकारी पर आधारित।",
    needsConfirmation: "⚠ पुष्टि की आवश्यकता है",
    needsConfirmationSub: "कार्रवाई करने से पहले इस जानकारी की पुष्टि जरूरी हो सकती है।",
    nextBestAction: "अगली सर्वोत्तम कार्रवाई",
    nextBestActionSub: "तत्काल निष्पादन के लिए तैयार की गई क्रमबद्ध योजना",
    actionProgress: "कार्रवाई प्रगति",
    whyThisMatters: "यह क्यों जरूरी है:",
    possibleHelp: "संभावित सहायता — आधिकारिक स्रोत सेतु",
    possibleHelpSub: "एआई तर्क से अलग आधिकारिक बाहरी स्रोत जो आपके अगले कदम को प्रमाणित करते हैं।",
    sourceEvidenceTitle: "स्रोत साक्ष्य और दिशा-निर्देश",
    sourceConfirms: "✓ स्रोत क्या पुष्टि करता है",
    sourceStillNeedsConfirm: "⚠ अभी भी उपयोगकर्ता पुष्टि आवश्यक है",
    openSource: "स्रोत खोलें",
    importantWarnings: "महत्वपूर्ण चेतावनी",
    trustLayer: "सहाय विश्वसनीयता परत",
    trustUnderstood: "इनपुट समझा गया",
    trustSeparated: "तथ्यों को अनुमानों से अलग किया गया",
    trustUncertainty: "अनिश्चितता पहचानी गई",

    btnShareSummary: "सारांश साझा करें",
    btnExportDossier: "फील्ड विवरणिका",
    btnPrintDossier: "डोजियर प्रिंट करें",
    btnSaveOffline: "ऑफलाइन सहेजें",
    btnOfflineReady: "ऑफलाइन तैयार ✓",
    btnSaveCloud: "क्लाउड पर सहेजें",
    btnSaved: "सहेजा गया ✓",
    btnCreateHandoff: "हैंडऑफ बनाएं",
    btnBackToCases: "← सभी मामले",
    btnNewAnalysis: "← नया विश्लेषण",

    handoffTitle: "स्मार्ट मानवीय हैंडऑफ",
    handoffWhoFor: "यह संक्षिप्त विवरण किसके लिए है?",
    handoffSelectRole: "केस ब्रीफिंग को अनुकूलित करने के लिए प्राप्तकर्ता चुनें:",
    handoffReviewNotice: "साझा करने से पहले इस ब्रीफिंग की समीक्षा करें। इसमें संवेदनशील व्यक्तिगत जानकारी हो सकती है।",
    handoffReviewedCheck: "मैंने इस ब्रीफिंग की सटीकता और सहमति की समीक्षा कर ली है",
    btnCopyBrief: "ब्रीफ कॉपी करें",
    btnCopied: "ब्रीफ कॉपी हो गया ✓",
    btnShare: "शेयर करें",
    btnExportHandoffPdf: "हैंडऑफ PDF निर्यात करें",
    btnCancel: "बंद करें",

    priorityCritical: "अत्यंत गंभीर प्राथमिकता",
    priorityCriticalSub: "तत्काल ध्यान देने की सिफारिश की जाती है",
    priorityHigh: "उच्च प्राथमिकता",
    priorityHighSub: "शीघ्र ध्यान देने की सिफारिश की जाती है",
    priorityMedium: "मध्यम प्राथमिकता",
    priorityMediumSub: "कार्रवाई की सिफारिश की जाती है",
    priorityLow: "निम्न प्राथमिकता",
    priorityLowSub: "सूचनात्मक / कम तात्कालिकता"
  },

  kn: {
    appName: "ಸಹಾಯ (SAHAAYA)",
    tagline: "ಕ್ಲಿಷ್ಟಕರ ಮಾನವ ಸಮಸ್ಯೆಗಳು → ಸಹಾಯ ಮಾಡುವ ದೃಢೀಕೃತ ಕ್ರಮಗಳು.",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navNewAnalysis: "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
    navMyCases: "ನನ್ನ ಪ್ರಕರಣಗಳು",
    navFieldMode: "ಫೀಲ್ಡ್ ಮೋಡ್",
    navProfile: "ಪ್ರೊಫೈಲ್",
    navLogin: "ಲಾಗಿನ್",
    navSignup: "ಸೈನ್ ಅಪ್",
    navLogout: "ಲಾಗ್ ಔಟ್",
    startAnalyzing: "ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ",

    workspaceTitle: "ಸಹಾಯಗೆ ಏನನ್ನಾದರೂ ತಿಳಿಸಿ",
    workspaceSubtitle: "ಮಾತನಾಡಿ. ಟೈಪ್ ಮಾಡಿ. ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಸಹಾಯ ಯಾವುದೇ ಮಾಹಿತಿಯನ್ನು ಸ್ಪಷ್ಟ ಮುಂದಿನ ಹಂತಗಳಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.",
    tabText: "✍ ಪಠ್ಯ",
    tabVoice: "🎙 ಧ್ವನಿ",
    tabImage: "📷 ಚಿತ್ರ",
    tabDocument: "📄 ದಾಖಲೆ",
    placeholderText: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ನಿಮ್ಮದೇ ಮಾತುಗಳಲ್ಲಿ ವಿವರಿಸಿ — ಲಕ್ಷಣಗಳು, ಅಡೆತಡೆಗಳು, ಕುಟುಂಬದ ಅಗತ್ಯಗಳು ಅಥವಾ ತುರ್ತು ಸಮಸ್ಯೆಗಳನ್ನು ಬರೆಯಿರಿ...",
    voiceStart: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಸಿ",
    voiceStop: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
    voiceListening: "ಕೇಳಿಸಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ... ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ",
    voiceUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಈ ಭಾಷೆಯ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಪಠ್ಯವನ್ನು ಬಳಸಿ.",
    btnAnalyze: "ಪರಿಸ್ಥಿತಿ ವಿಶ್ಲೇಷಿಸಿ →",
    btnAnalyzing: "ಜೆಮಿನಿ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",

    benchmarkScenarios: "ನೈಜ ಪರಿಸ್ಥಿತಿಯ ಮಾದರಿಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ",
    orTrySample: "ಅಥವಾ ಲೈವ್ ಮಾದರಿಯನ್ನು ಪ್ರಯತ್ನಿಸಿ:",

    priorityBannerTitle: "ತುರ್ತು ವರ್ಗೀಕರಣ",
    urgencyClassification: "ತುರ್ತು ಮಟ್ಟ",
    whatUnderstood: "ನಾವು ಅರ್ಥಮಾಡಿಕೊಂಡದ್ದು",
    whatUnderstoodSub: "ವರದಿ ಮಾಡಲಾದ ಪರಿಸ್ಥಿತಿ ಮತ್ತು ಮಿತಿಗಳ ಸಾರಾಂಶ",
    yourIntent: "ನಿಮ್ಮ ಉದ್ದೇಶ",
    yourIntentSub: "ಸಹಾಯ ಸಂಪರ್ಕಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತಿರುವ ಮುಖ್ಯ ಗುರಿ",
    detectedInfo: "ಗುರುತಿಸಲಾದ ಮಾಹಿತಿ",
    detectedInfoSub: "ಪರಿಸ್ಥಿತಿಯ ಪ್ರಮುಖ ಅಂಶಗಳು ಮತ್ತು ದಾಖಲಿತ ವಿವರಗಳು",
    supportedByInput: "✓ ಇನ್‌ಪುಟ್‌ನಿಂದ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
    supportedByInputSub: "ಸಹಾಯಗೆ ನೀಡಲಾದ ನೇರ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ.",
    needsConfirmation: "⚠ ದೃಢೀಕರಣದ ಅಗತ್ಯವಿದೆ",
    needsConfirmationSub: "ಕ್ರಮ ಕೈಗೊಳ್ಳುವ ಮೊದಲು ಈ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಬೇಕಾಗಬಹುದು.",
    nextBestAction: "ಮುಂದಿನ ಅತ್ಯುತ್ತಮ ಕ್ರಮ",
    nextBestActionSub: "ತಕ್ಷಣದ ಜಾರಿಗೆ ಆದ್ಯತೆಯ ಅನುಕ್ರಮ ಯೋಜನೆ",
    actionProgress: "ಕ್ರಮ ಪ್ರಗತಿ",
    whyThisMatters: "ಇದು ಏಕೆ ಮುಖ್ಯ:",
    possibleHelp: "ಸಂಭಾವ್ಯ ಸಹಾಯ — ಅಧಿಕೃತ ಮೂಲ ಸೇತು",
    possibleHelpSub: "ನಿಮ್ಮ ಮುಂದಿನ ಹಂತಗಳನ್ನು ಖಚಿತಪಡಿಸಲು AI ತರ್ಕದಿಂದ ಪ್ರತ್ಯೇಕಿಸಲಾದ ಅಧಿಕೃತ ಬಾಹ್ಯ ಮೂಲಗಳು.",
    sourceEvidenceTitle: "ಮೂಲ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಮಾರ್ಗಸೂಚಿಗಳು",
    sourceConfirms: "✓ ಮೂಲವು ಏನನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ",
    sourceStillNeedsConfirm: "⚠ ಬಳಕೆದಾರರ ಪರಿಶೀಲನೆ ಇನ್ನೂ ಅಗತ್ಯವಿದೆ",
    openSource: "ಮೂಲ ತೆರೆಯಿರಿ",
    importantWarnings: "ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ",
    trustLayer: "ಸಹಾಯ ವಿಶ್ವಾಸಾರ್ಹತೆ ಪದರ",
    trustUnderstood: "ಇನ್‌ಪುಟ್ ಅರ್ಥವಾಗಿದೆ",
    trustSeparated: "ಸಾಕ್ಷ್ಯವನ್ನು ಊಹೆಗಳಿಂದ ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ",
    trustUncertainty: "ಅನಿಶ್ಚಿತತೆಯನ್ನು ಗುರುತಿಸಲಾಗಿದೆ",

    btnShareSummary: "ಸಾರಾಂಶ ಹಂಚಿಕೊಳ್ಳಿ",
    btnExportDossier: "ಫೀಲ್ಡ್ ಡೋಸಿಯರ್",
    btnPrintDossier: "ಡೋಸಿಯರ್ ಮುದ್ರಿಸಿ",
    btnSaveOffline: "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಿ",
    btnOfflineReady: "ಆಫ್‌ಲೈನ್ ಸಿದ್ಧವಾಗಿದೆ ✓",
    btnSaveCloud: "ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಉಳಿಸಿ",
    btnSaved: "ಉಳಿಸಲಾಗಿದೆ ✓",
    btnCreateHandoff: "ಹ್ಯಾಂಡ್‌ಆಫ್ ರಚಿಸಿ",
    btnBackToCases: "← ಎಲ್ಲಾ ಪ್ರಕರಣಗಳು",
    btnNewAnalysis: "← ಹೊಸ ವಿಶ್ಲೇಷಣೆ",

    handoffTitle: "ಸ್ಮಾರ್ಟ್ ಮಾನವ ಹ್ಯಾಂಡ್‌ಆಫ್",
    handoffWhoFor: "ಈ ಸಂಕ್ಷಿಪ್ತ ವಿವರ ಯಾರಿಗೆ?",
    handoffSelectRole: "ಬ್ರೀಫಿಂಗ್ ಕಸ್ಟಮೈಸ್ ಮಾಡಲು ಸ್ವೀಕರಿಸುವವರನ್ನು ಆಯ್ಕೆಮಾಡಿ:",
    handoffReviewNotice: "ಹಂಚಿಕೊಳ್ಳುವ ಮೊದಲು ಈ ಬ್ರೀಫಿಂಗ್ ಪರಿಶೀಲಿಸಿ. ಇದು ಸೂಕ್ಷ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಹೊಂದಿರಬಹುದು.",
    handoffReviewedCheck: "ನಾನು ನಿಖರತೆಗಾಗಿ ಈ ವಿವರವನ್ನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ",
    btnCopyBrief: "ಬ್ರೀಫ್ ನಕಲಿಸಿ",
    btnCopied: "ಬ್ರೀಫ್ ನಕಲಿಸಲಾಗಿದೆ ✓",
    btnShare: "ಹಂಚಿಕೊಳ್ಳಿ",
    btnExportHandoffPdf: "ಹ್ಯಾಂಡ್‌ಆಫ್ PDF ಡೌನ್‌ಲೋಡ್",
    btnCancel: "ಮುಚ್ಚಿ",

    priorityCritical: "ಅತ್ಯಂತ ತುರ್ತು ಆದ್ಯತೆ",
    priorityCriticalSub: "ತಕ್ಷಣದ ಗಮನ ಅಗತ್ಯವಿದೆ",
    priorityHigh: "ಹೆಚ್ಚಿನ ಆದ್ಯತೆ",
    priorityHighSub: "ಶೀಘ್ರ ಗಮನ ಅಗತ್ಯವಿದೆ",
    priorityMedium: "ಮಧ್ಯಮ ಆದ್ಯತೆ",
    priorityMediumSub: "ಕ್ರಮ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    priorityLow: "ಕಡಿಮೆ ಆದ್ಯತೆ",
    priorityLowSub: "ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ / ಕಡಿಮೆ ತುರ್ತು"
  }
};
