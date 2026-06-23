export default function RemovalAdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[80rem] px-4">
      {children}
    </div>
  );
}
