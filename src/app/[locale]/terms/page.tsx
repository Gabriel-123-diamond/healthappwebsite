import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 dark:text-white">Terms of Use</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <p className="text-sm text-slate-400">Effective Date: January 26, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">1. Purpose of the App</h2>
            <p>
              IKIKE is a health information and navigation platform that provides educational content and directs users to external health resources, videos, medical experts, and healthcare facilities. IKIKE does not provide medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">2. No Medical Advice</h2>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 font-medium dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-200">
              <p>
                All information provided through IKIKE is for educational and informational purposes only and must not be considered a substitute for professional medical advice, diagnosis, treatment, or emergency care.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">3. User Responsibility</h2>
            <p>
              Users are responsible for their health decisions and agree to consult qualified healthcare professionals for medical concerns.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">4. External Content</h2>
            <p>
              IKIKE links to third-party websites and platforms. IKIKE does not control or guarantee the accuracy of external content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">5. Herbal & Traditional Information</h2>
            <p>
              Information on herbs and traditional practices is shared for educational and cultural awareness only. IKIKE does not provide dosage, preparation methods, or treatment recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">6. Limitation of Liability</h2>
            <p>
              IKIKE and its operators are not liable for health decisions, outcomes, or actions taken based on information accessed through the app.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">7. Modifications & Termination</h2>
            <p>
              IKIKE reserves the right to modify these Terms or suspend access if misuse occurs.
            </p>
            <p className="mt-4">
              <strong>Contact:</strong> support@ikikehealth.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}