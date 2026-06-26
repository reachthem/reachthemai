"use client";
import React from 'react';
import PricingBlocks from '@/components/pricing/PricingBlocks';

const HomePricing = () => {
    return (
        <section id="pricing" className="py-24 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600 text-lg">Choose the plan that fits your review removal needs.</p>
                </div>

                <PricingBlocks advisorPrice="49" removalPrice="49" />
            </div>
        </section>
    );
};

export default HomePricing;
