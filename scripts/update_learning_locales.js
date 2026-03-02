/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    title: "Learning Intelligence",
    subtitle: "Master health protocols through structured evidence-based paths.",
    recommended: "RECOMENDED PROTOCOLS",
    allPaths: "ALL INTELLIGENCE PATHS",
    noPaths: "No paths matching your criteria.",
    modules: "Modules",
    lessons: "Lessons",
    startPath: "Initialize Path",
    continuePath: "Resume Protocol",
    completePath: "Protocol Mastered",
    download: "Download Protocol",
    claimCert: "Claim Certification",
    curatedBy: "Curated by",
    enrollmentSuccess: "Successfully enrolled in path."
  },
  fr: {
    title: "Intelligence d'Apprentissage",
    subtitle: "Maîtrisez les protocoles de santé via des parcours structurés basés sur des preuves.",
    recommended: "PROTOCOLES RECOMMANDÉS",
    allPaths: "TOUS LES PARCOURS D'INTELLIGENCE",
    noPaths: "Aucun parcours ne correspond à vos critères.",
    modules: "Modules",
    lessons: "Leçons",
    startPath: "Initialiser le Parcours",
    continuePath: "Reprendre le Protocole",
    completePath: "Protocole Maîtrisé",
    download: "Télécharger le Protocole",
    claimCert: "Réclamer la Certification",
    curatedBy: "Curaté par",
    enrollmentSuccess: "Inscription au parcours réussie."
  },
  es: {
    title: "Inteligencia de Aprendizaje",
    subtitle: "Domine protocolos de salud a través de rutas estructuradas basadas en evidencia.",
    recommended: "PROTOCOLOS RECOMENDADOS",
    allPaths: "TODAS LAS RUTAS DE INTELIGENCIA",
    noPaths: "No hay rutas que coincidan con sus criterios.",
    modules: "Módulos",
    lessons: "Lecciones",
    startPath: "Inicializar Ruta",
    continuePath: "Reanudar Protocolo",
    completePath: "Protocolo Dominado",
    download: "Descargar Protocolo",
    claimCert: "Reclamar Certificación",
    curatedBy: "Curado por",
    enrollmentSuccess: "Inscripción en la ruta exitosa."
  },
  de: {
    title: "Lern-Intelligenz",
    subtitle: "Meistern Sie Gesundheitsprotokolle durch strukturierte, evidenzbasierte Pfade.",
    recommended: "EMPFOHLENE PROTOKOLLE",
    allPaths: "ALLE INTELLIGENZ-PFADE",
    noPaths: "Keine Pfade entsprechen Ihren Kriterien.",
    modules: "Module",
    lessons: "Lektionen",
    startPath: "Pfad initialisieren",
    continuePath: "Protokoll fortsetzen",
    completePath: "Protokoll gemeistert",
    download: "Protokoll herunterladen",
    claimCert: "Zertifizierung anfordern",
    curatedBy: "Kuratiert von",
    enrollmentSuccess: "Erfolgreich für den Pfad angemeldet."
  },
  zh: {
    title: "学习智能",
    subtitle: "通过结构化的循证路径掌握健康方案。",
    recommended: "推荐方案",
    allPaths: "所有智能路径",
    noPaths: "没有符合您条件的路径。",
    modules: "模块",
    lessons: "课程",
    startPath: "初始化路径",
    continuePath: "恢复方案",
    completePath: "方案已掌握",
    download: "下载方案",
    claimCert: "领取证书",
    curatedBy: "策展人",
    enrollmentSuccess: "成功加入路径。"
  },
  ar: {
    title: "ذكاء التعلم",
    subtitle: "أتقن بروتوكولات الصحة من خلال مسارات منظمة قائمة على الأدلة.",
    recommended: "البروتوكولات الموصى بها",
    allPaths: "جميع مسارات الذكاء",
    noPaths: "لا توجد مسارات تطابق معاييرك.",
    modules: "الوحدات",
    lessons: "الدروس",
    startPath: "بدء المسار",
    continuePath: "استئناف البروتوكول",
    completePath: "تم إتقان البروتوكول",
    download: "تحميل البروتوكول",
    claimCert: "طلب الشهادة",
    curatedBy: "بإشراف",
    enrollmentSuccess: "تم التسجيل في المسار بنجاح."
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.learningPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
