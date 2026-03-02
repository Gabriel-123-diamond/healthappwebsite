/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    initTitle: "Initialize Intelligence",
    initSubtitle: "Enter a health topic above to begin clinical synthesis.",
    loadingTitle: "Ikiké is Synthesizing...",
    loadingSubtitle: "Scanning archives for \"{query}\"",
    failedTitle: "Search Failed",
    failedRetry: "Try Again",
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    goToPage: "Go to page",
    noResults: "No Results Found",
    noResultsDesc: "Try adjusting your search query or filters.",
    clinicalSynthesis: "Clinical Synthesis",
    expertsFound: "Verified Experts Found",
    articlesFound: "Clinical Sources"
  },
  fr: {
    initTitle: "Initialiser l'Intelligence",
    initSubtitle: "Entrez un sujet de santé ci-dessus pour commencer la synthèse clinique.",
    loadingTitle: "Ikiké synthétise...",
    loadingSubtitle: "Analyse des archives pour \"{query}\"",
    failedTitle: "Échec de la recherche",
    failedRetry: "Réessayer",
    showing: "Affichage de",
    to: "à",
    of: "sur",
    results: "résultats",
    goToPage: "Aller à la page",
    noResults: "Aucun résultat trouvé",
    noResultsDesc: "Essayez d'ajuster votre requête ou vos filtres.",
    clinicalSynthesis: "Synthèse Clinique",
    expertsFound: "Experts vérifiés trouvés",
    articlesFound: "Sources cliniques"
  },
  es: {
    initTitle: "Inicializar Inteligencia",
    initSubtitle: "Ingrese un tema de salud arriba para comenzar la síntesis clínica.",
    loadingTitle: "Ikiké está sintetizando...",
    loadingSubtitle: "Escaneando archivos para \"{query}\"",
    failedTitle: "Búsqueda fallida",
    failedRetry: "Intentar de nuevo",
    showing: "Mostrando",
    to: "a",
    of: "de",
    results: "resultados",
    goToPage: "Ir a la página",
    noResults: "No se encontraron resultados",
    noResultsDesc: "Intente ajustar su consulta o filtros.",
    clinicalSynthesis: "Síntesis Clínica",
    expertsFound: "Expertos verificados encontrados",
    articlesFound: "Fuentes clínicas"
  },
  de: {
    initTitle: "Intelligenz initialisieren",
    initSubtitle: "Geben Sie oben ein Gesundheitsthema ein, um die klinische Synthese zu starten.",
    loadingTitle: "Ikiké synthetisiert...",
    loadingSubtitle: "Archive werden nach \"{query}\" durchsucht",
    failedTitle: "Suche fehlgeschlagen",
    failedRetry: "Erneut versuchen",
    showing: "Anzeige von",
    to: "bis",
    of: "von",
    results: "Ergebnissen",
    goToPage: "Gehe zu Seite",
    noResults: "Keine Ergebnisse gefunden",
    noResultsDesc: "Versuchen Sie, Ihre Suchanfrage oder Filter anzupassen.",
    clinicalSynthesis: "Klinische Synthese",
    expertsFound: "Verifizierte Experten gefunden",
    articlesFound: "Klinische Quellen"
  },
  zh: {
    initTitle: "初始化智能",
    initSubtitle: "在上方输入健康主题以开始临床综合。",
    loadingTitle: "Ikiké 正在合成...",
    loadingSubtitle: "正在扫描关于“{query}”的档案",
    failedTitle: "搜索失败",
    failedRetry: "重试",
    showing: "显示第",
    to: "至",
    of: "项，共",
    results: "项结果",
    goToPage: "跳至页码",
    noResults: "未找到结果",
    noResultsDesc: "请尝试调整您的搜索查询或筛选条件。",
    clinicalSynthesis: "临床综合",
    expertsFound: "找到经过验证的专家",
    articlesFound: "临床来源"
  },
  ar: {
    initTitle: "تهيئة الذكاء",
    initSubtitle: "أدخل موضوعًا صحيًا أعلاه لبدء التوليف السريري.",
    loadingTitle: "Ikiké يقوم بالتوليف...",
    loadingSubtitle: "جاري مسح الأرشيف بحثًا عن \"{query}\"",
    failedTitle: "فشل البحث",
    failedRetry: "إعادة المحاولة",
    showing: "عرض من",
    to: "إلى",
    of: "من أصل",
    results: "نتائج",
    goToPage: "الذهاب إلى صفحة",
    noResults: "لم يتم العثور على نتائج",
    noResultsDesc: "حاول تعديل استعلام البحث أو الفلاتر.",
    clinicalSynthesis: "التوليف السريري",
    expertsFound: "تم العثور على خبراء موثقين",
    articlesFound: "المصادر السريرية"
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.searchPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
