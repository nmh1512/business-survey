// @ts-nocheck
interface DocorpLogoProps {
  size?: number;
  withTagline?: boolean;
  colors: { red: string };
}

interface TagProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}

interface HairlineProps {
  ruleColor: string;
}

const TEXT_COLOR_CLASS: Record<string, string> = {
  '#E11D2E': 'text-primary',
  '#B81525': 'text-primary-deep',
  '#1A1A1A': 'text-ink',
  '#5A5A5F': 'text-ink-soft',
  '#9A9AA0': 'text-ink-mute',
  '#16A34A': 'text-[#16A34A]',
  '#EAB308': 'text-[#EAB308]',
  '#F97316': 'text-[#F97316]',
  '#DC2626': 'text-[#DC2626]',
  '#7F1D1D': 'text-[#7F1D1D]',
};

const BG_COLOR_CLASS: Record<string, string> = {
  '#FCE7E9': 'bg-primary-soft',
  '#FFFFFF': 'bg-bg',
  '#F7F7F8': 'bg-surface',
  '#FFF7F7': 'bg-surface-warm',
  '#16A34A1A': 'bg-[#16A34A1A]',
  '#EAB3081A': 'bg-[#EAB3081A]',
  '#F973161A': 'bg-[#F973161A]',
  '#DC26261A': 'bg-[#DC26261A]',
  '#7F1D1D1A': 'bg-[#7F1D1D1A]',
};

const LOGO_SIZE_CLASS: Record<number, string> = {
  20: 'w-[84px] h-[25px]',
  22: 'w-[92px] h-[28px]',
  24: 'w-[101px] h-[30px]',
  26: 'w-[109px] h-[33px]',
  28: 'w-[118px] h-[35px]',
};

export function DocorpLogo({ size = 28, withTagline = false, colors }: DocorpLogoProps) {
  const logoSizeClass = LOGO_SIZE_CLASS[size] || 'w-[118px] h-[35px]';
  const taglineClass = size <= 20 ? 'text-[5px]' : size <= 22 ? 'text-[6px]' : size <= 24 ? 'text-[7px]' : 'text-[8px]';
  return (
    <div className="inline-flex flex-col leading-none">
      <img
        src="/logo.png"
        alt="DOCORP"
        className={`${logoSizeClass} object-contain object-left`}
      />
      {withTagline && (
        <div className={`mt-[0.15em] font-bold tracking-[0.18em] ${taglineClass} ${TEXT_COLOR_CLASS[colors.red] || 'text-primary'}`}>
          DOING THE RIGHT THING
        </div>
      )}
    </div>
  );
}

export function Tag({ children, color, bg }: TagProps) {
  const textClass = color ? (TEXT_COLOR_CLASS[color] || 'text-ink') : 'text-primary';
  const bgClass = bg ? (BG_COLOR_CLASS[bg] || 'bg-primary-soft') : 'bg-primary-soft';
  return (
    <span
      className={`inline-block rounded-full px-[10px] py-1.5 text-xs font-bold tracking-[0.2px] ${textClass} ${bgClass}`}
    >
      {children}
    </span>
  );
}

export function Hairline({ ruleColor }: HairlineProps) {
  return <div className={`h-px w-full ${BG_COLOR_CLASS[ruleColor] || 'bg-rule'}`} />;
}
