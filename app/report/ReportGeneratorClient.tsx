'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Shield, Mail, Phone } from 'lucide-react';
import BusinessSearch from '@/components/scanner/BusinessSearch';

interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  totalReviews: number | null;
  primaryType: string | null;
  phone: string | null;
  website: string | null;
  mapsUrl: string | null;
}

export default function ReportGeneratorClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

  const validateEmail = (value: string) => {
    if (!value) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (value: string) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number';
    return '';
  };

  const handleSelect = (place: PlaceResult) => {
    setSelectedPlace(place);
  };

  const handleGenerateReport = () => {
    const eError = validateEmail(email);
    const pError = validatePhone(phone);
    setEmailError(eError);
    setPhoneError(pError);
    if (eError || pError) return;
    if (!selectedPlace) return;

    const params = new URLSearchParams({ placeId: selectedPlace.placeId });
    if (email) params.set('email', email);
    if (phone) params.set('phone', phone);
    router.push(`/report?${params.toString()}`);
  };

  return (
    <div className="space-y-12 pb-12 max-w-6xl mx-auto">
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 border border-primary-100 shadow-sm">
          <TrendingUp className="h-4 w-4" />
          Free Business Impact Report
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 tracking-tight mb-6 leading-[1.25] max-w-5xl mx-auto">
          See How Much{' '}
          <span className="text-primary-500">Your Business Will Improve</span>{' '}
          When You{' '}
          <span className="text-red-700">Remove Your Negative Reviews</span>
        </h1>
        <p className="text-xl text-secondary-600 max-w-5xl mx-auto leading-relaxed">
          Negative reviews are silently costing you customers every single day. Get a free, instant report that
          reveals your estimated monthly search traffic, how many leads you&apos;re losing because of low ratings,
          and exactly how much more revenue your business could generate if you reached a 5.0 on Google.
        </p>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-white p-1 rounded-3xl shadow-2xl shadow-secondary-200/50 border border-secondary-100">
          <div className="bg-white rounded-[20px] p-6 md:p-8 border border-secondary-50 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="report-email" className="block text-sm font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                  Email address <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <input
                    id="report-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${emailError ? 'border-red-500 ring-1 ring-red-300 bg-red-50/50' : 'border-secondary-200'}`}
                  />
                </div>
                {emailError && <p className="text-sm font-medium text-red-600 mt-1.5">{emailError}</p>}
              </div>
              <div>
                <label htmlFor="report-phone" className="block text-sm font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <input
                    id="report-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(''); }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${phoneError ? 'border-red-500 ring-1 ring-red-300 bg-red-50/50' : 'border-secondary-200'}`}
                  />
                </div>
                {phoneError && <p className="text-sm font-medium text-red-600 mt-1.5">{phoneError}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-secondary-700 mb-1.5 uppercase tracking-wide">
                Search for your business
              </label>
              <BusinessSearch
                onSelect={handleSelect}
                placesApiUrl="/api/public/scanner/places"
              />
            </div>

            {selectedPlace && (
              <div className="bg-secondary-50 border border-secondary-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-secondary-900 truncate">{selectedPlace.name}</p>
                    <p className="text-sm text-secondary-500 truncate">{selectedPlace.address}</p>
                    {selectedPlace.rating != null && (
                      <p className="text-sm text-secondary-600 mt-1">
                        Rating: <strong>{selectedPlace.rating}</strong>
                        {selectedPlace.totalReviews != null && (
                          <span className="text-secondary-400"> ({selectedPlace.totalReviews} reviews)</span>
                        )}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="flex-shrink-0 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-500 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-secondary-400 text-center flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3" />
              100% Free &bull; Your info is never shared
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm sm:text-base text-secondary-700 font-medium max-w-2xl mx-auto px-4">
        Have Questions? Call{' '}
        <a
          href="tel:+13174940354"
          className="text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2"
        >
          (317) 494-0354
        </a>
      </p>
    </div>
  );
}
