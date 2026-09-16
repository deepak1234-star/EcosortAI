import type {
  User,
  CommunityActivity,
  Reward,
  DemoClassification,
  WasteScan,
  CommunitySubmission,
  RewardRedemption
} from '../types';
import { REAL_PHOTO_ASSETS } from '../utils/photoAssets';

export const INITIAL_USER: User = {
  id: 'usr_001',
  name: 'Alex Johnson',
  email: 'alex.johnson@ecosort.org',
  role: 'Community Member',
  ecoPoints: 850,
  activitiesCompleted: 6,
  scansCompleted: 12,
  avatar: REAL_PHOTO_ASSETS.avatar_alex
};

export const DEMO_CLASSIFICATIONS: DemoClassification[] = [
  {
    id: 'demo_plastic_bottle',
    name: 'Plastic Bottle',
    confidence: 94,
    category: 'Plastic',
    type: 'Plastic (PET 1)',
    recommendedActions: [
      'Empty the bottle completely.',
      'Rinse it when appropriate.',
      'Keep it clean and dry.',
      'Place it in the appropriate recyclable/dry-waste stream according to local rules.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_plastic_bottle
  },
  {
    id: 'demo_banana_peel',
    name: 'Banana Peel',
    confidence: 98,
    category: 'Organic',
    type: 'Organic Waste',
    recommendedActions: [
      'Place in organic or green compost bin.',
      'Keep separate from non-biodegradable materials.',
      'Suitable for home composting or municipal organic processing.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_banana_peel
  },
  {
    id: 'demo_metal_can',
    name: 'Metal Can',
    confidence: 96,
    category: 'Metal',
    type: 'Aluminum / Steel',
    recommendedActions: [
      'Rinse out food or drink residue.',
      'Flatten if appropriate to save recycling container space.',
      'Deposit in dedicated metal recycling collection.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_metal_can
  },
  {
    id: 'demo_glass_bottle',
    name: 'Glass Bottle',
    confidence: 93,
    category: 'Glass',
    type: 'Glass Container',
    recommendedActions: [
      'Empty contents and rinse clean.',
      'Handle with care to avoid glass breakage.',
      'Place into authorized glass drop-off bin or bottle bank.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_glass_bottle
  },
  {
    id: 'demo_mobile_phone',
    name: 'Mobile Phone',
    confidence: 91,
    category: 'E-Waste',
    type: 'Electronic Device',
    recommendedActions: [
      'Do not place electronic waste in normal household garbage.',
      'Follow appropriate authorized e-waste disposal guidance.',
      'Wipe personal data prior to dropping off at e-waste collection center.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_mobile_phone
  },
  {
    id: 'demo_battery',
    name: 'Battery',
    confidence: 97,
    category: 'Hazardous',
    type: 'Hazardous / Chemical',
    recommendedActions: [
      'Do not place batteries in normal household waste.',
      'Tape terminals for lithium or high-voltage batteries for safe storage.',
      'Handle and dispose of them according to appropriate local hazardous-waste guidance.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_battery
  },
  {
    id: 'demo_paper_cup',
    name: 'Paper Cup',
    confidence: 89,
    category: 'Paper',
    type: 'Paperboard',
    recommendedActions: [
      'Check for plastic or poly-lining before recycling.',
      'Empty liquid residues thoroughly.',
      'Dispose of according to local paper stream guidelines.'
    ],
    sampleImage: REAL_PHOTO_ASSETS.demo_paper_cup
  }
];

export const INITIAL_COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  {
    id: 'act_clean_area',
    title: 'Clean My Area',
    description: 'Help clean a street, park or local community area.',
    rewardPoints: 50,
    iconName: 'Sparkles',
    categoryTag: 'Local Cleanup'
  },
  {
    id: 'act_tree_plantation',
    title: 'Tree Plantation',
    description: 'Plant a sapling in your neighborhood, public garden, or community park.',
    rewardPoints: 100,
    iconName: 'Trees',
    categoryTag: 'Greening'
  },
  {
    id: 'act_plastic_drive',
    title: 'Plastic Collection Drive',
    description: 'Collect clean plastic bottles or packaging from community spots.',
    rewardPoints: 50,
    iconName: 'Trash2',
    categoryTag: 'Recycling Drive'
  },
  {
    id: 'act_school_cleanliness',
    title: 'Community Cleanliness Drive',
    description: 'Organize or join a hygiene and waste management drive in your neighborhood.',
    rewardPoints: 50,
    iconName: 'GraduationCap',
    categoryTag: 'Neighborhood Drive'
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew_bottle',
    name: 'Eco-Friendly Stainless Steel Bottle',
    description: 'BPA-free durable insulated water bottle (750ml).',
    points: 500,
    image: REAL_PHOTO_ASSETS.reward_bottle
  },
  {
    id: 'rew_tshirt',
    name: 'Eco-Friendly Organic Cotton T-Shirt',
    description: '100% organic cotton breathable eco graphic tee.',
    points: 750,
    image: REAL_PHOTO_ASSETS.reward_tshirt
  },
  {
    id: 'rew_bag',
    name: 'Sustainable Jute Shopping Bag',
    description: 'Heavy-duty reusable tote bag for plastic-free shopping.',
    points: 600,
    image: REAL_PHOTO_ASSETS.reward_bag
  },
  {
    id: 'rew_notebook',
    name: 'Recycled Paper Hardcover Notebook',
    description: 'Made from 100% post-consumer waste paper. 160 pages.',
    points: 400,
    image: REAL_PHOTO_ASSETS.reward_notebook
  },
  {
    id: 'rew_bamboo',
    name: 'Bamboo Desk Organizer Set',
    description: 'Eco-friendly bamboo pen holder, coaster & phone stand.',
    points: 450,
    image: REAL_PHOTO_ASSETS.reward_bamboo
  }
];

export const INITIAL_SCANS: WasteScan[] = [
  {
    id: 'scan_001',
    itemName: 'Plastic Bottle',
    category: 'Plastic',
    confidence: 94,
    type: 'Plastic',
    recommendedActions: [
      'Empty the bottle.',
      'Rinse it when appropriate.',
      'Keep it clean and dry.'
    ],
    date: '2026-09-11',
    imageUrl: REAL_PHOTO_ASSETS.demo_plastic_bottle
  },
  {
    id: 'scan_002',
    itemName: 'Mobile Phone',
    category: 'E-Waste',
    confidence: 91,
    type: 'E-Waste',
    recommendedActions: [
      'Do not place electronic waste in normal household garbage.'
    ],
    date: '2026-09-10',
    imageUrl: REAL_PHOTO_ASSETS.demo_mobile_phone
  }
];

export const INITIAL_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: 'sub_001',
    activityId: 'act_clean_area',
    activityName: 'Clean My Area',
    date: '2026-09-10',
    location: 'North Campus Park & Pathway',
    description: 'Collected plastic litter and sorted dry recyclables around the community courtyard.',
    beforeImage: REAL_PHOTO_ASSETS.submission_clean_before,
    afterImage: REAL_PHOTO_ASSETS.submission_clean_after,
    status: 'Approved',
    rewardPoints: 50,
    submittedAt: '2026-09-10T14:30:00Z',
    participantName: 'Alex Johnson'
  },
  {
    id: 'sub_002',
    activityId: 'act_tree_plantation',
    activityName: 'Tree Plantation',
    date: '2026-09-08',
    location: 'Community Botanical Garden',
    description: 'Planted 3 native saplings during Environment Week.',
    beforeImage: REAL_PHOTO_ASSETS.submission_tree_before,
    afterImage: REAL_PHOTO_ASSETS.submission_tree_after,
    status: 'Approved',
    rewardPoints: 100,
    submittedAt: '2026-09-08T10:15:00Z',
    participantName: 'Alex Johnson'
  },
  {
    id: 'sub_003',
    activityId: 'act_plastic_drive',
    activityName: 'Plastic Collection Drive',
    date: '2026-09-05',
    location: 'Community Library Grounds',
    description: 'Gathered 15kg of plastic bottles for regional recycling depot.',
    beforeImage: REAL_PHOTO_ASSETS.submission_plastic_before,
    afterImage: REAL_PHOTO_ASSETS.submission_plastic_after,
    status: 'Approved',
    rewardPoints: 50,
    submittedAt: '2026-09-05T16:00:00Z',
    participantName: 'Alex Johnson'
  }
];

export const INITIAL_REDEMPTIONS: RewardRedemption[] = [
  {
    id: 'red_001',
    rewardId: 'rew_notebook',
    rewardName: 'Recycled Paper Hardcover Notebook',
    points: 400,
    date: '2026-09-09',
    status: 'Fulfilled',
    image: REAL_PHOTO_ASSETS.reward_notebook
  }
];

export interface VisualStep {
  stepNumber: number;
  title: string;
  desc: string;
}

export interface DisposalGuideCategory {
  id: string;
  name: string;
  category: string;
  iconName: string;
  colorBg: string;
  colorText: string;
  categoryImage: string;
  binColor: string;
  binBadgeBg: string;
  binBadgeText: string;
  examples: string[];
  whatToDo: string[];
  avoid: string[];
  steps: VisualStep[];
  specialInstruction?: string;
}

export const DISPOSAL_GUIDE_CATEGORIES: DisposalGuideCategory[] = [
  {
    id: 'cat_organic',
    name: 'Organic Waste',
    category: 'Organic',
    iconName: 'Apple',
    colorBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    colorText: 'text-emerald-800',
    categoryImage: REAL_PHOTO_ASSETS.category_organic,
    binColor: 'Green Bin (Compost)',
    binBadgeBg: 'bg-[#DCFCE7]',
    binBadgeText: 'text-[#15803D]',
    examples: ['Food scraps', 'Fruit peels', 'Vegetable waste', 'Coffee grounds', 'Leaves & garden trimmings'],
    whatToDo: [
      'Segregate organic food scraps from dry waste at source.',
      'Use home composting bins or municipal green waste collection.',
      'Keep liquid runoff contained in biodegradable paper/bio-bags.'
    ],
    avoid: ['Mixing plastic packaging, cutlery, foil, or synthetic bags with organic waste.'],
    steps: [
      { stepNumber: 1, title: 'Separate Food Scraps', desc: 'Collect kitchen peels, vegetables, and tea bags in a dedicated kitchen caddy.' },
      { stepNumber: 2, title: 'Keep Free of Plastics', desc: 'Ensure no plastic stickers, wrappers, or foil enter the organic container.' },
      { stepNumber: 3, title: 'Deposit in Green Bin', desc: 'Empty into green compost bins or home garden compost heap.' }
    ]
  },
  {
    id: 'cat_paper',
    name: 'Paper & Cardboard',
    category: 'Paper',
    iconName: 'FileText',
    colorBg: 'bg-blue-50 text-blue-700 border-blue-200',
    colorText: 'text-blue-800',
    categoryImage: REAL_PHOTO_ASSETS.category_paper,
    binColor: 'Blue Bin (Paper Recycling)',
    binBadgeBg: 'bg-blue-100',
    binBadgeText: 'text-blue-800',
    examples: ['Newspapers & magazines', 'Cardboard boxes', 'Office paper', 'Envelopes', 'Clean paper bags'],
    whatToDo: [
      'Flatten cardboard shipping boxes to maximize bin space.',
      'Keep paper dry and free of oil, grease, or food stains.',
      'Remove packing tape or plastic handles where feasible.'
    ],
    avoid: ['Recycling dirty pizza boxes, grease-stained wrappers, or thermal receipts.'],
    steps: [
      { stepNumber: 1, title: 'Remove Non-Paper Items', desc: 'Peel off packing tape, plastic wrapping, and metal spiral bindings.' },
      { stepNumber: 2, title: 'Flatten & Fold', desc: 'Collapse shipping boxes flat to conserve storage space.' },
      { stepNumber: 3, title: 'Drop in Blue Bin', desc: 'Place dry paper and folded cardboard in the blue paper recycling bin.' }
    ]
  },
  {
    id: 'cat_plastic',
    name: 'Plastic Containers & PET',
    category: 'Plastic',
    iconName: 'Sparkles',
    colorBg: 'bg-teal-50 text-teal-700 border-teal-200',
    colorText: 'text-teal-800',
    categoryImage: REAL_PHOTO_ASSETS.category_plastic,
    binColor: 'Yellow / Teal Bin (Plastics)',
    binBadgeBg: 'bg-teal-100',
    binBadgeText: 'text-teal-800',
    examples: ['Water & beverage bottles (PET 1)', 'Detergent & shampoo bottles (HDPE 2)', 'Clean food containers', 'Rigid plastic tubs'],
    whatToDo: [
      'Empty liquids and rinse clean of food residue.',
      'Screw plastic caps back onto clean empty bottles.',
      'Check resin identification code (PET 1, HDPE 2).'
    ],
    avoid: ['Mixing unrinsed food containers or non-recyclable soft plastic film with rigid plastics.'],
    steps: [
      { stepNumber: 1, title: 'Rinse Clean', desc: 'Flush out leftover liquids or food contents with a quick rinse.' },
      { stepNumber: 2, title: 'Cap & Compress', desc: 'Squeeze air out of bottles and secure cap tightly.' },
      { stepNumber: 3, title: 'Recycle Right', desc: 'Place in designated plastic recycling bin or drop-off point.' }
    ]
  },
  {
    id: 'cat_metal',
    name: 'Metal & Aluminum Cans',
    category: 'Metal',
    iconName: 'Shield',
    colorBg: 'bg-amber-50 text-amber-700 border-amber-200',
    colorText: 'text-amber-800',
    categoryImage: REAL_PHOTO_ASSETS.category_metal,
    binColor: 'Grey / Silver Bin (Metals)',
    binBadgeBg: 'bg-amber-100',
    binBadgeText: 'text-amber-800',
    examples: ['Aluminum soda cans', 'Tin food cans', 'Metal bottle caps', 'Clean aluminum foil'],
    whatToDo: [
      'Rinse out food residue and soup cans thoroughly.',
      'Crush beverage cans flat to maximize storage efficiency.',
      'Collect metal caps inside a clean tin can before recycling.'
    ],
    avoid: ['Putting pressurized aerosol cans containing dangerous propellants into general recycling.'],
    steps: [
      { stepNumber: 1, title: 'Rinse Food Residue', desc: 'Wash out food cans to prevent odors and insect infestation.' },
      { stepNumber: 2, title: 'Crush Aluminum Cans', desc: 'Flatten soda and beverage cans by stepping or squeezing.' },
      { stepNumber: 3, title: 'Deposit in Metal Stream', desc: 'Place clean cans into metal recovery bins or scrap depots.' }
    ]
  },
  {
    id: 'cat_glass',
    name: 'Glassware & Bottles',
    category: 'Glass',
    iconName: 'Box',
    colorBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    colorText: 'text-indigo-800',
    categoryImage: REAL_PHOTO_ASSETS.category_glass,
    binColor: 'Green / Clear Glass Bank',
    binBadgeBg: 'bg-indigo-100',
    binBadgeText: 'text-indigo-800',
    examples: ['Glass beverage bottles', 'Food & condiment jars', 'Glass perfume containers'],
    whatToDo: [
      'Rinse and dry glass jars and bottles.',
      'Remove metal lids or corks and sort separately.',
      'Sort glass by color (clear, amber, green) if required locally.'
    ],
    avoid: ['Mixing broken window glass, mirrors, ceramics, Pyrex, or light bulbs with glass container bottles.'],
    steps: [
      { stepNumber: 1, title: 'Rinse & Remove Lids', desc: 'Clean out jar contents and detach corks or metal screw caps.' },
      { stepNumber: 2, title: 'Sort by Color', desc: 'Group clear, green, and brown glass bottles into proper slots.' },
      { stepNumber: 3, title: 'Glass Bottle Bank', desc: 'Gently drop bottles into neighborhood bottle banks or glass bins.' }
    ]
  },
  {
    id: 'cat_ewaste',
    name: 'Electronic Waste (E-Waste)',
    category: 'E-Waste',
    iconName: 'Smartphone',
    colorBg: 'bg-purple-50 text-purple-700 border-purple-200',
    colorText: 'text-purple-800',
    categoryImage: REAL_PHOTO_ASSETS.category_ewaste,
    binColor: 'Purple E-Waste Center',
    binBadgeBg: 'bg-purple-100',
    binBadgeText: 'text-purple-800',
    examples: ['Mobile phones & tablets', 'Chargers & power adapters', 'USB cables & cords', 'Old laptops & hardware', 'Printers & accessories'],
    whatToDo: [
      'Deliver to authorized municipal e-waste collection centers.',
      'Perform factory data reset & data wipe on digital devices.',
      'Bundle electrical cords neatly using tie-wraps.'
    ],
    avoid: ['Throwing electronic devices, circuit boards, or wiring into household trash.'],
    steps: [
      { stepNumber: 1, title: 'Wipe Private Data', desc: 'Backup and factory data reset your smartphones, tablets, or hard drives.' },
      { stepNumber: 2, title: 'Organize Cables', desc: 'Tie power cords neatly with twist ties.' },
      { stepNumber: 3, title: 'Take to E-Waste Hub', desc: 'Hand over to authorized e-waste recycling kiosks or drives.' }
    ],
    specialInstruction: 'Important: E-waste contains valuable metals and heavy elements. Never dispose of electronics in regular trash.'
  },
  {
    id: 'cat_hazardous',
    name: 'Hazardous & Chemical Waste',
    category: 'Hazardous',
    iconName: 'AlertTriangle',
    colorBg: 'bg-red-50 text-red-700 border-red-200',
    colorText: 'text-red-800',
    categoryImage: REAL_PHOTO_ASSETS.category_hazardous,
    binColor: 'Red Hazardous Waste Depot',
    binBadgeBg: 'bg-red-100',
    binBadgeText: 'text-red-800',
    examples: ['Household AA/AAA batteries', 'Paint cans & solvents', 'Chemical cleaners', 'Fluorescent light tubes', 'Mercury thermometers'],
    whatToDo: [
      'Keep in original leak-proof containers with warning labels intact.',
      'Cover lithium battery terminals with electrical tape for safety.',
      'Deliver directly to municipal toxic waste drop-off events.'
    ],
    avoid: ['Dumping chemicals down household drains or putting batteries in general waste bins.'],
    steps: [
      { stepNumber: 1, title: 'Tape Battery Terminals', desc: 'Apply non-conductive tape over battery ends to prevent short circuits.' },
      { stepNumber: 2, title: 'Keep Sealed & Labeled', desc: 'Ensure liquid chemicals remain in tightly closed original containers.' },
      { stepNumber: 3, title: 'Special Disposal Event', desc: 'Drop off at authorized hazardous waste collection sites.' }
    ],
    specialInstruction: 'Danger: Hazardous materials can pollute groundwater and cause fires. Handle with strict care and follow local chemical disposal rules.'
  }
];

export const ECO_TIPS = [
  "Rinse recyclable containers when appropriate and keep them clean and dry before placing them in the correct waste stream.",
  "Always keep organic food waste separate from paper and plastic recyclables to avoid contamination.",
  "E-waste contains valuable metals that can be safely reclaimed when dropped off at official collection points.",
  "Check local recycling numbers (PET 1, HDPE 2) to ensure items are processed in your municipality."
];
