import SubmitRemovalLayoutClient from './SubmitRemovalLayoutClient';

export default function SubmitRemovalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubmitRemovalLayoutClient>{children}</SubmitRemovalLayoutClient>;
}
