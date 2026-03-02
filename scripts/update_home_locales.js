/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('fs').existsSync('web-platform/messages') ? 'web-platform/messages' : 'messages';
const messagesDir = path;
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    heroTag: "AI-Powered Health Discovery",
    heroTitle: "How can we help you",
    heroTitleSpan: "today?",
    heroSubtitle: "Search for health topics across modern medical science and traditional herbal wisdom.",
    featuresTitle: "The Future of Health Intelligence",
    featuresSubtitle: "Our architecture synthesizes clinical data with centuries of traditional knowledge to provide comprehensive, evidence-based insights.",
    feature1Title: "Evidence Integrity",
    feature1Desc: "Every insight is cross-referenced with peer-reviewed medical journals and clinical archives.",
    feature2Title: "AI Telehealth",
    feature2Desc: "Connect with verified professionals through secure, AI-assisted video consultations.",
    feature3Title: "Global Network",
    feature3Desc: "A decentralized directory of doctors and herbal practitioners with manual credentialing.",
    feature4Title: "Smart Scheduling",
    feature4Desc: "Automated booking system that respects practitioner availability and clinical priority.",
    feature5Title: "Intelligence Stream",
    feature5Desc: "Personalized feed of articles and trends tailored to your specific health profile.",
    ctaTitle: "Join the Global Health Registry",
    ctaSubtitle: "Whether you are a patient or a professional, become a node in the evolving intelligence grid.",
    ctaButton: "Explore Directory",
    ctaRegister: "Register as Expert"
  },
  fr: {
    heroTag: "Découverte Santé par IA",
    heroTitle: "Comment pouvons-nous vous aider",
    heroTitleSpan: "aujourd'hui ?",
    heroSubtitle: "Recherchez des sujets de santé à travers la science médicale moderne et la sagesse traditionnelle des plantes.",
    featuresTitle: "L'Avenir de l'Intelligence de Santé",
    featuresSubtitle: "Notre architecture synthétise les données cliniques avec des siècles de connaissances traditionnelles pour fournir des informations complètes et fondées sur des preuves.",
    feature1Title: "Intégrité des Preuves",
    feature1Desc: "Chaque information est recoupée avec des revues médicales évaluées par des pairs et des archives cliniques.",
    feature2Title: "Télé-santé IA",
    feature2Desc: "Connectez-vous avec des professionnels vérifiés via des consultations vidéo sécurisées et assistées par l'IA.",
    feature3Title: "Réseau Global",
    feature3Desc: "Un répertoire décentralisé de médecins et de phytothérapeutes avec accréditation manuelle.",
    feature4Title: "Planification Intelligente",
    feature4Desc: "Système de réservation automatisé respectant la disponibilité des praticiens et la priorité clinique.",
    feature5Title: "Flux d'Intelligence",
    feature5Desc: "Flux personnalisé d'articles et de tendances adaptés à votre profil de santé spécifique.",
    ctaTitle: "Rejoignez le Registre Mondial de la Santé",
    ctaSubtitle: "Que vous soyez patient ou professionnel, devenez un nœud dans la grille d'intelligence en évolution.",
    ctaButton: "Explorer l'Annuaire",
    ctaRegister: "S'inscrire comme Expert"
  },
  es: {
    heroTag: "Descubrimiento de Salud con IA",
    heroTitle: "¿Cómo podemos ayudarte",
    heroTitleSpan: "hoy?",
    heroSubtitle: "Busque temas de salud a través de la ciencia médica moderna y la sabiduría herbal tradicional.",
    featuresTitle: "El Futuro de la Inteligencia de Salud",
    featuresSubtitle: "Nuestra arquitectura sintetiza datos clínicos con siglos de conocimiento tradicional para brindar información completa y basada en evidencia.",
    feature1Title: "Integridad de la Evidencia",
    feature1Desc: "Cada información se coteja con revistas médicas revisadas por pares y archivos clínicos.",
    feature2Title: "Telemedicina IA",
    feature2Desc: "Conéctese con profesionales verificados a través de videoconsultas seguras asistidas por IA.",
    feature3Title: "Red Global",
    feature3Desc: "Un directorio descentralizado de médicos y herbolarios con acreditación manual.",
    feature4Title: "Programación Inteligente",
    feature4Desc: "Sistema de reserva automatizado que respeta la disponibilidad del profesional y la prioridad clínica.",
    feature5Title: "Flujo de Inteligencia",
    feature5Desc: "Feed personalizado de artículos y tendencias adaptados a su perfil de salud específico.",
    ctaTitle: "Únase al Registro Global de Salud",
    ctaSubtitle: "Ya sea paciente o profesional, conviértase en un nodo en la red de inteligencia en evolución.",
    ctaButton: "Explorar Directorio",
    ctaRegister: "Registrarse como Experto"
  },
  de: {
    heroTag: "KI-gestützte Gesundheitsentdeckung",
    heroTitle: "Wie können wir Ihnen heute",
    heroTitleSpan: "helfen?",
    heroSubtitle: "Suche nach Gesundheitsthemen in der modernen Medizin und der traditionellen Kräuterweisheit.",
    featuresTitle: "Die Zukunft der Gesundheitsintelligenz",
    featuresSubtitle: "Unsere Architektur synthetisiert klinische Daten mit Jahrhunderten traditionellen Wissens, um umfassende, evidenzbasierte Erkenntnisse zu liefern.",
    feature1Title: "Evidenzintegrität",
    feature1Desc: "Jede Erkenntnis wird mit peer-reviewten medizinischen Fachzeitschriften und klinischen Archiven abgeglichen.",
    feature2Title: "KI-Telemedizin",
    feature2Desc: "Verbinden Sie sich mit verifizierten Fachkräften über sichere, KI-gestützte Videokonsultationen.",
    feature3Title: "Globales Netzwerk",
    feature3Desc: "Ein dezentrales Verzeichnis von Ärzten und Kräuterpraktikern mit manueller Akkreditierung.",
    feature4Title: "Intelligente Planung",
    feature4Desc: "Automatisiertes Buchungssystem, das die Verfügbarkeit der Praktiker und die klinische Priorität berücksichtigt.",
    feature5Title: "Intelligenz-Stream",
    feature5Desc: "Personalisierter Feed mit Artikeln und Trends, die auf Ihr spezifisches Gesundheitsprofil zugeschnitten sind.",
    ctaTitle: "Treten Sie dem Globalen Gesundheitsregister bei",
    ctaSubtitle: "Ob Patient oder Profi, werden Sie ein Knotenpunkt im sich entwickelnden Intelligenznetz.",
    ctaButton: "Verzeichnis erkunden",
    ctaRegister: "Als Experte registrieren"
  },
  zh: {
    heroTag: "AI 驱动的健康发现",
    heroTitle: "今天我们能为您提供什么",
    heroTitleSpan: "帮助？",
    heroSubtitle: "在现代医学科学和传统草药智慧中搜索健康话题。",
    featuresTitle: "健康智能的未来",
    featuresSubtitle: "我们的架构将临床数据与数百年的传统知识相结合，提供全面的、基于证据的见解。",
    feature1Title: "证据完整性",
    feature1Desc: "每项见解都与同行评审的医学期刊和临床档案进行了交叉引用。",
    feature2Title: "AI 远程医疗",
    feature2Desc: "通过安全的、AI 辅助的视频咨询与经过验证的专业人员联系。",
    feature3Title: "全球网络",
    feature3Desc: "医生和草药从业者的去中心化名录，经过人工认证。",
    feature4Title: "智能调度",
    feature4Desc: "尊重从业者可用性和临床优先级的自动化预约系统。",
    feature5Title: "智能流",
    feature5Desc: "根据您的特定健康状况量身定制的文章和趋势的个性化 Feed。",
    ctaTitle: "加入全球健康登记处",
    ctaSubtitle: "无论您是患者还是专业人士，都请成为不断发展的智能网络中的一个节点。",
    ctaButton: "探索名录",
    ctaRegister: "注册为专家"
  },
  ar: {
    heroTag: "اكتشاف الصحة المدعوم بالذكاء الاصطناعي",
    heroTitle: "كيف يمكننا مساعدتك",
    heroTitleSpan: "اليوم؟",
    heroSubtitle: "ابحث عن المواضيع الصحية عبر العلوم الطبية الحديثة والحكمة العشبية التقليدية.",
    featuresTitle: "مستقبل ذكاء الصحة",
    featuresSubtitle: "تجمع بنيتنا بين البيانات السريرية وقرون من المعرفة التقليدية لتقديم رؤى شاملة قائمة على الأدلة.",
    feature1Title: "نزاهة الأدلة",
    feature1Desc: "يتم فحص كل رؤية مع المجلات الطبية التي تمت مراجعتها من قبل الأقران والأرشيفات السريرية.",
    feature2Title: "الطب الاتصالي بالذكاء الاصطناعي",
    feature2Desc: "تواصل مع المتخصصين المعتمدين من خلال استشارات فيديو آمنة مدعومة بالذكاء الاصطناعي.",
    feature3Title: "شبكة عالمية",
    feature3Desc: "دليل لا مركزي للأطباء وممارسي الأعشاب مع اعتماد يدوي.",
    feature4Title: "الجدولة الذكية",
    feature4Desc: "نظام حجز آلي يحترم توفر الممارس والأولوية السريرية.",
    feature5Title: "تدفق الذكاء",
    feature5Desc: "خلاصة مخصصة للمقالات والاتجاهات المصممة لملفك الصحي المحدد.",
    ctaTitle: "انضم إلى السجل العالمي للصحة",
    ctaSubtitle: "سواء كنت مريضًا أو محترفًا، كن عقدة في شبكة الذكاء المتطورة.",
    ctaButton: "استكشف الدليل",
    ctaRegister: "سجل كخبير"
  }
};

locales.forEach(locale => {
  const filePath = require('path').join(messagesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.home = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
