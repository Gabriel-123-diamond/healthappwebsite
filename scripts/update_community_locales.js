/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    title: "Community Grid",
    subtitle: "Share insights and experiences with the global health network.",
    createPost: "Share with Network",
    topics: "Intelligence Streams",
    noPosts: "No posts in this stream yet.",
    postPlaceholder: "What's on your mind regarding {topic}?",
    postBtn: "Initialize Post",
    report: "Report Content",
    reportSuccess: "Intelligence report submitted.",
    comment: "Comment",
    comments: "Comments",
    like: "Support",
    all: "All Streams"
  },
  fr: {
    title: "Grille Communautaire",
    subtitle: "Partagez des idées et des expériences avec le réseau mondial de santé.",
    createPost: "Partager avec le Réseau",
    topics: "Flux d'Intelligence",
    noPosts: "Aucun message dans ce flux pour le moment.",
    postPlaceholder: "Qu'avez-vous à l'esprit concernant {topic} ?",
    postBtn: "Initialiser le Message",
    report: "Signaler le Contenu",
    reportSuccess: "Rapport d'intelligence soumis.",
    comment: "Commenter",
    comments: "Commentaires",
    like: "Soutenir",
    all: "Tous les flux"
  },
  es: {
    title: "Red Comunitaria",
    subtitle: "Comparta ideas y experiencias con la red de salud global.",
    createPost: "Compartir con la Red",
    topics: "Flujos de Inteligencia",
    noPosts: "Aún no hay publicaciones en este flujo.",
    postPlaceholder: "¿Qué tienes en mente sobre {topic}?",
    postBtn: "Inicializar Publicación",
    report: "Reportar Contenido",
    reportSuccess: "Informe de inteligencia enviado.",
    comment: "Comentar",
    comments: "Comentarios",
    like: "Apoyar",
    all: "Todos los flujos"
  },
  de: {
    title: "Community-Netz",
    subtitle: "Teilen Sie Erkenntnisse und Erfahrungen mit dem globalen Gesundheitsnetzwerk.",
    createPost: "Mit dem Netzwerk teilen",
    topics: "Intelligenz-Streams",
    noPosts: "Noch keine Beiträge in diesem Stream.",
    postPlaceholder: "Was beschäftigt Sie zum Thema {topic}?",
    postBtn: "Beitrag initialisieren",
    report: "Inhalt melden",
    reportSuccess: "Intelligenzbericht eingereicht.",
    comment: "Kommentieren",
    comments: "Kommentare",
    like: "Unterstützen",
    all: "Alle Streams"
  },
  zh: {
    title: "社区网格",
    subtitle: "与全球健康网络分享见解和经验。",
    createPost: "与网络分享",
    topics: "智能流",
    noPosts: "该流中暂无帖子。",
    postPlaceholder: "关于 {topic}，您有什么想法？",
    postBtn: "初始化帖子",
    report: "举报内容",
    reportSuccess: "情报报告已提交。",
    comment: "评论",
    comments: "评论",
    like: "支持",
    all: "所有流"
  },
  ar: {
    title: "شبكة المجتمع",
    subtitle: "شارك الرؤى والتجارب مع شبكة الصحة العالمية.",
    createPost: "مشاركة مع الشبكة",
    topics: "تدفقات الذكاء",
    noPosts: "لا توجد منشورات في هذا التدفق بعد.",
    postPlaceholder: "ما الذي يدور في ذهنك بخصوص {topic}؟",
    postBtn: "بدء المنشور",
    report: "إبلاغ عن محتوى",
    reportSuccess: "تم تقديم تقرير الذكاء.",
    comment: "تعليق",
    comments: "تعليقات",
    like: "دعم",
    all: "جميع التدفقات"
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.communityPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
