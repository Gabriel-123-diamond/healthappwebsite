import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 dark:text-white">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 dark:text-slate-300">
          <p className="text-sm text-slate-400">Effective Date: January 26, 2026</p>

          <p>
            IKIKE respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect information when you use the IKIKE mobile application.
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">1. Information We Collect</h2>
            <p>
              IKIKE collects limited information to provide and improve the app experience. This may include search queries related to health topics, feedback messages, device information, usage data, approximate location for hospital listings, and anonymous analytics data. IKIKE does not collect or store medical records, diagnoses, prescriptions, or treatment histories.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">2. How We Use Information</h2>
            <p>
              Information collected is used to provide relevant health information links, improve app performance, display nearby medical experts and hospitals, ensure security, and analyze anonymous usage trends.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">3. Third-Party Services</h2>
            <p>
              IKIKE may use third-party services such as analytics providers, advertising networks, and external platforms including video and search services. These third parties operate under their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">4. Data Sharing</h2>
            <p>
              IKIKE does not sell personal data. Information may only be shared to comply with legal obligations, protect user safety, or support app functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">5. Data Security</h2>
            <p>
              We apply reasonable technical and organizational measures to protect user data, however no digital platform can guarantee complete security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">6. Children’s Privacy</h2>
            <p>
              IKIKE is not intended for children under the age of 13 and does not knowingly collect personal data from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 dark:text-white">7. Policy Updates</h2>
            <p>
              This Privacy Policy may be updated periodically. Updates will be published within the app.
            </p>
            <p className="mt-4">
              <strong>Contact:</strong> privacy@ikikehealth.ai
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}