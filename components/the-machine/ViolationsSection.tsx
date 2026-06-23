import { Ban, MessageSquareOff, ShieldAlert, Skull, AlertOctagon, Swords, UserX, Flame, CheckCircle2 } from 'lucide-react';

const VIOLATIONS = [
  {
    icon: Ban,
    type: 'Spam & Fake Reviews',
    description: 'Bot-generated reviews, paid reviews, competitor attacks, and reviews from people who never visited your business.',
    color: 'bg-red-50 text-red-600 border-red-200',
  },
  {
    icon: MessageSquareOff,
    type: 'Off-Topic Content',
    description: 'Reviews that have nothing to do with the customer experience — political rants, personal disputes, or content about a different business.',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  {
    icon: ShieldAlert,
    type: 'Restricted Content',
    description: 'References to regulated goods or services like alcohol, tobacco, firearms, pharmaceuticals, or gambling.',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    icon: Skull,
    type: 'Illegal Activity',
    description: 'Reviews promoting or describing illegal activities, substance abuse, or criminal behavior.',
    color: 'bg-red-50 text-red-700 border-red-300',
  },
  {
    icon: AlertOctagon,
    type: 'Sexually Explicit',
    description: 'Obscene, sexually suggestive, or inappropriate content that violates platform decency standards.',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
  },
  {
    icon: Swords,
    type: 'Conflict of Interest',
    description: 'Reviews from competitors, ex-employees, business partners, or anyone with a financial relationship to the business.',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  {
    icon: UserX,
    type: 'Impersonation',
    description: 'Reviewers pretending to be someone else, using fake identities, or misrepresenting their relationship to the business.',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    icon: Flame,
    type: 'Harassment & Threats',
    description: 'Personal attacks, threats of violence, discriminatory language, hate speech, doxxing, or targeted bullying.',
    color: 'bg-red-50 text-red-600 border-red-200',
  },
];

export default function ViolationsSection() {
  return (
    <section className="py-24 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-primary-600 uppercase tracking-widest font-medium mb-3">
            Policy Classification
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-secondary-900 mb-4">
            8 Violation Categories We Detect
          </h2>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Our AI checks every review against Google&apos;s full content policy library.
            If it violates any of these categories, we flag it and build your removal case.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {VIOLATIONS.map((v) => (
            <div key={v.type} className={`rounded-xl border p-5 ${v.color}`}>
              <v.icon className="h-8 w-8 mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-2">{v.type}</h3>
              <p className="text-sm text-secondary-600 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-full px-5 py-2.5">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Legitimate negative reviews are never flagged — only policy violations.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
