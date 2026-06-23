import AdvisorCheckoutButton from '@/components/shared/AdvisorCheckoutButton';

export default function PricingAdvisorSubscribeButton() {
  return (
    <AdvisorCheckoutButton
      unauthenticatedHref="/auth/register?redirect=/pricing"
      className="mt-8 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary-600 text-white font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 hover:-translate-y-0.5"
    >
      Subscribe
    </AdvisorCheckoutButton>
  );
}
