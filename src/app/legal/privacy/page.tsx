export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-sans py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last Updated: January 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information you provide directly to us, such as when you create an account, perform a search, or contact support. 
            This includes your email address, name, and search history (if logged in).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">2. How We Use Information</h2>
          <p className="text-gray-600 leading-relaxed">
            We use your information to:
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services.</li>
                <li>Personalize your search experience.</li>
                <li>Sync your history across devices.</li>
            </ul>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">3. Data Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement reasonable security measures to protect your personal information. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
          </p>
        </section>
      </div>
    </div>
  );
}
