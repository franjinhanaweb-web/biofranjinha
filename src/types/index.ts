export interface NavItem {
  label: string;
  href: string;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  accentWord: string;
  ctaText: string;
  tagText?: string;
  imageSrc: string;
  imageAlt: string;
}

export interface MarqueeProps {
  text: string;
  separator?: string;
}

export interface BadgeTagProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export interface ExperiencePackage {
  name: string;
  duration: string;
  price: string;
  description?: string;
  features?: string[];
  popular?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  personality?: {
    trait: string;
    emotion: string;
    description: string;
  };
  mood?: string;
}

export interface SpecialExperience {
  name: string;
  duration: string;
  price: string;
  description: string;
  badge?: string;
  personality?: {
    trait: string;
    emotion: string;
    description: string;
  };
  mood?: string;
}

export interface AboutSection {
  title: string;
  qualities: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface LocationInfo {
  area: string;
  description: string;
  amenities: string[];
  promise: string;
}

export interface PreferencesLimits {
  offers: string[];
  limits: string[];
}

export interface PaymentInfo {
  methods: string[];
  schedule: string;
  rules: string[];
  ctaLink: string;
}

export interface PaymentConfig {
  PIX_KEY: string;
  PIX_HOLDER_NAME: string;
  CARD_FEE_PERCENT?: number;
  DEPOSIT_PERCENT: number;
  DEPOSIT_DEADLINE_HOURS: number;
  CANCEL_WINDOW_HOURS: number;
  CREDIT_VALIDITY_DAYS: number;
  LATE_TOLERANCE_MIN: number;
  WHATSAPP_URL: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

export interface VinylRecordProps {
  coverImage?: string;
  vinylImage?: string;
  labelImage: string;
  onClick?: () => void;
  isSpinning?: boolean;
  className?: string;
  coverText?: string;
  style?: React.CSSProperties;
}
