/**
 * High-Resolution Vector SVG Assets Library
 * Provides 100% reliable, zero-latency, crisp visual graphics for waste sorting,
 * categories, demo classifications, rewards, and community actions.
 */

// Helper to encode SVG strings safely into SVG Data URIs
const svgToDataUri = (svgStr: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr.trim())}`;
};

export const SVG_ASSETS = {
  // --- WASTE CATEGORIES (Disposal Guide Cards) ---
  category_organic: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="orgBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#052E16"/>
          <stop offset="50%" stop-color="#14532D"/>
          <stop offset="100%" stop-color="#15803D"/>
        </linearGradient>
        <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
        <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FACC15"/>
          <stop offset="100%" stop-color="#CA8A04"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#orgBg)"/>
      <circle cx="700" cy="100" r="180" fill="#22C55E" opacity="0.15"/>
      <circle cx="100" cy="400" r="120" fill="#4ADE80" opacity="0.1"/>
      
      <!-- Apple -->
      <g transform="translate(240, 180) scale(1.4)">
        <path d="M40 10 C20 -10, -10 20, 10 60 C25 90, 55 90, 70 60 C90 20, 60 -10, 40 10 Z" fill="url(#appleGrad)"/>
        <path d="M40 10 Q45 -15 50 -25" stroke="#78350F" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M48 -20 C65 -35, 75 -15, 48 -18" fill="#22C55E"/>
      </g>
      
      <!-- Banana Peel -->
      <g transform="translate(420, 210) scale(1.2)">
        <path d="M10 80 Q 40 10, 90 20 Q 130 30, 140 80 Q 90 60, 50 90 Z" fill="url(#bananaGrad)"/>
        <path d="M20 75 Q 60 40, 120 70" stroke="#854D0E" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Leaves -->
      <g transform="translate(140, 280) scale(0.9)">
        <path d="M10 50 C10 10, 60 10, 60 50 C60 90, 10 90, 10 50 Z" fill="#4ADE80" opacity="0.8"/>
        <path d="M10 50 L60 50" stroke="#14532D" stroke-width="3"/>
      </g>

      <!-- Badge Text Overlay -->
      <rect x="50" y="45" width="220" height="44" rx="22" fill="#DCFCE7" opacity="0.95"/>
      <text x="160" y="73" fill="#15803D" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">GREEN COMPOST BIN</text>
    </svg>
  `),

  category_paper: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="paperBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="50%" stop-color="#1E3A8A"/>
          <stop offset="100%" stop-color="#2563EB"/>
        </linearGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#paperBg)"/>
      <circle cx="650" cy="380" r="160" fill="#60A5FA" opacity="0.15"/>

      <!-- Cardboard Box -->
      <g transform="translate(240, 150)">
        <polygon points="100,20 280,20 340,90 40,90" fill="#F59E0B"/>
        <polygon points="40,90 340,90 340,240 40,240" fill="url(#boxGrad)"/>
        <polygon points="340,90 400,40 400,180 340,240" fill="#92400E"/>
        <line x1="190" y1="90" x2="190" y2="240" stroke="#78350F" stroke-width="4"/>
        <rect x="70" y="120" width="100" height="60" rx="8" fill="#FEF3C7" opacity="0.8"/>
        <!-- Tape Symbol -->
        <path d="M80 140 L150 140 M80 160 L130 160" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>
      </g>

      <!-- Folded Paper Sheets -->
      <g transform="translate(130, 200) rotate(-12)">
        <rect width="140" height="180" rx="10" fill="#FFFFFF" opacity="0.95"/>
        <line x1="20" y1="30" x2="120" y2="30" stroke="#94A3B8" stroke-width="4"/>
        <line x1="20" y1="60" x2="100" y2="60" stroke="#94A3B8" stroke-width="4"/>
        <line x1="20" y1="90" x2="110" y2="90" stroke="#94A3B8" stroke-width="4"/>
      </g>

      <rect x="50" y="45" width="240" height="44" rx="22" fill="#DBEAFE" opacity="0.95"/>
      <text x="170" y="73" fill="#1E40AF" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">BLUE RECYCLING BIN</text>
    </svg>
  `),

  category_plastic: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="plastBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#042F2E"/>
          <stop offset="50%" stop-color="#115E59"/>
          <stop offset="100%" stop-color="#0D9488"/>
        </linearGradient>
        <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#BAE6FD" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#plastBg)"/>
      <circle cx="150" cy="120" r="140" fill="#2DD4BF" opacity="0.15"/>

      <!-- Plastic PET Bottle -->
      <g transform="translate(320, 110)">
        <!-- Cap -->
        <rect x="55" y="10" width="50" height="25" rx="5" fill="#0284C7"/>
        <!-- Neck -->
        <rect x="63" y="35" width="34" height="20" fill="#E0F2FE"/>
        <!-- Body -->
        <path d="M40 70 C30 90, 20 120, 20 180 L20 280 C20 310, 40 330, 80 330 C120 330, 140 310, 140 280 L140 180 C140 120, 130 90, 120 70 Z" fill="url(#bottleGrad)" stroke="#7DD3FC" stroke-width="4"/>
        <!-- Water Level -->
        <path d="M22 220 Q 80 230, 138 220 L138 280 C138 305, 120 325, 80 325 C40 325, 22 305, 22 280 Z" fill="#0284C7" opacity="0.4"/>
        <!-- PET 1 Code Badge -->
        <polygon points="80,130 110,180 50,180" fill="none" stroke="#0369A1" stroke-width="4"/>
        <text x="80" y="170" fill="#0369A1" font-family="system-ui, sans-serif" font-weight="900" font-size="22" text-anchor="middle">1</text>
      </g>

      <!-- HDPE Jug -->
      <g transform="translate(150, 180) scale(0.85)">
        <rect x="0" y="40" width="130" height="180" rx="20" fill="#CCFBF1" opacity="0.9"/>
        <rect x="35" y="10" width="40" height="30" rx="6" fill="#0D9488"/>
        <path d="M100 60 L130 60 L130 120 L100 120 Z" fill="none" stroke="#0F766E" stroke-width="6"/>
      </g>

      <rect x="50" y="45" width="250" height="44" rx="22" fill="#CCFBF1" opacity="0.95"/>
      <text x="175" y="73" fill="#0F766E" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">YELLOW / TEAL PLASTIC BIN</text>
    </svg>
  `),

  category_metal: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="metalBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1C1917"/>
          <stop offset="50%" stop-color="#78350F"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <linearGradient id="canGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#DC2626"/>
          <stop offset="40%" stop-color="#EF4444"/>
          <stop offset="70%" stop-color="#FCA5A5"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#metalBg)"/>
      <circle cx="680" cy="140" r="150" fill="#F59E0B" opacity="0.15"/>

      <!-- Aluminum Soda Can -->
      <g transform="translate(320, 120)">
        <ellipse cx="70" cy="20" rx="60" ry="18" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
        <ellipse cx="70" cy="20" rx="35" ry="10" fill="#CBD5E1"/>
        <path d="M10 20 L10 240 C10 260, 30 270, 70 270 C110 270, 130 260, 130 240 L130 20 Z" fill="url(#canGrad)"/>
        <ellipse cx="70" cy="240" rx="60" ry="15" fill="#B91C1C"/>
        <!-- Pull Tab -->
        <circle cx="70" cy="20" r="6" fill="#64748B"/>
      </g>

      <!-- Tin Food Can -->
      <g transform="translate(160, 200) scale(0.9)">
        <rect x="0" y="20" width="130" height="150" rx="10" fill="#E2E8F0" stroke="#64748B" stroke-width="4"/>
        <line x1="0" y1="50" x2="130" y2="50" stroke="#94A3B8" stroke-width="3"/>
        <line x1="0" y1="80" x2="130" y2="80" stroke="#94A3B8" stroke-width="3"/>
        <line x1="0" y1="110" x2="130" y2="110" stroke="#94A3B8" stroke-width="3"/>
      </g>

      <rect x="50" y="45" width="220" height="44" rx="22" fill="#FEF3C7" opacity="0.95"/>
      <text x="160" y="73" fill="#B45309" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">GREY METAL BIN</text>
    </svg>
  `),

  category_glass: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="glassBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#091E05"/>
          <stop offset="50%" stop-color="#14532D"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803D" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#4ADE80" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#166534" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#glassBg)"/>
      <circle cx="200" cy="380" r="160" fill="#34D399" opacity="0.15"/>

      <!-- Green Glass Bottle -->
      <g transform="translate(340, 90)">
        <rect x="50" y="10" width="30" height="60" rx="4" fill="#166534"/>
        <path d="M50 70 C30 100, 20 130, 20 180 L20 300 C20 320, 35 330, 65 330 C95 330, 110 320, 110 300 L110 180 C110 130, 100 100, 80 70 Z" fill="url(#glassGrad)" stroke="#86EFAC" stroke-width="3"/>
        <!-- Reflection Highlight -->
        <path d="M35 180 L35 280" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
      </g>

      <!-- Clear Glass Jar -->
      <g transform="translate(180, 180) scale(0.9)">
        <rect x="20" y="30" width="120" height="160" rx="15" fill="#E0F2FE" opacity="0.8" stroke="#7DD3FC" stroke-width="4"/>
        <rect x="10" y="10" width="140" height="25" rx="6" fill="#F59E0B"/>
      </g>

      <rect x="50" y="45" width="220" height="44" rx="22" fill="#D1FAE5" opacity="0.95"/>
      <text x="160" y="73" fill="#047857" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">GLASS BOTTLE BANK</text>
    </svg>
  `),

  category_ewaste: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="ewasteBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2E1065"/>
          <stop offset="50%" stop-color="#581C87"/>
          <stop offset="100%" stop-color="#7E22CE"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#ewasteBg)"/>
      <!-- Circuit Grid Pattern -->
      <path d="M100 100 L300 100 L300 250 M500 400 L500 200 L700 200" stroke="#C084FC" stroke-width="3" stroke-dasharray="8 8" opacity="0.3" fill="none"/>

      <!-- Modern Smartphone E-Waste -->
      <g transform="translate(300, 100)">
        <rect x="0" y="0" width="170" height="310" rx="24" fill="#0F172A" stroke="#A855F7" stroke-width="6"/>
        <rect x="10" y="15" width="150" height="280" rx="16" fill="#1E1B4B"/>
        <!-- Screen Content: Charging / Battery Icon -->
        <rect x="55" y="110" width="60" height="90" rx="8" fill="none" stroke="#22C55E" stroke-width="4"/>
        <polygon points="85,120 70,155 88,155 75,190 100,150 82,150" fill="#22C55E"/>
      </g>

      <!-- Cable & Plug -->
      <g transform="translate(140, 220) scale(0.9)">
        <path d="M0 80 Q 60 20, 120 80" stroke="#E9D5FF" stroke-width="8" fill="none"/>
        <rect x="110" y="70" width="30" height="20" rx="4" fill="#A855F7"/>
      </g>

      <rect x="50" y="45" width="230" height="44" rx="22" fill="#F3E8FF" opacity="0.95"/>
      <text x="165" y="73" fill="#6B21A8" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">PURPLE E-WASTE HUB</text>
    </svg>
  `),

  category_hazardous: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="hazBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#450A0A"/>
          <stop offset="50%" stop-color="#7F1D1D"/>
          <stop offset="100%" stop-color="#B91C1C"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="30" fill="url(#hazBg)"/>
      <circle cx="650" cy="350" r="160" fill="#EF4444" opacity="0.15"/>

      <!-- AA Battery with Tape -->
      <g transform="translate(330, 110)">
        <!-- Top Terminal -->
        <rect x="45" y="0" width="40" height="15" rx="4" fill="#94A3B8"/>
        <!-- Body -->
        <rect x="20" y="15" width="90" height="270" rx="12" fill="#1E293B" stroke="#F59E0B" stroke-width="5"/>
        <!-- Yellow Safety Stripes -->
        <polygon points="20,80 110,130 110,160 20,110" fill="#F59E0B"/>
        <polygon points="20,160 110,210 110,240 20,190" fill="#F59E0B"/>
        <!-- Safety Electrical Tape Overlay on Terminals -->
        <rect x="15" y="10" width="100" height="35" fill="#3B82F6" opacity="0.95"/>
        <text x="65" y="32" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="14" text-anchor="middle">TAPED</text>
      </g>

      <!-- Danger Warning Symbol -->
      <g transform="translate(150, 160) scale(1.1)">
        <polygon points="60,10 115,100 5,100" fill="#F59E0B" stroke="#78350F" stroke-width="4"/>
        <text x="60" y="85" fill="#78350F" font-family="system-ui, sans-serif" font-weight="900" font-size="50" text-anchor="middle">!</text>
      </g>

      <rect x="50" y="45" width="240" height="44" rx="22" fill="#FEE2E2" opacity="0.95"/>
      <text x="170" y="73" fill="#991B1B" font-family="system-ui, sans-serif" font-weight="900" font-size="20" text-anchor="middle">RED HAZARDOUS DEPOT</text>
    </svg>
  `),

  // --- DEMO CLASSIFICATIONS (AI Scanner Preset Items) ---
  demo_plastic_bottle: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#E0F2FE"/>
      <g transform="translate(120, 40) scale(0.8)">
        <rect x="55" y="10" width="50" height="25" rx="5" fill="#0284C7"/>
        <rect x="63" y="35" width="34" height="20" fill="#E0F2FE"/>
        <path d="M40 70 C30 90, 20 120, 20 180 L20 280 C20 310, 40 330, 80 330 C120 330, 140 310, 140 280 L140 180 C140 120, 130 90, 120 70 Z" fill="#38BDF8" opacity="0.8" stroke="#0284C7" stroke-width="4"/>
        <polygon points="80,130 110,180 50,180" fill="none" stroke="#0369A1" stroke-width="4"/>
        <text x="80" y="170" fill="#0369A1" font-family="system-ui, sans-serif" font-weight="900" font-size="22" text-anchor="middle">1</text>
      </g>
    </svg>
  `),

  demo_banana_peel: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#FEF9C3"/>
      <g transform="translate(80, 90) scale(1.6)">
        <path d="M10 80 Q 40 10, 90 20 Q 130 30, 140 80 Q 90 60, 50 90 Z" fill="#EAB308"/>
        <path d="M20 75 Q 60 40, 120 70" stroke="#854D0E" stroke-width="3" stroke-linecap="round" fill="none"/>
      </g>
    </svg>
  `),

  demo_metal_can: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#FEF3C7"/>
      <g transform="translate(130, 60) scale(0.9)">
        <ellipse cx="70" cy="20" rx="60" ry="18" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
        <path d="M10 20 L10 240 C10 260, 30 270, 70 270 C110 270, 130 260, 130 240 L130 20 Z" fill="#DC2626"/>
      </g>
    </svg>
  `),

  demo_glass_bottle: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#D1FAE5"/>
      <g transform="translate(135, 40) scale(0.85)">
        <rect x="50" y="10" width="30" height="60" rx="4" fill="#166534"/>
        <path d="M50 70 C30 100, 20 130, 20 180 L20 300 C20 320, 35 330, 65 330 C95 330, 110 320, 110 300 L110 180 C110 130, 100 100, 80 70 Z" fill="#15803D" stroke="#86EFAC" stroke-width="4"/>
      </g>
    </svg>
  `),

  demo_mobile_phone: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#F3E8FF"/>
      <g transform="translate(125, 45) scale(0.9)">
        <rect x="0" y="0" width="160" height="300" rx="20" fill="#0F172A" stroke="#9333EA" stroke-width="5"/>
        <rect x="10" y="15" width="140" height="270" rx="12" fill="#1E1B4B"/>
        <rect x="50" y="110" width="60" height="90" rx="8" fill="none" stroke="#22C55E" stroke-width="4"/>
      </g>
    </svg>
  `),

  demo_battery: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#FEE2E2"/>
      <g transform="translate(145, 60) scale(0.9)">
        <rect x="35" y="0" width="40" height="15" rx="4" fill="#94A3B8"/>
        <rect x="10" y="15" width="90" height="250" rx="12" fill="#1E293B" stroke="#EF4444" stroke-width="4"/>
        <polygon points="10,80 100,130 100,160 10,110" fill="#F59E0B"/>
      </g>
    </svg>
  `),

  demo_paper_cup: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" rx="20" fill="#E0F2FE"/>
      <g transform="translate(110, 60)">
        <polygon points="20,40 160,40 140,260 40,260" fill="#FFFFFF" stroke="#94A3B8" stroke-width="4"/>
        <polygon points="25,90 155,90 145,170 35,170" fill="#D97706"/>
      </g>
    </svg>
  `),

  // --- REWARDS PRODUCTS (High-Definition Product Vector Artwork) ---
  reward_bottle: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="btlBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#022C22"/>
          <stop offset="50%" stop-color="#065F46"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
        <linearGradient id="metalSteel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="25%" stop-color="#E2E8F0"/>
          <stop offset="50%" stop-color="#FFFFFF"/>
          <stop offset="75%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
        <linearGradient id="woodCap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="500" height="500" rx="32" fill="url(#btlBg)"/>
      <circle cx="250" cy="250" r="180" fill="#10B981" opacity="0.12"/>

      <!-- Bottle Shadow & Body -->
      <g transform="translate(160, 40)" filter="url(#shadow)">
        <!-- Screw Cap & Loop -->
        <path d="M75 10 C50 10, 50 35, 75 35 C105 35, 105 10, 75 10 Z" fill="none" stroke="#F59E0B" stroke-width="8"/>
        <rect x="55" y="30" width="70" height="35" rx="8" fill="url(#woodCap)" stroke="#B45309" stroke-width="3"/>
        <line x1="55" y1="45" x2="125" y2="45" stroke="#92400E" stroke-width="3"/>

        <!-- Neck -->
        <rect x="68" y="65" width="44" height="25" fill="url(#metalSteel)"/>

        <!-- Steel Bottle Body -->
        <path d="M40 100 C30 130, 20 160, 20 220 L20 390 C20 415, 40 430, 90 430 C140 430, 160 415, 160 390 L160 220 C160 160, 150 130, 140 100 Z" fill="url(#metalSteel)"/>
        
        <!-- Engraved Eco Logo & Text -->
        <circle cx="90" cy="220" r="28" fill="#065F46" opacity="0.85"/>
        <path d="M90 200 C80 212, 90 230, 90 238" stroke="#34D399" stroke-width="4" fill="none"/>
        <text x="90" y="275" fill="#334155" font-family="system-ui, sans-serif" font-weight="900" font-size="15" text-anchor="middle" letter-spacing="1">ECOSORT</text>
        <text x="90" y="295" fill="#64748B" font-family="system-ui, sans-serif" font-weight="700" font-size="11" text-anchor="middle">750ML THERMAL</text>
      </g>
    </svg>
  `),

  reward_tshirt: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="tshirtBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B"/>
          <stop offset="50%" stop-color="#047857"/>
          <stop offset="100%" stop-color="#10B981"/>
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#065F46"/>
          <stop offset="100%" stop-color="#044E36"/>
        </linearGradient>
        <filter id="shadowT" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="500" height="500" rx="32" fill="url(#tshirtBg)"/>

      <!-- Folded Graphic T-Shirt -->
      <g transform="translate(75, 75)" filter="url(#shadowT)">
        <!-- Shirt Base Frame -->
        <path d="M110 30 C140 60, 210 60, 240 30 L330 80 L280 160 L260 140 L260 330 C260 345, 245 355, 230 355 L120 355 C105 355, 90 345, 90 330 L90 140 L70 160 L20 80 Z" fill="url(#shirtGrad)" stroke="#064E3B" stroke-width="4"/>

        <!-- Ribbed Collar -->
        <path d="M110 30 C140 65, 210 65, 240 30" fill="none" stroke="#34D399" stroke-width="6" stroke-linecap="round"/>

        <!-- Chest Eco Emblem -->
        <g transform="translate(175, 170)">
          <circle cx="0" cy="0" r="42" fill="#10B981" opacity="0.25"/>
          <circle cx="0" cy="0" r="32" fill="#047857" stroke="#34D399" stroke-width="3"/>
          <path d="M-10 5 C-15 -15, 15 -15, 10 5 C5 15, -5 15, -10 5 Z" fill="#6EE7B7"/>
          <text x="0" y="55" fill="#A7F3D0" font-family="system-ui, sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1">100% ORGANIC</text>
        </g>

        <!-- Hanging Kraft Tag -->
        <g transform="translate(250, 40) rotate(15)">
          <line x1="0" y1="0" x2="20" y2="40" stroke="#F59E0B" stroke-width="3"/>
          <rect x="5" y="40" width="45" height="70" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
          <circle cx="27" cy="52" r="4" fill="#78350F"/>
          <text x="27" y="80" fill="#B45309" font-family="system-ui, sans-serif" font-weight="900" font-size="11" text-anchor="middle">ECO</text>
          <text x="27" y="94" fill="#B45309" font-family="system-ui, sans-serif" font-weight="700" font-size="9" text-anchor="middle">COTTON</text>
        </g>
      </g>
    </svg>
  `),

  reward_bag: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bagBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#451A03"/>
          <stop offset="50%" stop-color="#78350F"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <linearGradient id="juteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <pattern id="juteWeave" width="16" height="16" patternUnits="userSpaceOnUse">
          <line x1="0" y1="8" x2="16" y2="8" stroke="#78350F" stroke-width="2" opacity="0.3"/>
          <line x1="8" y1="0" x2="8" y2="16" stroke="#78350F" stroke-width="2" opacity="0.3"/>
        </pattern>
        <filter id="shadowB" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="500" height="500" rx="32" fill="url(#bagBg)"/>

      <!-- Jute Tote Bag -->
      <g transform="translate(100, 70)" filter="url(#shadowB)">
        <!-- Handles -->
        <path d="M90 70 Q 150 -15, 210 70" stroke="#451A03" stroke-width="20" stroke-linecap="round" fill="none"/>
        <path d="M90 70 Q 150 -15, 210 70" stroke="#78350F" stroke-width="12" stroke-linecap="round" fill="none"/>

        <!-- Bag Main Body -->
        <rect x="40" y="70" width="220" height="290" rx="20" fill="url(#juteGrad)" stroke="#78350F" stroke-width="4"/>
        <rect x="40" y="70" width="220" height="290" rx="20" fill="url(#juteWeave)"/>

        <!-- Handle Brass Rivets -->
        <circle cx="90" cy="90" r="7" fill="#F59E0B" stroke="#78350F" stroke-width="2"/>
        <circle cx="210" cy="90" r="7" fill="#F59E0B" stroke="#78350F" stroke-width="2"/>

        <!-- Front Printed Badge -->
        <g transform="translate(150, 210)">
          <rect x="-65" y="-45" width="130" height="90" rx="16" fill="#DCFCE7" stroke="#166534" stroke-width="3"/>
          <circle cx="0" cy="-10" r="20" fill="#15803D"/>
          <path d="M0 -22 C-8 -10, 0 5, 0 10" stroke="#FFFFFF" stroke-width="3" fill="none"/>
          <text x="0" y="28" fill="#14532D" font-family="system-ui, sans-serif" font-weight="900" font-size="12" text-anchor="middle">SUSTAINABLE JUTE</text>
        </g>
      </g>
    </svg>
  `),

  reward_notebook: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="nbBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="50%" stop-color="#1E3A8A"/>
          <stop offset="100%" stop-color="#3B82F6"/>
        </linearGradient>
        <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1D4ED8"/>
          <stop offset="100%" stop-color="#1E40AF"/>
        </linearGradient>
        <filter id="shadowN" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="500" height="500" rx="32" fill="url(#nbBg)"/>

      <!-- Recycled Notebook -->
      <g transform="translate(110, 75)" filter="url(#shadowN)">
        <!-- Pages Thickness Layer -->
        <rect x="55" y="25" width="220" height="310" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
        <line x1="275" y1="35" x2="275" y2="325" stroke="#94A3B8" stroke-width="4"/>

        <!-- Front Hardcover -->
        <rect x="40" y="20" width="230" height="320" rx="16" fill="url(#coverGrad)" stroke="#1D4ED8" stroke-width="3"/>

        <!-- Elastic Band & Ribbon -->
        <rect x="230" y="20" width="22" height="320" fill="#F59E0B" opacity="0.9"/>
        <path d="M120 340 L135 375 L150 340 Z" fill="#EF4444"/>

        <!-- Wire Binding Loops -->
        <g fill="#94A3B8" stroke="#475569" stroke-width="2">
          <rect x="30" y="40" width="25" height="12" rx="4"/>
          <rect x="30" y="80" width="25" height="12" rx="4"/>
          <rect x="30" y="120" width="25" height="12" rx="4"/>
          <rect x="30" y="160" width="25" height="12" rx="4"/>
          <rect x="30" y="200" width="25" height="12" rx="4"/>
          <rect x="30" y="240" width="25" height="12" rx="4"/>
          <rect x="30" y="280" width="25" height="12" rx="4"/>
        </g>

        <!-- Gold Foil Cover Stamp -->
        <rect x="80" y="120" width="120" height="120" rx="16" fill="none" stroke="#FBBF24" stroke-width="3"/>
        <text x="140" y="170" fill="#FBBF24" font-family="system-ui, sans-serif" font-weight="900" font-size="16" text-anchor="middle">RECYCLED</text>
        <text x="140" y="195" fill="#FEF08A" font-family="system-ui, sans-serif" font-weight="700" font-size="12" text-anchor="middle">160 PAGES</text>
      </g>
    </svg>
  `),

  reward_bamboo: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bamBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#451A03"/>
          <stop offset="50%" stop-color="#78350F"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <linearGradient id="bambooWood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#CA8A04"/>
          <stop offset="30%" stop-color="#EAB308"/>
          <stop offset="70%" stop-color="#FEF08A"/>
          <stop offset="100%" stop-color="#A16207"/>
        </linearGradient>
        <filter id="shadowBm" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <rect width="500" height="500" rx="32" fill="url(#bamBg)"/>

      <!-- Bamboo Desk Set -->
      <g transform="translate(80, 80)" filter="url(#shadowBm)">
        <!-- Bamboo Pen Holder Cup -->
        <rect x="50" y="140" width="110" height="200" rx="20" fill="url(#bambooWood)" stroke="#854D0E" stroke-width="4"/>
        <line x1="50" y1="200" x2="160" y2="200" stroke="#78350F" stroke-width="4"/>
        <line x1="50" y1="270" x2="160" y2="270" stroke="#78350F" stroke-width="4"/>

        <!-- Pens inside Cup -->
        <line x1="80" y1="40" x2="80" y2="140" stroke="#15803D" stroke-width="8" stroke-linecap="round"/>
        <line x1="105" y1="20" x2="105" y2="140" stroke="#2563EB" stroke-width="8" stroke-linecap="round"/>
        <line x1="130" y1="50" x2="130" y2="140" stroke="#DC2626" stroke-width="8" stroke-linecap="round"/>

        <!-- Bamboo Phone Dock Stand -->
        <rect x="190" y="190" width="120" height="150" rx="16" fill="url(#bambooWood)" stroke="#854D0E" stroke-width="4"/>
        <rect x="205" y="210" width="90" height="110" rx="10" fill="#0F172A"/>
        <polygon points="250,240 235,275 253,275 240,300 265,265 247,265" fill="#22C55E"/>
      </g>
    </svg>
  `),

  // --- COMMUNITY SUBMISSION BEFORE / AFTER ---
  submission_clean_before: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#F1F5F9"/>
      <rect x="0" y="180" width="400" height="120" fill="#94A3B8"/>
      <!-- Scattered Litter -->
      <path d="M50 200 L90 220 L70 240 Z" fill="#EF4444"/>
      <circle cx="180" cy="220" r="15" fill="#3B82F6"/>
      <rect x="260" y="210" width="40" height="25" fill="#EAB308"/>
    </svg>
  `),

  submission_clean_after: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#DCFCE7"/>
      <rect x="0" y="180" width="400" height="120" fill="#22C55E"/>
      <!-- Green Bins -->
      <rect x="60" y="140" width="45" height="70" rx="6" fill="#15803D"/>
      <rect x="120" y="140" width="45" height="70" rx="6" fill="#2563EB"/>
    </svg>
  `),

  submission_tree_before: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#FEF3C7"/>
      <rect x="0" y="180" width="400" height="120" fill="#78350F"/>
      <!-- Spade -->
      <line x1="200" y1="100" x2="200" y2="200" stroke="#94A3B8" stroke-width="8"/>
    </svg>
  `),

  submission_tree_after: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#ECFDF5"/>
      <rect x="0" y="180" width="400" height="120" fill="#14532D"/>
      <!-- Planted Sapling -->
      <line x1="200" y1="120" x2="200" y2="220" stroke="#78350F" stroke-width="8"/>
      <circle cx="200" cy="110" r="45" fill="#22C55E"/>
    </svg>
  `),

  submission_plastic_before: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#E0F2FE"/>
      <!-- Unsorted Pile -->
      <circle cx="150" cy="180" r="30" fill="#0284C7"/>
      <circle cx="210" cy="160" r="25" fill="#06B6D4"/>
      <circle cx="250" cy="200" r="35" fill="#0EA5E9"/>
    </svg>
  `),

  submission_plastic_after: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
      <rect width="400" height="300" rx="16" fill="#CCFBF1"/>
      <!-- Packed Recycling Bags -->
      <ellipse cx="140" cy="180" rx="50" ry="60" fill="#0D9488" opacity="0.8"/>
      <ellipse cx="250" cy="180" rx="50" ry="60" fill="#0F766E" opacity="0.8"/>
    </svg>
  `),

  // --- USER AVATARS ---
  avatar_deepak: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="100" cy="100" r="100" fill="#15803D"/>
      <circle cx="100" cy="70" r="35" fill="#DCFCE7"/>
      <path d="M40 170 C40 120, 160 120, 160 170 Z" fill="#DCFCE7"/>
    </svg>
  `),

  avatar_alex: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="100" cy="100" r="100" fill="#0284C7"/>
      <circle cx="100" cy="70" r="35" fill="#E0F2FE"/>
      <path d="M40 170 C40 120, 160 120, 160 170 Z" fill="#E0F2FE"/>
    </svg>
  `),

  avatar_sarah: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="100" cy="100" r="100" fill="#7E22CE"/>
      <circle cx="100" cy="70" r="35" fill="#F3E8FF"/>
      <path d="M40 170 C40 120, 160 120, 160 170 Z" fill="#F3E8FF"/>
    </svg>
  `),

  // --- HERO BANNERS ---
  disposal_hero: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
      <rect width="800" height="400" fill="#0F381E"/>
      <g opacity="0.4">
        <rect x="100" y="80" width="80" height="140" rx="10" fill="#22C55E"/>
        <rect x="220" y="80" width="80" height="140" rx="10" fill="#3B82F6"/>
        <rect x="340" y="80" width="80" height="140" rx="10" fill="#14B8A6"/>
        <rect x="460" y="80" width="80" height="140" rx="10" fill="#F59E0B"/>
        <rect x="580" y="80" width="80" height="140" rx="10" fill="#A855F7"/>
        <rect x="700" y="80" width="80" height="140" rx="10" fill="#EF4444"/>
      </g>
    </svg>
  `)
};
