/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    title: "Expert Directory",
    subtitle: "Connect with verified medical and herbal practitioners.",
    searchPlaceholder: "Search by specialty or name...",
    specialists: "Specialists",
    centers: "Centers",
    nearby: "NEARBY",
    allTypes: "All Types",
    doctors: "Doctors",
    herbalists: "Practitioners",
    clinics: "Clinics",
    noExperts: "No experts found matching filters",
    viewProfile: "View Profile",
    bookAppointment: "Book Consultation",
    filters: "Filter Results",
    location: "Location",
    rating: "Rating",
    verified: "Verified Expert"
  },
  fr: {
    title: "Annuaire des Experts",
    subtitle: "Connectez-vous avec des praticiens médicaux et herboristes vérifiés.",
    searchPlaceholder: "Rechercher par spécialité ou nom...",
    specialists: "Spécialistes",
    centers: "Centres",
    nearby: "À PROXIMITÉ",
    allTypes: "Tous les types",
    doctors: "Médecins",
    herbalists: "Praticiens",
    clinics: "Cliniques",
    noExperts: "Aucun expert trouvé correspondant aux filtres",
    viewProfile: "Voir le profil",
    bookAppointment: "Réserver une consultation",
    filters: "Filtrer les résultats",
    location: "Emplacement",
    rating: "Évaluation",
    verified: "Expert Vérifié"
  },
  es: {
    title: "Directorio de Expertos",
    subtitle: "Conéctese con profesionales médicos y herbolarios verificados.",
    searchPlaceholder: "Buscar por especialidad o nombre...",
    specialists: "Especialistas",
    centers: "Centros",
    nearby: "CERCANOS",
    allTypes: "Todos los tipos",
    doctors: "Médicos",
    herbalists: "Praticantes",
    clinics: "Clínicas",
    noExperts: "No se encontraron expertos que coincidan con los filtros",
    viewProfile: "Ver Perfil",
    bookAppointment: "Reservar Consulta",
    filters: "Filtrar Resultados",
    location: "Ubicación",
    rating: "Calificación",
    verified: "Experto Verificado"
  },
  de: {
    title: "Expertenverzeichnis",
    subtitle: "Verbinden Sie sich mit verifizierten medizinischen und pflanzlichen Praktikern.",
    searchPlaceholder: "Suche nach Fachgebiet oder Name...",
    specialists: "Spezialisten",
    centers: "Zentren",
    nearby: "IN DER NÄHE",
    allTypes: "Alle Typen",
    doctors: "Ärzte",
    herbalists: "Praktiker",
    clinics: "Kliniken",
    noExperts: "Keine Experten gefunden, die den Filtern entsprechen",
    viewProfile: "Profil ansehen",
    bookAppointment: "Beratung buchen",
    filters: "Ergebnisse filtern",
    location: "Standort",
    rating: "Bewertung",
    verified: "Verifizierter Experte"
  },
  zh: {
    title: "专家名录",
    subtitle: "与经过验证的医学和草药从业者联系。",
    searchPlaceholder: "按专业或姓名搜索...",
    specialists: "专家",
    centers: "中心",
    nearby: "附近",
    allTypes: "所有类型",
    doctors: "医生",
    herbalists: "从业者",
    clinics: "诊所",
    noExperts: "未找到符合筛选条件的专家",
    viewProfile: "查看个人资料",
    bookAppointment: "预约咨询",
    filters: "筛选结果",
    location: "地点",
    rating: "评分",
    verified: "经过验证的专家"
  },
  ar: {
    title: "دليل الخبراء",
    subtitle: "تواصل مع ممارسين طبيين وعشبيين معتمدين.",
    searchPlaceholder: "ابحث حسب التخصص أو الاسم...",
    specialists: "متخصصون",
    centers: "مراكز",
    nearby: "بالقرب مني",
    allTypes: "جميع الأنواع",
    doctors: "أطباء",
    herbalists: "ممارسون",
    clinics: "عيادات",
    noExperts: "لم يتم العثور على خبراء يطابقون المرشحات",
    viewProfile: "عرض الملف الشخصي",
    bookAppointment: "حجز استشارة",
    filters: "تصفية النتائج",
    location: "الموقع",
    rating: "التقييم",
    verified: "خبير معتمد"
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.directoryPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
