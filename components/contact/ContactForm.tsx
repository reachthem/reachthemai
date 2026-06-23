'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';
import { submitContactForm } from '@/app/actions/contact';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      toast.success("Your message has been sent! We'll be in touch shortly.");
      reset();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="first_name"
            type="text"
            autoComplete="given-name"
            {...register('first_name')}
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="John"
          />
          {errors.first_name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="last_name"
            type="text"
            autoComplete="family-name"
            {...register('last_name')}
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Smith"
          />
          {errors.last_name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email_address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email_address"
          type="email"
          autoComplete="email"
          {...register('email_address')}
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="you@example.com"
        />
        {errors.email_address && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email_address.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Phone Number <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="phone_number"
          type="tel"
          autoComplete="tel"
          {...register('phone_number')}
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
          placeholder="Tell us about the review you'd like removed, or ask any questions..."
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
