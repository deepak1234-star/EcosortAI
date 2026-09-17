import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { StatusBadge } from '../components/StatusBadge';
import { DEMO_CLASSIFICATIONS } from '../data/mockData';
import { classifyImageAsync } from '../utils/demoClassifier';
import { addScan, getScans } from '../utils/storage';
import type { DemoClassification, WasteScan, User } from '../types';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';
import {
  ScanLine,
  Sparkles,
  CheckCircle2,
  BookOpen,
  History,
  RotateCcw,
  Info,
  ChevronRight,
  Tag,
  RefreshCw,
  Target,
  Zap,
  AlertTriangle
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

  // Trigger classification analysis with real canvas image visual feature extraction
  const handleAnalyze = async (
    classificationOverride?: DemoClassification | null,
    customUrl?: string,
    nameStr?: string
  ) => {
    setIsScanning(true);
    setScanResult(null);

    const imgToUse = customUrl || selectedImage || DEMO_CLASSIFICATIONS[0].sampleImage!;
    const nameToUse = nameStr || fileName || 'uploaded_waste_image.jpg';

    // Perform visual feature extraction
    const classified = await classifyImageAsync(imgToUse, classificationOverride, nameToUse);

    setTimeout(async () => {
      setIsScanning(false);

      const newScan = addScan({
        itemName: classified.itemName,
        category: classified.category,
        confidence: classified.confidence,
        type: classified.type,
        recommendedActions: classified.recommendedActions,
        date: new Date().toISOString().split('T')[0],
        imageUrl: imgToUse
      });

      if (user?.id) {
        await saveWasteScanSupabase(newScan, user.id);
      }

      setScanResult(newScan);
      setScansHistory(getScans());
      refreshState();
      if (classified.confidence < 70) {
        addToast('warning', 'Low Confidence Scan', 'Low confidence — please verify the waste type manually.');
      } else {
        addToast('success', 'Scan Completed', `Item classified: ${classified.itemName}`);
      }
    }, 1200);
  };

  // Click a demo preset button chip
  const handleDemoSelect = (demo: DemoClassification) => {
    setSelectedClassification(demo);
    const imgUrl = demo.sampleImage || REAL_PHOTO_ASSETS.demo_plastic_bottle;
    setSelectedImage(imgUrl);
    setFileName(demo.name);
    handleAnalyze(demo, imgUrl, demo.name);
  };

  // Custom photo uploaded
  const handleCustomUpload = (base64: string, fileObj?: File) => {
    setSelectedImage(base64);
    const fname = fileObj?.name || 'custom_uploaded_waste_image.jpg';
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold mb-3">
          <ScanLine className="w-3.5 h-3.5" />
          <span>EcoSort Computer Vision Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211B] tracking-tight">
          AI Waste Scanner
        </h1>
        <p className="text-sm text-[#647067] mt-1 leading-relaxed max-w-2xl">
          Upload a photo of a waste item to see how EcoSort AI classifies it and provides exact step-by-step disposal protocols.
        </p>

        {/* Engine Notice */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
          <span>
            <strong>EcoSort AI Computer Vision Engine:</strong> Upload any waste photo or select a sample item to execute instant visual pattern classification and recycling protocols.
          </span>
        </div>
      </div>

      {/* Main Scanner Equal Height Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Upload & Demo Item Chips (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <ImageUploader
                label="Upload Waste Image"
                description="Drag & drop your waste photo or select an image file"
                selectedImage={selectedImage}
                onImageSelected={handleCustomUpload}
                onClear={handleResetScan}
              />

              {/* Demo Items Affordance Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#647067] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#15803D]" />
                    Try Preset Demo Items:
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
                <span className="text-slate-500">Image loaded & classified</span>
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

        {/* Right Column: Scan Result Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {/* Scanning Loading State with Visual Reticle & Bounding Box */}
          {isScanning && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col items-center justify-center text-center min-h-[400px] relative overflow-hidden">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg mb-6 bg-slate-950">
                {selectedImage && (
                  <img src={selectedImage} alt="Scanning" className="w-full h-full object-cover opacity-80" />
                )}
                {/* Dynamic AI Reticle Target & Bounding Box */}
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-xl animate-pulse flex items-center justify-center">
                  <Target className="w-12 h-12 text-emerald-400 animate-spin" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-900/90 text-emerald-300 text-[9px] font-mono rounded">
                    DETECTION RETICLE 98.4%
                  </div>
                </div>
                {/* Laser scan bar animation */}
                <div className="absolute inset-x-0 h-1.5 bg-emerald-400 shadow-[0_0_20px_#22c55e] animate-bounce" />
              </div>
              <div className="flex items-center gap-2 text-[#15803D] font-bold text-lg">
                <Sparkles className="w-5 h-5 animate-spin" />
                Analyzing Waste Patterns...
              </div>
              <p className="text-xs text-[#647067] mt-2 max-w-xs leading-relaxed">
                Evaluating edge contours, material density & municipal sorting protocol...
              </p>
            </div>
          )}

          {/* Scan Result Display with Confidence Gauge & Visual Reticle */}
          {scanResult && !isScanning && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-200/80 shadow-md flex-1 flex flex-col justify-between space-y-6 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#15803D] uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-[#15803D]" />
                      AI SCAN RESULT
                    </span>
                    <h3 className="text-xl font-extrabold text-[#17211B] mt-0.5">
                      {scanResult.itemName}
                    </h3>
                  </div>
                  <StatusBadge status={scanResult.category} />
                </div>

                {/* Bounding Box Image Preview Container */}
                {scanResult.imageUrl && (
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                    <img
                      src={scanResult.imageUrl}
                      alt={scanResult.itemName}
                      className="w-full h-full object-cover"
                    />
                    {/* Visual Detection Bounding Box Reticle */}
                    <div className="absolute inset-4 border-2 border-emerald-400/90 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                      <div className="flex justify-between items-start text-[10px] font-mono text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded w-fit">
                        DETECTED: {scanResult.itemName.toUpperCase()}
                      </div>
                      <div className="self-end text-[10px] font-bold text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded">
                        CONFIDENCE: {scanResult.confidence}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Classification Metadata */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F7FAF7] rounded-2xl border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400 block fill-slate-400 font-medium">Category:</span>
                    <span className="font-bold text-[#15803D] text-sm">{scanResult.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Waste Type:</span>
                    <span className="font-bold text-slate-800 text-sm">{scanResult.type}</span>
                  </div>
                </div>

                {/* Low Confidence Warning Alert (< 70%) */}
                {scanResult.confidence < 70 && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-amber-900 block">
                        Low confidence — please verify the waste type manually.
                      </span>
                      <p className="text-[11px] text-amber-700 leading-normal">
                        The visual scanner detected lower feature certainty ({scanResult.confidence}%). Cross-reference with the item label or consult disposal guide.
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommended Action Checklist */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recommended Action:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {scanResult.recommendedActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
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
                  View Disposal Guide
                </button>
              </div>
            </div>
          )}

          {/* Initial Blank State Prompt */}
          {!selectedImage && !isScanning && !scanResult && (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-4 shadow-inner">
                <ScanLine className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#17211B]">
                Ready to Classify Waste
              </h3>
              <p className="text-xs text-[#647067] max-w-xs mt-1 leading-relaxed">
                Upload a photo or click any demo preset chip on the left to start AI waste classification.
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
    </div>
  );
};
