import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#0A2540] to-[#0074D9] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Protect your brand with real-time monitoring</h2>
        <p className="text-slate-100 mb-6">See mentions and sentiment in one place, get AI-suggested replies, and resolve issues faster.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-white text-[#0A2540] font-semibold">Get Platform Access — $49</Link>
          <Link href="/contact" className="px-6 py-3 rounded-xl border border-white/30">Request Fully Managed — $499</Link>
        </div>
      </div>
    </section>
  );
}
