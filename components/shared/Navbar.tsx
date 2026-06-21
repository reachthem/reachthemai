'use client';

interface NavbarProps {
  background?: string;
  maxWidth?: string;
  variant?: string;
  showLogo?: boolean;
  navVariant?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function Navbar({
  background = 'white',
  maxWidth = '98%',
  variant,
  showLogo = true,
  navVariant,
  leftContent,
  rightContent,
}: NavbarProps) {
  return (
    <nav style={{ background, maxWidth }}>
      {leftContent}
      {rightContent}
    </nav>
  );
}
