export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white font-sans py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using HealthAI, you agree to be bound by these Terms of Use. If you do not agree, you may not access or use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">2. No Medical Advice</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>CRITICAL:</strong> HealthAI is an educational tool. We do NOT provide medical advice. 
            The content is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">3. User Conduct</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree not to misuse the platform or use it for illegal purposes. We reserve the right to ban users who violate these terms.
          </p>
        </section>
      </div>
    </div>
  );
}
