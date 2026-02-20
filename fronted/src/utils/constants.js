export const PILLARS = {
  Cultural: [
    'Origin & Identity',
    'Language & Oral Traditions',
    'Beliefs & Values',
    'Rituals & Ceremonies',
    'Arts & Craftsmanship',
    'Traditional Medicine'
  ],
  Social: [
    'Family & Kinship',
    'Community Leadership',
    'Education & Skill Transfer',
    'Social Wellness',
    'Festivals & Gatherings'
  ],
  Economic: [
    'Traditional Commerce',
    'Agro-Trade',
    'Heritage Tourism',
    'Local Industries',
    'Sustainable Cooperatives'
  ],
  Environmental: [
    'Ancestral Land Knowledge',
    'Water Resource Management',
    'Indigenous Flora & Fauna',
    'Soil Preservation',
    'Climate Adaptation'
  ],
  Technical: [
    'Traditional Engineering',
    'Food Processing Tech',
    'Tool Making',
    'Construction Techniques',
    'Water Engineering'
  ]
};

// ── REGISTRATION COUNTIES ─────────────────────────────────────────────────────
// This project is scoped to Murang'a County only.
// To add more counties later, add to REGISTRATION_COUNTY and SUB_COUNTIES below.
export const REGISTRATION_COUNTY = "Murang'a";

export const MURANGA_SUB_COUNTIES = [
  'Kabũi Central',
  'Gaitheri',
  'Kamune',
  'Keni',
  'Gakũrwe',
  'Kairi',
  'Mahuaini',
  'Thuita',
  'Iruri',
  'Gathũkĩinĩ',
  'Kiambũgĩ',
  'Giathiya',
  'Mũrĩnga',
  'Mũkũrwe'
];

export const TOWN_SPECIALIZATIONS = {
  'Kabũi Central': 'Aerotropolis & Logistics',
  'Gaitheri': 'AI & Governance',
  'Kamune': 'Bamboo Engineering',
  'Keni': 'Hydraulic Hub',
  'Gakũrwe': 'Avocado Processing',
  'Kairi': 'Dairy & Biogas Spine',
  'Mahuaini': 'Commercial Gateway',
  'Thuita': 'Specialty Coffee',
  'Iruri': 'Macadamia Extraction',
  'Gathũkĩinĩ': 'Horticulture Hub',
  'Kiambũgĩ': 'Education & Tech',
  'Giathiya': 'Textiles & Fibers',
  'Mũrĩnga': 'Bio-Fertilizer',
  'Mũkũrwe': 'Culture & Heritage'
};

export const CLAN_DATA = [
  { daughter: 'Wanjirũ', clan: 'Anjirũ', specialization: 'Law & Leadership' },
  { daughter: 'Wambũi', clan: 'Ambũi', specialization: 'Commerce & Intelligence' },
  { daughter: 'Wanjikũ', clan: 'Agachikũ', specialization: 'Industry & Farming' },
  { daughter: 'Wangarĩ', clan: 'Angarĩ', specialization: 'Strategy & Bravery' },
  { daughter: 'Waceera', clan: 'Aceera', specialization: 'Justice & Diplomacy' },
  { daughter: 'Njeri', clan: 'Anjeri', specialization: 'Ethics & Wisdom' },
  { daughter: 'Nyambura', clan: 'Ethaga', specialization: 'Spirituality & Science' },
  { daughter: 'Mũthoni', clan: 'Aithĩrandũ', specialization: 'Social Order' },
  { daughter: 'Wairimũ', clan: 'Airimũ', specialization: 'Philosophy & Logic' }
];

// ─────────────────────────────────────────────────────────────────────────────

// Legacy / general constants kept for submission workspace use
export const COUNTIES = [
  "Murang'a",
];

export const SUB_COUNTIES = {
  "Murang'a": MURANGA_SUB_COUNTIES,
};
