import {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  BrainCircuit,
  Trophy,
  Microscope,
  Beaker,
  Lightbulb,
  Zap,
  Code,
  Palette,
  Music,
  Globe,
  Compass,
  Heart,
  Brain,
  Rocket,
  Target,
  Award,
  Star,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  Menu,
  LogOut,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

// Map of icon names to icon components
export const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  BrainCircuit,
  Trophy,
  Microscope,
  Beaker,
  Lightbulb,
  Zap,
  Code,
  Palette,
  Music,
  Globe,
  Compass,
  Heart,
  Brain,
  Rocket,
  Target,
  Award,
  Star,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  Menu,
  LogOut,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  Info,
  X,
};

// List of icon names for searching
export const ICON_LIST = Object.keys(ICON_MAP).sort();

// Get icon component by name
export const getIcon = (iconName: string) => {
  return ICON_MAP[iconName] || BookOpen; // Default to BookOpen if not found
};

// Get display name for icon
export const getIconDisplayName = (iconName: string): string => {
  return iconName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
