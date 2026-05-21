export const FAQ_DATA_P2 = [{
        id: 'mh-3',
        category: 'Mental Health Node',
        question: 'Can the AI detect emotional distress?',
        answer: 'The system uses semantic analysis to identify distress indicators in search queries and may trigger a "Clinical Red-Flag Intercept" to suggest immediate expert contact.',
        solution: 'If you are in immediate distress, use the "Emergency Care" contact node in the assistance portal.',
        actionLabel: 'Assistance Portal',
        actionHref: '/support'
    },

    // Pediatric Intelligence
    {
        id: 'pd-1',
        category: 'Pediatric Intelligence',
        question: 'Is the intelligence grid safe for child health queries?',
        answer: 'Our Pediatric Segment utilizes specialized clinical databases focused on infant, child, and adolescent medicine, excluding adult-only pharmacological data.',
        solution: 'Apply the "Pediatric Range" filter when performing a clinical search.',
        actionLabel: 'Set Range',
        actionHref: '/'}, {
        id: 'pd-2',
        category: 'Pediatric Intelligence',
        question: 'How are child dosages calculated?',
        answer: 'The AI synthesizes dosage ranges based on standard pediatric weight-based formulas. These are for educational reference ONLY.',
        solution: 'Always click "Review with Expert" for any pediatric dosage synthesis.',
        actionLabel: 'Find Pediatrician',
        actionHref: '/directory'
    },

    // Expert Protocol
    {
        id: 'ex-1',
        category: 'Expert Protocol',
        question: 'What does "Registry Verified" mean?',
        answer: 'This status indicates that the professional has provided valid medical licenses and government identification, which have been manually audited by our compliance team.',
        solution: 'Check the expert profile for the "Shield" icon to ensure you are interacting with a verified professional.',
        actionLabel: 'View Experts',
        actionHref: '/directory'}, {
        id: 'ex-2',
        category: 'Expert Protocol',
        question: 'How do I schedule a live consultation?',
        answer: 'Verified experts manage their availability through the "Clinical Calendar". You can book time slots directly through their professional profile terminal.',
        solution: 'Visit the expert directory, select a professional, and click "Initialize Consultation".',
        actionLabel: 'Go to Directory',
        actionHref: '/directory'}, {
        id: 'ex-3',
        category: 'Expert Protocol',
        question: 'How do I submit my expert application?',
        answer: 'Professionals must complete the expert onboarding flow, providing license numbers, specialty data, and identity verification documents.',
        solution: 'If you are currently a standard user, you can initialize an expert node via the "Scale Node" portal.',
        actionLabel: 'Upgrade to Expert',
        actionHref: '/expert/setup'
    },

    // Privacy & Security
    {
        id: 'sc-1',
        category: 'Data Security',
        question: 'How is my private health data protected?',
        answer: 'We utilize 256-bit AES encryption for data at rest and TLS 1.3 for data in transit. Your identity is anonymized across our neural processing nodes.',
        solution: 'You can audit your security settings and active duration in the Identity Protocol modal on your profile.',
        actionLabel: 'Check Security',
        actionHref: '/profile'}, {
        id: 'sc-2',
        category: 'Data Security',
        question: 'What is the Auto-Lock Timer?',
        answer: 'The Auto-Lock Timer is a HIPAA-compliant security protocol that automatically terminates your session after a period of inactivity to prevent unauthorized access.',
        solution: 'Adjust your preferred duration in the "Control System" sidebar on your profile page.',
        actionLabel: 'Set Timer',
        actionHref: '/profile'}, {
        id: 'sc-3',
        category: 'Data Security',
        question: 'Are my AI chat logs stored?',
        answer: 'Logs are stored in an encrypted vault exclusively for your reference. Our AI models do not train on your personal health data to ensure total privacy.',
        solution: 'You can purge your entire history at any time from the "Node Integrity" section in your profile menu.',
        actionLabel: 'Manage History',
        actionHref: '/history'
    },

    // Network & Mesh
    {
        id: 'nm-1',
        category: 'Network Mesh',
        question: 'How do I earn Intelligence Points?',
        answer: 'Points are earned by expanding the Network Mesh, contributing verified health insights, and maintaining an active clinical identity.',
        solution: 'Share your "Node Identity" code with peers to begin expanding your network grid.',
        actionLabel: 'View Mesh',
        actionHref: '/profile'}, {
        id: 'nm-2',
        category: 'Network Mesh',
        question: 'What are Rank Levels?',
        answer: 'Rank levels (e.g., Novice, Adept, Elite) reflect your contribution and authority within the health grid. Higher ranks unlock advanced neural tools.',
        solution: 'Monitor your evolution progress in the "Telemetry Segment" of your dashboard.',
        actionLabel: 'Check Rank',
        actionHref: '/profile'
    },

    // Account & Billing
    {
        id: 'bl-1',
        category: 'Account & Billing',
        question: 'What are the subscription tiers?',
        answer: 'IKIKE offers BASIC (free), PLUS (enhanced search), and ELITE (unlimited intelligence and expert priority) tiers.',
        solution: 'Compare features and scale your node in the "Upgrade" portal.',
        actionLabel: 'View Tiers',
        actionHref: '/upgrade'}, {
        id: 'bl-2',
        category: 'Account & Billing',
        question: 'How do I cancel my node scaling?',
        answer: 'Subscription management is handled through your account settings. You will retain access until the current billing cycle expires.',
        solution: 'Go to "Billing History" in your Profile Menu to manage active subscriptions.',
        actionLabel: 'Manage Billing',
        actionHref: '/transactions'
    },

    // Nutritional Neural Base
    {
        id: 'nt-1',
        category: 'Nutritional Neural Base',
        question: 'How does the grid analyze micronutrient data?',
        answer: 'Our nutritional engines map chemical compounds in food and herbs to their known physiological effects based on clinical biochemistry.',
        solution: 'Search for specific nutrients (e.g., "Magnesium Protocol") to see detailed biological mappings.',
        actionLabel: 'Try Search',
        actionHref: '/'}, {
        id: 'nt-2',
        category: 'Nutritional Neural Base',
        question: 'Can the AI suggest meal plans?',
        answer: 'The system can synthesize clinical dietary guidelines for specific health conditions, such as "Anti-Inflammatory Synthesis" or "Diabetic Grid Management".',
        solution: 'Consult with a clinical nutritionist expert to verify any AI-generated dietary protocol.',
        actionLabel: 'Find Nutritionist',
        actionHref: '/directory'
    }
];