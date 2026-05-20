import {
  Building2,
  Drama,
  Rainbow,
  Video,
  Camera,
  Film,
  BookOpen,
  Library,
  MessageCircleHeart,
  Megaphone,
  TrendingUp,
  Sparkles,
  Palette,
  ShoppingBag,
  Coffee,
  Music,
  Heart,
  Star,
  Zap,
  Target,
  Lightbulb,
  Users,
  Briefcase,
  Rocket,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface IconOption {
  id: string;
  name: string;
  component: LucideIcon;
  category: "negocios" | "criativo" | "cultura" | "marketing" | "diversos";
}

export const COMPANY_ICONS: IconOption[] = [
  // Negócios
  {
    id: "building-2",
    name: "Prédio",
    component: Building2,
    category: "negocios",
  },
  {
    id: "briefcase",
    name: "Maleta",
    component: Briefcase,
    category: "negocios",
  },
  { id: "target", name: "Alvo", component: Target, category: "negocios" },
  { id: "rocket", name: "Foguete", component: Rocket, category: "negocios" },
  { id: "globe", name: "Globo", component: Globe, category: "negocios" },

  // Criativo/Audiovisual
  { id: "video", name: "Vídeo", component: Video, category: "criativo" },
  { id: "camera", name: "Câmera", component: Camera, category: "criativo" },
  { id: "film", name: "Filme", component: Film, category: "criativo" },
  { id: "palette", name: "Paleta", component: Palette, category: "criativo" },
  { id: "sparkles", name: "Brilho", component: Sparkles, category: "criativo" },

  // Cultura/Teatro
  { id: "drama", name: "Teatro", component: Drama, category: "cultura" },
  {
    id: "book-open",
    name: "Livro Aberto",
    component: BookOpen,
    category: "cultura",
  },
  {
    id: "library",
    name: "Biblioteca",
    component: Library,
    category: "cultura",
  },
  { id: "music", name: "Música", component: Music, category: "cultura" },

  // Marketing/Comunicação
  {
    id: "megaphone",
    name: "Megafone",
    component: Megaphone,
    category: "marketing",
  },
  {
    id: "trending-up",
    name: "Crescimento",
    component: TrendingUp,
    category: "marketing",
  },
  {
    id: "lightbulb",
    name: "Ideia",
    component: Lightbulb,
    category: "marketing",
  },
  { id: "users", name: "Pessoas", component: Users, category: "marketing" },

  // Diversos
  {
    id: "rainbow",
    name: "Arco-íris",
    component: Rainbow,
    category: "diversos",
  },
  {
    id: "message-circle-heart",
    name: "Mensagem Coração",
    component: MessageCircleHeart,
    category: "diversos",
  },
  { id: "heart", name: "Coração", component: Heart, category: "diversos" },
  { id: "star", name: "Estrela", component: Star, category: "diversos" },
  { id: "zap", name: "Raio", component: Zap, category: "diversos" },
  {
    id: "shopping-bag",
    name: "Sacola",
    component: ShoppingBag,
    category: "diversos",
  },
  { id: "coffee", name: "Café", component: Coffee, category: "diversos" },
];

// Mapeamento direto por ID para performance
const ICON_MAP = new Map<string, LucideIcon>(
  COMPANY_ICONS.map((icon) => [icon.id, icon.component]),
);

/**
 * Retorna o componente de ícone correspondente ao ID
 * @param iconId - ID do ícone (ex: 'building-2', 'drama', 'video')
 * @returns Componente LucideIcon ou Building2 como padrão
 */
export function getCompanyIcon(iconId?: string | null): LucideIcon {
  if (!iconId) return Building2;
  return ICON_MAP.get(iconId) || Building2;
}

/**
 * Retorna informações completas sobre um ícone
 * @param iconId - ID do ícone
 * @returns IconOption ou undefined se não encontrado
 */
export function getIconOption(iconId: string): IconOption | undefined {
  return COMPANY_ICONS.find((icon) => icon.id === iconId);
}

/**
 * Ícones sugeridos para empresas específicas
 */
export const SUGGESTED_ICONS: Record<string, string> = {
  nca: "drama",
  "nca-comunicacao": "drama",
  "pink-money": "rainbow",
  "pink-money-group": "rainbow",
  filmelab: "camera",
  "filme-lab": "camera",
  varda: "book-open",
  encantatoria: "message-circle-heart",
  "teatro-italia": "drama",
  mkt: "megaphone",
  marketing: "trending-up",
};

/**
 * Tenta sugerir um ícone baseado no slug da empresa
 * @param slug - Slug da empresa (ex: 'filmelab', 'nca')
 * @returns ID do ícone sugerido ou 'building-2' como padrão
 */
export function suggestIconBySlug(slug: string): string {
  const normalizedSlug = slug.toLowerCase().trim();
  return SUGGESTED_ICONS[normalizedSlug] || "building-2";
}
