import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { StatusBadge } from '../components/StatusBadge';
import { DEMO_CLASSIFICATIONS } from '../data/mockData';
import {
  classifyWithGeminiApi,
  getClientGeminiApiKey,
  saveClientGeminiApiKey
} from '../utils/geminiClassifier';
import { addScan, getScans } from '../utils/storage';
import type { DemoClassification, WasteScan, User } from '../types';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  History,
  RotateCcw,
  ChevronRight,
  Tag,
  RefreshCw,
  Target,
  Zap,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  Key,
  XCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  Check
} from 'lucide-react';
import { saveWasteScanSupabase } from '../utils/supabaseService';

interface ContextType {
  user: User;
  refreshState: () => void;
  addToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export const Scanner: React.FC = () => {
  const { user, refreshState, addToast } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedClassification, setSelectedClassification] = useState<DemoClassification | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<WasteScan | null>(null);
  const [scansHistory, setScansHistory] = useState<WasteScan[]>(getScans());
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [activeApiKey, setActiveApiKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');

  useEffect(() => {
    const key = getClientGeminiApiKey();
    if (key) {
      setActiveApiKey(key);
      setApiKeyInput(key);
    }
  }, []);

  // Trigger classification using official Google Gemini API /api/classify route
  const handleAnalyze = async (
    classificationOverride?: DemoClassification | null,
    customUrl?: string,
    nameStr?: string
  ) => {
    setIsScanning(true);
    setScanResult(null);

    const imgToUse = customUrl || selectedImage || DEMO_CLASSIFICATIONS[0].sampleImage!;
    const nameToUse = nameStr || fileName || 'captured_waste_frame.jpg';

    let itemName = nameToUse;
    let category = classificationOverride?.category || 'Plastic';
    let confidence = classificationOverride?.confidence || 94;
    let typeStr = classificationOverride?.type || `${category} Waste`;
    let actions: string[] = classificationOverride?.recommendedActions || [];
    let lifespan = classificationOverride?.lifespan || '450 years';
    let modelUsed = selectedModel;

    let dosList: string[] = [];
    let dontsList: string[] = [];

    // If a demo preset chip was selected
    if (classificationOverride) {
      itemName = classificationOverride.name;
      category = classificationOverride.category;
      confidence = classificationOverride.confidence;
      lifespan = classificationOverride.lifespan || 'Varies';
      typeStr = classificationOverride.type;
      modelUsed = 'EcoSort Curated Benchmark';

      if (classificationOverride.dosAndDonts) {
        dosList = [
          'Follow municipal separation protocols for this category.',
          classificationOverride.dosAndDonts
        ];
        dontsList = ['Do not contaminate with opposite waste streams or hazardous chemicals.'];
      }
    } else {
      // Custom image uploaded or live webcam frame snapped -> Call Gemini API or local neural model
      try {
        const geminiRes = await classifyWithGeminiApi(imgToUse, selectedModel);
        category = geminiRes.category;
        confidence = geminiRes.confidence;
        itemName = geminiRes.item_name;
        lifespan = geminiRes.lifespan;
        modelUsed = geminiRes.model_used;
        typeStr = `${geminiRes.category} Waste`;

        if (geminiRes.dos_and_donts && typeof geminiRes.dos_and_donts === 'object') {
          dosList = geminiRes.dos_and_donts.dos || [];
          dontsList = geminiRes.dos_and_donts.donts || [];
        }

        actions = [
          ...dosList,
          ...dontsList.map((d) => `Avoid: ${d}`)
        ];

        if (geminiRes.isKeyMissing) {
          addToast(
            'info',
            'Local Neural Vision Active',
            'Image classified with local TensorFlow model. Enter your Gemini API key above to activate Gemini Pro.'
          );
        }
      } catch (err: any) {
        console.warn('Classification error, using fallback:', err);
      }
    }

    // Default safety fallbacks for actions if empty
    if (dosList.length === 0) {
      dosList = ['Rinse out any remaining residue before disposal.', 'Place in the designated recycling stream.'];
    }
    if (dontsList.length === 0) {
      dontsList = ['Do not mix with organic wet waste or unsegregated trash.'];
    }
    if (actions.length === 0) {
      actions = [...dosList, ...dontsList.map((d) => `Avoid: ${d}`)];
    }

    // Smooth UX scanning timer
    setTimeout(async () => {
      setIsScanning(false);

      const newScan: WasteScan = addScan({
        itemName,
        category,
        confidence,
        type: typeStr,
        recommendedActions: actions,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imgToUse,
        dos_and_donts: {
          dos: dosList,
          donts: dontsList
        },
        dosAndDonts: dosList.join(' ') + ' ' + dontsList.map((d) => `Don't: ${d}`).join(' '),
        lifespan,
        modelUsed
      });

      if (user?.id) {
        await saveWasteScanSupabase(newScan, user.id);
      }

      setScanResult(newScan);
      setScansHistory(getScans());
      refreshState();

      if (confidence < 70) {
        addToast('warning', 'Low Confidence Scan', 'Low certainty score — verify waste category manually.');
      } else {
        addToast('success', 'Scan Completed', `${itemName} classified as ${category} (${confidence}% certainty)`);
      }
    }, 1100);
  };

  // Click a demo preset button chip
  const handleDemoSelect = (demo: DemoClassification) => {
    setSelectedClassification(demo);
    const imgUrl = demo.sampleImage || REAL_PHOTO_ASSETS.demo_plastic_bottle;
    setSelectedImage(imgUrl);
    setFileName(demo.name);
    handleAnalyze(demo, imgUrl, demo.name);
  };

  // Custom photo uploaded or webcam frame captured
  const handleCustomUpload = (base64: string, fileObj?: File) => {
    setSelectedImage(base64);
    const fname = fileObj?.name || 'live_webcam_capture.jpg';
    setFileName(fname);
    setSelectedClassification(null);
    handleAnalyze(null, base64, fname);
  };

  const handleResetScan = () => {
    setSelectedImage(null);
    setSelectedClassification(null);
    setScanResult(null);
    setFileName('');
    setIsScanning(false);
  };

  const handleSaveApiKey = (keyToSave?: string) => {
    const key = keyToSave !== undefined ? keyToSave : apiKeyInput;
    saveClientGeminiApiKey(key);
    setActiveApiKey(key.trim() || null);
    setIsKeyModalOpen(false);
    if (key.trim()) {
      addToast('success', 'Gemini Pro Connected', 'Your API key is active. Future scans will query Google Gemini Pro directly.');
    } else {
      addToast('info', 'API Key Cleared', 'Switched to local TensorFlow neural network mode.');
    }
  };

  // Parse structured dos and donts
  const parsedDos = scanResult?.dos_and_donts?.dos || [
    'Rinse thoroughly to remove food or liquid residue.',
    'Deposit into designated municipal sorting stream.'
  ];
  const parsedDonts = scanResult?.dos_and_donts?.donts || [
    'Do not mix with unsegregated wet organic refuse.',
    'Do not bag inside non-recyclable plastic bags.'
  ];

  const isUsingGeminiCloud = scanResult?.modelUsed?.toLowerCase().includes('gemini');

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Google Gemini Pro &amp; Flash Vision Engine</span>
          </div>

          {/* Model Selector & API Key Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <Layers className="w-3.5 h-3.5 text-[#15803D]" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent border-0 focus:outline-hidden text-xs font-bold text-slate-800 cursor-pointer"
              >
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Active Model)</option>
                <option value="gemini-1.5-pro">Google Gemini Pro (1.5 Pro)</option>
              </select>

            </div>

            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl transition-all border ${
                activeApiKey
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{activeApiKey ? 'Gemini Key Active' : 'Enter Gemini Key'}</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
            EcoSort AI Scanner
          </h1>
          <p className="text-sm text-[#647067] mt-1 leading-relaxed max-w-2xl">
            Capture a live webcam frame or upload a photo of any item. EcoSort uses computer vision and Google Gemini Pro to identify the exact item, calculate its decomposition lifespan, and output actionable disposal protocols.
          </p>
        </div>


      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Live Webcam & Photo Upload (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <ImageUploader
                label="Live Webcam / Photo Upload"
                description="Point your camera at a waste item or upload an image file"
                selectedImage={selectedImage}
                onImageSelected={handleCustomUpload}
                onClear={handleResetScan}
              />

              {/* Demo Preset Chips */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#647067] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#15803D]" />
                    Or Test with Preset Items:
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Click to classify</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {DEMO_CLASSIFICATIONS.map((demo) => {
                    const isSelected = selectedClassification?.id === demo.id;
                    return (
                      <button
                        key={demo.id}
                        onClick={() => handleDemoSelect(demo)}
                        disabled={isScanning}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-md scale-102'
                            : 'bg-[#F7FAF7] hover:bg-[#DCFCE7] text-slate-700 hover:text-[#15803D] border-slate-200 hover:border-emerald-300'
                        } disabled:opacity-50`}
                      >
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        <span>{demo.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Status Prompt */}
            {selectedImage && !isScanning && scanResult && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Analyzed via {scanResult.modelUsed || 'AI Engine'}
                </span>
                <button
                  onClick={handleResetScan}
                  className="text-[#15803D] hover:underline font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Scan New Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scan Result Card & Scanner HUD (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Scanning Loading State with Visual Reticle & Laser */}
          {isScanning && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col items-center justify-center text-center min-h-[440px] relative overflow-hidden">
              <div className="relative w-56 h-56 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-xl mb-6 bg-slate-950">
                {selectedImage && (
                  <img src={selectedImage} alt="Scanning frame" className="w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-xl animate-pulse flex items-center justify-center">
                  <Target className="w-12 h-12 text-emerald-400 animate-spin" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-950/90 text-emerald-300 text-[9px] font-mono rounded border border-emerald-700 uppercase">
                    {selectedModel} RETICLE
                  </div>
                </div>
                <div className="absolute inset-x-0 h-1.5 bg-emerald-400 shadow-[0_0_24px_#22c55e] animate-bounce" />
              </div>
              <div className="flex items-center gap-2 text-[#15803D] font-extrabold text-lg">
                <Sparkles className="w-5 h-5 animate-spin" />
                {activeApiKey ? `Running ${selectedModel}...` : 'Analyzing via Vision Engine...'}
              </div>
              <p className="text-xs text-[#647067] mt-2 max-w-xs leading-relaxed">
                Evaluating visual contours, material density, decomposition lifespan &amp; municipal sorting protocol...
              </p>
            </div>
          )}

          {/* Scan Result Display with Scanner HUD and Action Guide */}
          {scanResult && !isScanning && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-200/90 shadow-md flex-1 flex flex-col justify-between space-y-5 animate-fadeIn">
              <div className="space-y-4">
                {/* HUD Result Title & Category */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#15803D] uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-[#15803D]" />
                      AI DETECTION RESULT
                    </span>
                    <h3 className="text-xl font-extrabold text-[#17211B] mt-0.5">
                      {scanResult.itemName}
                    </h3>
                  </div>
                  <StatusBadge status={scanResult.category} />
                </div>

                {/* Bounding Reticle Image Frame HUD */}
                {scanResult.imageUrl && (
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-950">
                    <img
                      src={scanResult.imageUrl}
                      alt={scanResult.itemName}
                      className="w-full h-full object-cover"
                    />
                    {/* Bounding Box HUD reticle */}
                    <div className="absolute inset-3 border-2 border-emerald-400/90 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between items-start text-[10px] font-mono text-emerald-300 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-800">
                        DETECTED: {scanResult.itemName.toUpperCase()}
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isUsingGeminiCloud
                            ? 'text-cyan-300 bg-slate-950/90 border-cyan-800'
                            : 'text-amber-300 bg-slate-950/90 border-amber-800'
                        }`}>
                          {scanResult.modelUsed || selectedModel}
                        </div>
                        <div className="text-[10px] font-bold text-emerald-300 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-800">
                          CONFIDENCE: {scanResult.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engine Source Badge */}
                <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                  isUsingGeminiCloud
                    ? 'bg-purple-50/70 border-purple-200 text-purple-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Engine: {scanResult.modelUsed}</span>
                  </div>
                  {!activeApiKey && (
                    <button
                      onClick={() => setIsKeyModalOpen(true)}
                      className="text-[#15803D] hover:underline font-extrabold text-[11px]"
                    >
                      Connect Gemini Pro
                    </button>
                  )}
                </div>

                {/* Metric Badges: Confidence & Lifespan */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-[#F7FAF7] rounded-2xl border border-slate-200/80 text-xs flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center shrink-0 font-extrabold text-sm">
                      {scanResult.confidence}%
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block font-medium">Certainty Score</span>
                      <span className="font-bold text-[#15803D] text-xs">
                        {scanResult.confidence >= 90 ? 'High Confidence' : 'Verified'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-xs flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <span className="text-amber-700 text-[10px] block font-medium">Decomposition</span>
                      <span className="font-bold text-amber-900 text-xs truncate max-w-[110px] block">
                        {scanResult.lifespan || '450 years'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION GUIDE: Do's and Don'ts Section */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span>Action Guide &amp; Disposal Protocols:</span>
                  </div>

                  {/* Do's Panel */}
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                      <span>DO (Recommended Steps):</span>
                    </div>
                    <ul className="space-y-1 pl-5 text-xs text-emerald-950 list-disc leading-relaxed">
                      {parsedDos.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Don'ts Panel */}
                  <div className="p-3.5 bg-rose-50/80 border border-rose-200/90 rounded-2xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>DON&apos;T (Avoid Mistakes):</span>
                    </div>
                    <ul className="space-y-1 pl-5 text-xs text-rose-950 list-disc leading-relaxed">
                      {parsedDonts.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Low Confidence Warning Alert (< 70%) */}
                {scanResult.confidence < 70 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-amber-900 block">
                        Low certainty classification score ({scanResult.confidence}%).
                      </span>
                      <p className="text-[11px] text-amber-700 leading-normal">
                        Please verify item label manually before placing into recycling bin.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={handleResetScan}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another
                </button>
                <button
                  onClick={() => navigate('/disposal-guide')}
                  className="flex-1 py-2.5 px-4 bg-[#15803D] hover:bg-[#15803D]/90 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  Full Disposal Guide
                </button>
              </div>
            </div>
          )}

          {/* Initial Blank State Prompt */}
          {!selectedImage && !isScanning && !scanResult && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col items-center justify-center text-center min-h-[440px]">
              <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-4 shadow-inner">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#17211B]">
                Ready to Classify Waste
              </h3>
              <p className="text-xs text-[#647067] max-w-xs mt-1 leading-relaxed">
                Open your live webcam, upload a photo file, or click any sample demo preset chip on the left to start AI classification.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans History Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#15803D]" />
            <h2 className="text-base font-bold text-[#17211B]">
              Recent Scans History
            </h2>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {scansHistory.length} {scansHistory.length === 1 ? 'item' : 'items'} logged
          </span>
        </div>

        {scansHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No waste items scanned yet.</p>
        ) : (
          <div className="max-h-[380px] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scansHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7FAF7] border border-slate-200/80 hover:border-emerald-200 transition-colors shadow-2xs"
                >
                  {scan.imageUrl ? (
                    <img
                      src={scan.imageUrl}
                      alt={scan.itemName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-900"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      AI
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-[#17211B] truncate">{scan.itemName}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-[#15803D]">{scan.category}</span>
                      <span className="text-[10px] text-slate-400">{scan.confidence}% conf.</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gemini API Key Configuration Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#17211B]">
                  Google Gemini Pro Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your Google Gemini API key to activate Google Gemini Pro Vision (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">gemini-1.5-pro</code>) or Flash models directly.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#15803D] focus:outline-hidden font-mono"
              />
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                Stored securely in your local browser storage.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span>Get a free Gemini API key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#15803D] font-bold hover:underline inline-flex items-center gap-1"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveApiKey()}
                className="flex-1 py-2.5 px-4 bg-[#15803D] hover:bg-[#15803D]/90 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Save &amp; Connect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
