import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Shield, Clock, DollarSign, Star } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const steps = [
        { number: '1', text: 'Create your free account' },
        { number: '2', text: 'Submit the review you want removed' },
        { number: '3', text: 'Our experts handle the rest' },
    ];

    const highlights = [
        { icon: DollarSign, text: '$299 per removal — no upfront fees' },
        { icon: Shield, text: 'Google, Yelp, Facebook, Trustpilot & 50+ platforms' },
        { icon: Clock, text: 'Results typically in 1–4 weeks' },
        { icon: CheckCircle2, text: 'Full refund if removal is unsuccessful' },
    ];

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white relative">
                <Link
                    href="/"
                    className="absolute left-8 top-8 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Homepage
                </Link>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

                <div className="relative w-full flex items-center justify-center p-12">
                    <div className="max-w-md w-full space-y-10">
                        {/* Heading */}
                        <div>
                            <h3 className="text-white text-3xl font-bold leading-tight">
                                Remove Negative Reviews. <br />
                                <span className="text-primary-200">Protect Your Reputation.</span>
                            </h3>
                            <p className="mt-4 text-white text-base leading-relaxed">
                                Get started in minutes — create an account and submit the review you want gone.
                            </p>
                        </div>

                        {/* How it works steps */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary-200 mb-4">
                                How it works
                            </p>
                            <div className="space-y-4">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {step.number}
                                        </div>
                                        <span className="text-white text-sm font-medium">{step.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-3">
                            {highlights.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 text-primary-300 flex-shrink-0" />
                                    <span className="text-white/90 text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-2 pt-2">
                            <div className="flex -space-x-2">
                                {['JM', 'AK', 'TS', 'RB'].map((initials) => (
                                    <div
                                        key={initials}
                                        className="w-8 h-8 rounded-full bg-white/20 border-2 border-primary-700 flex items-center justify-center text-white text-[10px] font-semibold"
                                    >
                                        {initials}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 ml-1">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-white/80 text-xs">
                                    4.9 avg rating — trusted by 2,000+ businesses
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}