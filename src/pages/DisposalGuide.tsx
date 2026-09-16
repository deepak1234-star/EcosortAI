import React, { useState } from 'react';
import { DISPOSAL_GUIDE_CATEGORIES } from '../data/mockData';
import type { DisposalGuideCategory } from '../data/mockData';
import { Modal } from '../components/Modal';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';
import { SmartImage } from '../components/SmartImage';
import {
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Info,
  Apple,
  FileText,
  Sparkles,
  Shield,
  Box,
  Smartphone,
  Check,
  Layers,
  Sparkle,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export const DisposalGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<DisposalGuideCategory | null>(null);

  // Icon map for dynamic category rendering
  const categoryIcons: Record<string, React.ReactNode> = {
    Apple: <Apple className="w-5 h-5" />,
    FileText: <FileText className="w-5 h-5" />,
    Sparkles: <Sparkles className="w-5 h-5" />,
    Shield: <Shield className="w-5 h-5" />,
    Box: <Box className="w-5 h-5" />,
    Smartphone: <Smartphone className="w-5 h-5" />,
    AlertTriangle: <AlertTriangle className="w-5 h-5" />
  };

  const filterTabs = ['All', 'Organic', 'Paper', 'Plastic', 'Metal', 'Glass', 'E-Waste', 'Hazardous'];

  const filteredCategories = DISPOSAL_GUIDE_CATEGORIES.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.examples.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'All' || cat.category.toLowerCase() === selectedFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fadeIn">
      {/* Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#15803D] to-teal-900 text-white p-6 sm:p-10 shadow-xl space-y-4">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none hidden sm:block">
          <img
            src={REAL_PHOTO_ASSETS.disposal_hero}
            alt="Waste Sorting Recycling Standards"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 border border-white/20 text-xs font-bold">
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>Visual Community Waste Sorting Standards</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Smart Disposal Guide with Visual Step-by-Step Instructions
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Proper waste sorting starts at home. Browse vector diagrams, authorized bin color standards, and visual 3-step disposal workflows.
          </p>

          {/* Search Bar */}
          <div className="relative pt-3">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waste item... (e.g. plastic bottle, cardboard, battery, glass jar, mobile phone)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-white/20 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isSelected = selectedFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#15803D] text-white shadow-md scale-105'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-emerald-300'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Comparison: Wrong Way ❌ vs Right Way ✅ */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#15803D]" />
            <h3 className="font-extrabold text-base text-slate-900">
              Visual Sorting Standards: Common Mistakes & Correct Practices
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Side-by-Side Visual Guide
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wrong Way Card */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Wrong Way (Avoid Contamination) ❌</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950 font-medium">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" opacity="0.9" />
                <span>Mixing plastic food packaging & cutlery into organic compost.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" opacity="0.9" />
                <span>Throwing greasy pizza boxes or unflattened cardboard into paper stream.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" strokeWidth="2.5" opacity="0.9" />
                <span>Putting unwashed liquid bottles or loose rechargeable batteries in general trash.</span>
              </li>
            </ul>
          </div>

          {/* Right Way Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-[#15803D] font-extrabold text-sm uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <span>Right Way (Authorized Protocol) ✅</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Segregate food peels into green compost bins; keep dry paper dry.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Rinse PET bottles, crush aluminum cans, and tape battery terminals safely.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Hand over smartphones, chargers, and hazardous chemicals to authorized kiosks.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories Grid with Custom SVG Visual Artwork */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            {/* SVG Image Preview Container */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <SmartImage
                src={cat.categoryImage}
                alt={cat.name}
                fallbackText={cat.name}
                fallbackCategory={cat.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Authorized Bin Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black border border-white/30 shadow-md ${cat.binBadgeBg} ${cat.binBadgeText}`}>
                  {cat.binColor}
                </span>
              </div>

              {/* Category Icon Pill */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <h3 className="font-extrabold text-base text-white tracking-tight drop-shadow-md">
                  {cat.name}
                </h3>
                <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30`}>
                  {categoryIcons[cat.iconName] || <BookOpen className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Common Items:
                </p>
                <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                  {cat.examples.join(', ')}
                </p>
              </div>

              {/* 3-Step Micro Preview */}
              {cat.steps && cat.steps.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-slate-200/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#15803D]">
                    <Sparkle className="w-3.5 h-3.5 fill-[#15803D]" />
                    <span>3-Step Visual Process:</span>
                  </div>
                  <ol className="text-[11px] text-slate-600 space-y-1">
                    {cat.steps.slice(0, 2).map((s) => (
                      <li key={s.stepNumber} className="flex items-center gap-1.5 truncate">
                        <span className="w-4 h-4 rounded-full bg-[#15803D] text-white font-extrabold text-[9px] flex items-center justify-center shrink-0">
                          {s.stepNumber}
                        </span>
                        <span className="truncate">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Action Trigger */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#15803D] group-hover:text-[#15803D]">
                <span>View Complete Visual Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Municipal Bin Color Reference Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#15803D]" />
          <h3 className="font-extrabold text-base text-slate-900">
            Authorized Municipal Waste Bin Color Standards
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-emerald-600 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-emerald-900 block">Green Bin</span>
            <span className="text-[10px] text-emerald-700 block">Organic / Compost</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-blue-900 block">Blue Bin</span>
            <span className="text-[10px] text-blue-700 block">Paper & Cardboard</span>
          </div>

          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-teal-500 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-teal-900 block">Yellow / Teal</span>
            <span className="text-[10px] text-teal-700 block">Plastics & PET</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-amber-500 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-amber-900 block">Grey Bin</span>
            <span className="text-[10px] text-amber-700 block">Metal & Cans</span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-purple-600 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-purple-900 block">Purple Bin</span>
            <span className="text-[10px] text-purple-700 block">E-Waste Hub</span>
          </div>

          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto shadow-xs" />
            <span className="font-bold text-xs text-red-900 block">Red Bin</span>
            <span className="text-[10px] text-red-700 block">Hazardous / Battery</span>
          </div>
        </div>
      </div>

      {/* Global Disclaimer */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
        <span>
          <strong>Local Municipality Note:</strong> Bin colors and specific guidelines may vary by region. Always consult your municipal waste authority for local sorting regulations.
        </span>
      </div>

      {/* Interactive Detail Modal with Step Breakdown & Vector Image */}
      {selectedCategory && (
        <Modal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          title={`${selectedCategory.name} Visual Guide`}
          subtitle={`Disposal guidelines & bin standards for ${selectedCategory.category}`}
          maxWidth="lg"
        >
          <div className="space-y-6 pt-1">
            {/* Modal Image & Bin Banner */}
            <div className="relative h-56 rounded-2xl overflow-hidden shadow-md bg-slate-900">
              <img
                src={selectedCategory.categoryImage}
                alt={selectedCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold w-fit mb-1 ${selectedCategory.binBadgeBg} ${selectedCategory.binBadgeText}`}>
                  Collection Bin: {selectedCategory.binColor}
                </span>
                <h3 className="font-extrabold text-xl">{selectedCategory.name}</h3>
              </div>
            </div>

            {/* Common Examples */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Common Household Examples:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {selectedCategory.examples.join(' • ')}
              </p>
            </div>

            {/* Visual 3-Step Sorting Process */}
            {selectedCategory.steps && selectedCategory.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#15803D]" />
                  Visual 3-Step Sorting Procedure:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedCategory.steps.map((s) => (
                    <div
                      key={s.stepNumber}
                      className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 relative"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#15803D] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {s.stepNumber}
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">{s.title}</h5>
                      <p className="text-[11px] text-slate-600 leading-snug">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Do's & Don'ts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Do's */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <h4 className="text-xs font-extrabold text-[#15803D] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  Recommended Actions (Do)
                </h4>
                <ul className="space-y-2">
                  {selectedCategory.whatToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              {selectedCategory.avoid.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    What to Avoid (Don't)
                  </h4>
                  <ul className="space-y-2">
                    {selectedCategory.avoid.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Special Instructions Alert Box */}
            {selectedCategory.specialInstruction && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Special Handling Guidance
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {selectedCategory.specialInstruction}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
