/**
 * Self-Contained Photo Assets Library
 * Provides 100% reliable, zero-latency inline photo data URIs that work 100% offline
 * without relying on external network servers or hotlinks.
 */

const createPhotoDataUri = (title: string, subtitle: string, mainColor: string, secondaryColor: string, iconSymbol: string) => {
  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${mainColor}"/>
          <stop offset="100%" stop-color="${secondaryColor}"/>
        </linearGradient>
        <filter id="dropSh" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="600" height="400" fill="url(#bgGrad)"/>
      <circle cx="500" cy="80" r="140" fill="#FFFFFF" opacity="0.08"/>
      <circle cx="100" cy="320" r="160" fill="#FFFFFF" opacity="0.05"/>
      
      <!-- Central Graphic Card -->
      <g transform="translate(300, 180)" filter="url(#dropSh)">
        <circle cx="0" cy="0" r="75" fill="#FFFFFF" opacity="0.2"/>
        <circle cx="0" cy="0" r="60" fill="#FFFFFF"/>
        <text x="0" y="18" fill="${mainColor}" font-family="system-ui, sans-serif" font-weight="900" font-size="52" text-anchor="middle">${iconSymbol}</text>
      </g>

      <!-- Label Pill Banner -->
      <rect x="40" y="300" width="520" height="70" rx="20" fill="#0F172A" opacity="0.85"/>
      <text x="300" y="333" fill="#FFFFFF" font-family="system-ui, sans-serif" font-weight="900" font-size="22" text-anchor="middle">${title}</text>
      <text x="300" y="356" fill="#34D399" font-family="system-ui, sans-serif" font-weight="700" font-size="14" text-anchor="middle">${subtitle}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr.trim())}`;
};

export const REAL_PHOTO_ASSETS = {
  // --- REWARDS PRODUCTS (Linked to user-added images with multi-format support) ---
  reward_bottle: '/images/rewards/LW-Rush-Aqua-Rose-1L-P1_1.jpg',
  reward_tshirt: '/images/rewards/download.jpg',
  reward_bag: '/images/rewards/images.jpeg',
  reward_notebook: '/images/rewards/4.jpg',
  reward_bamboo: '/images/rewards/Bedroom-Sets-for-Studying-Table-Kids-Study-Table-and-Chair-Bamboo-Furniture.avif',

  // --- WASTE CATEGORIES (Linked to user-added images) ---
  category_organic: '/images/categories/organicwaste',
  category_paper: '/images/categories/paper&cardboard',
  category_plastic: '/images/categories/Say-No-To-Plastic-Here-Are-5-Simple-Ways-To-Cut-Down-Plastic-Usage_istock-3.jpg',
  category_metal: '/images/categories/Aluminium_cans.jpg',
  category_glass: '/images/categories/glass-waste-scrap.jpg',
  category_ewaste: '/images/categories/electronic',
  category_hazardous: '/images/categories/images.jpeg',

  // --- DEMO ITEMS ---
  demo_plastic_bottle: createPhotoDataUri('PLASTIC BOTTLE', 'PET 1 Recyclable Plastic', '#0284C7', '#0369A1', '🍾'),
  demo_banana_peel: createPhotoDataUri('BANANA PEEL', 'Organic Compostable Waste', '#854D0E', '#EAB308', '🍌'),
  demo_metal_can: createPhotoDataUri('ALUMINUM CAN', 'Recyclable Metal Beverage Can', '#B91C1C', '#DC2626', '🥫'),
  demo_glass_bottle: createPhotoDataUri('GLASS BOTTLE', 'Clear Glass Container', '#15803D', '#166534', '🍾'),
  demo_mobile_phone: createPhotoDataUri('MOBILE PHONE', 'E-Waste Electronic Device', '#6B21A8', '#9333EA', '📱'),
  demo_battery: createPhotoDataUri('AA BATTERY', 'Hazardous Chemical Battery', '#991B1B', '#EF4444', '🔋'),
  demo_paper_cup: createPhotoDataUri('PAPER CUP', 'Dry Paper Stream', '#1E40AF', '#3B82F6', '☕'),

  // --- USER AVATARS ---
  avatar_deepak: createPhotoDataUri('DEEPAK PATEL', 'Community Member', '#15803D', '#166534', '👤'),
  avatar_alex: createPhotoDataUri('ALEX JOHNSON', 'Community Leader', '#0284C7', '#0369A1', '👤'),
  avatar_sarah: createPhotoDataUri('SARAH JENKINS', 'Eco Volunteer', '#7E22CE', '#6B21A8', '👤'),

  // --- COMMUNITY DRIVES ---
  submission_clean_before: createPhotoDataUri('CLEAN MY AREA (BEFORE)', 'Littered Courtyard Pathway', '#475569', '#64748B', '🧹'),
  submission_clean_after: createPhotoDataUri('CLEAN MY AREA (AFTER)', 'Clean Green Community Park', '#15803D', '#22C55E', '✨'),
  submission_tree_before: createPhotoDataUri('TREE PLANTATION (BEFORE)', 'Soil Preparation Plot', '#78350F', '#92400E', '🌱'),
  submission_tree_after: createPhotoDataUri('TREE PLANTATION (AFTER)', 'Native Sapling Planted', '#14532D', '#166534', '🌳'),
  submission_plastic_before: createPhotoDataUri('PLASTIC DRIVE (BEFORE)', 'Unsorted Plastic Bottles', '#0369A1', '#0284C7', '♻️'),
  submission_plastic_after: createPhotoDataUri('PLASTIC DRIVE (AFTER)', 'Sorted Bundled Recyclables', '#0F766E', '#0D9488', '✅'),

  // --- HERO BANNERS ---
  disposal_hero: createPhotoDataUri('VISUAL DISPOSAL GUIDE', 'Community Waste Sorting Standards', '#0F381E', '#166534', '♻️')
};
