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

export function DocorpLogo({ size = 28, withTagline = false, colors }: DocorpLogoProps) {
  const logoWidth = size * 4.2;
  const logoHeight = size * 1.25;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
      <img
        src="/logo.png"
        alt="DOCORP"
        style={{
          width: logoWidth,
          height: logoHeight,
          objectFit: 'contain',
          objectPosition: 'left center',
        }}
      />
      {withTagline && (
        <div style={{ fontSize: size * 0.28, color: colors.red, fontWeight: 700, letterSpacing: '0.18em', marginTop: size * 0.15 }}>
          DOING THE RIGHT THING
        </div>
      )}
    </div>
  );
}

export function Tag({ children, color, bg }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 700,
        color,
        background: bg,
        padding: '6px 10px',
        borderRadius: 999,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

export function Hairline({ ruleColor }: HairlineProps) {
  return <div style={{ height: 1, background: ruleColor, width: '100%' }} />;
}
