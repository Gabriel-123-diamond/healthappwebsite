/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    intelligence: "Intelligence",
    knowledgeStream: "Knowledge Stream",
    explore: "Explore",
    progress: "Progress",
    syncingIdentity: "Syncing Identity...",
    header: {
      clinicalIdentity: "Intelligence Node",
      settings: "Settings",
      registryVerified: "Registry Verified",
      noPhone: "No phone"
    },
    stats: {
      referralNode: "Referral Node",
      dataVault: "Data Vault",
      evolution: "Evolution",
      points: "Points",
      rank: "Rank",
      initializeExtraction: "Initialize Extraction",
      dataVaultDesc: "Extraction of your network intelligence and encrypted health records.",
      copyCode: "Referral code copied!",
      copyLink: "Referral link copied!",
      initialize: "Initialize",
      share: "Share",
      active: "Active"
    },
    menu: {
      controlSystem: "Control System",
      adminDashboard: "Admin Dashboard",
      expertConsole: "Expert Console",
      upgradeTier: "Upgrade Tier",
      verificationPending: "Verification Pending",
      network: "Network",
      developer: "Developer",
      exportData: "Export Data",
      assistance: "Assistance",
      terminateAccount: "Terminate Account",
      signOut: "Sign Out",
      deleteConfirm: "Are you sure you want to delete your account? This action cannot be undone."
    }
  },
  fr: {
    intelligence: "Intelligence",
    knowledgeStream: "Flux de Connaissances",
    explore: "Explorer",
    progress: "Progression",
    syncingIdentity: "Synchronisation de l'Identité...",
    header: {
      clinicalIdentity: "Identité Clinique",
      settings: "Paramètres",
      registryVerified: "Registre Vérifié",
      noPhone: "Pas de téléphone"
    },
    stats: {
      referralNode: "Nœud de Parrainage",
      dataVault: "Coffre-fort de Données",
      evolution: "Évolution",
      points: "Points",
      rank: "Rang",
      initializeExtraction: "Initialiser l'Extraction",
      dataVaultDesc: "Extraction de votre intelligence réseau et de vos dossiers de santé cryptés.",
      copyCode: "Code de parrainage copié !",
      copyLink: "Lien de parrainage copié !",
      initialize: "Initialiser",
      share: "Partager",
      active: "Actif"
    },
    menu: {
      controlSystem: "Système de Contrôle",
      adminDashboard: "Tableau de Bord Admin",
      expertConsole: "Console Expert",
      upgradeTier: "Améliorer le Niveau",
      verificationPending: "Vérification en Attente",
      network: "Réseau",
      developer: "Développeur",
      exportData: "Exporter les Données",
      assistance: "Assistance",
      terminateAccount: "Supprimer le Compte",
      signOut: "Déconnexion",
      deleteConfirm: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    }
  },
  es: {
    intelligence: "Inteligencia",
    knowledgeStream: "Flujo de Conocimiento",
    explore: "Explorar",
    progress: "Progreso",
    syncingIdentity: "Sincronizando Identidad...",
    header: {
      clinicalIdentity: "Identidad Clínica",
      settings: "Ajustes",
      registryVerified: "Registro Verificado",
      noPhone: "Sin teléfono"
    },
    stats: {
      referralNode: "Nodo de Referencia",
      dataVault: "Bóveda de Datos",
      evolution: "Evolución",
      points: "Puntos",
      rank: "Rango",
      initializeExtraction: "Iniciar Extracción",
      dataVaultDesc: "Extracción de su inteligencia de red y registros de salud cifrados.",
      copyCode: "¡Código de referencia copiado!",
      copyLink: "¡Enlace de referencia copiado!",
      initialize: "Iniciar",
      share: "Compartir",
      active: "Activo"
    },
    menu: {
      controlSystem: "Sistema de Control",
      adminDashboard: "Panel de Admin",
      expertConsole: "Consola de Experto",
      upgradeTier: "Subir de Nivel",
      verificationPending: "Verificación Pendiente",
      network: "Red",
      developer: "Desarrollador",
      exportData: "Exportar Datos",
      assistance: "Asistencia",
      terminateAccount: "Eliminar Cuenta",
      signOut: "Cerrar Sesión",
      deleteConfirm: "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    }
  },
  de: {
    intelligence: "Intelligenz",
    knowledgeStream: "Wissensstrom",
    explore: "Erkunden",
    progress: "Fortschritt",
    syncingIdentity: "Identität wird synchronisiert...",
    header: {
      clinicalIdentity: "Klinische Identität",
      settings: "Einstellungen",
      registryVerified: "Register verifiziert",
      noPhone: "Keine Telefonnummer"
    },
    stats: {
      referralNode: "Empfehlungsknoten",
      dataVault: "Datentresor",
      evolution: "Evolution",
      points: "Punkte",
      rank: "Rang",
      initializeExtraction: "Extraktion initialisieren",
      dataVaultDesc: "Extraktion Ihrer Netzwerkintelligenz und verschlüsselten Gesundheitsakten.",
      copyCode: "Empfehlungscode kopiert!",
      copyLink: "Empfehlungslink kopiert!",
      initialize: "Initialisieren",
      share: "Teilen",
      active: "Aktiv"
    },
    menu: {
      controlSystem: "Kontrollsystem",
      adminDashboard: "Admin-Dashboard",
      expertConsole: "Experten-Konsole",
      upgradeTier: "Stufe upgraden",
      verificationPending: "Verifizierung ausstehend",
      network: "Netzwerk",
      developer: "Entwickler",
      exportData: "Daten exportieren",
      assistance: "Unterstützung",
      terminateAccount: "Konto löschen",
      signOut: "Abmelden",
      deleteConfirm: "Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
    }
  },
  zh: {
    intelligence: "智能",
    knowledgeStream: "知识流",
    explore: "探索",
    progress: "进度",
    syncingIdentity: "正在同步身份...",
    header: {
      clinicalIdentity: "临床身份",
      settings: "设置",
      registryVerified: "注册已验证",
      noPhone: "未提供电话"
    },
    stats: {
      referralNode: "推荐节点",
      dataVault: "数据保险库",
      evolution: "进化",
      points: "积分",
      rank: "排名",
      initializeExtraction: "初始化提取",
      dataVaultDesc: "提取您的网络智能和加密健康记录。",
      copyCode: "推荐码已复制！",
      copyLink: "推荐链接已复制！",
      initialize: "初始化",
      share: "分享",
      active: "活跃"
    },
    menu: {
      controlSystem: "控制系统",
      adminDashboard: "管理员仪表板",
      expertConsole: "专家控制台",
      upgradeTier: "升级等级",
      verificationPending: "验证中",
      network: "网络",
      developer: "开发者",
      exportData: "导出数据",
      assistance: "协助",
      terminateAccount: "注销账户",
      signOut: "登出",
      deleteConfirm: "您确定要删除您的账户吗？此操作无法撤销。"
    }
  },
  ar: {
    intelligence: "الذكاء",
    knowledgeStream: "تدفق المعرفة",
    explore: "استكشاف",
    progress: "التقدم",
    syncingIdentity: "جاري مزامنة الهوية...",
    header: {
      clinicalIdentity: "الهوية السريرية",
      settings: "الإعدادات",
      registryVerified: "سجل معتمد",
      noPhone: "لا يوجد هاتف"
    },
    stats: {
      referralNode: "عقدة الإحالة",
      dataVault: "خزنة البيانات",
      evolution: "التطور",
      points: "نقاط",
      rank: "رتبة",
      initializeExtraction: "بدء الاستخراج",
      dataVaultDesc: "استخراج ذكاء الشبكة الخاص بك وسجلاتك الصحية المشفرة.",
      copyCode: "تم نسخ رمز الإحالة!",
      copyLink: "تم نسخ رابط الإحالة!",
      initialize: "بدء",
      share: "مشاركة",
      active: "نشط"
    },
    menu: {
      controlSystem: "نظام التحكم",
      adminDashboard: "لوحة تحكم المسؤول",
      expertConsole: "وحدة تحكم الخبير",
      upgradeTier: "ترقية المستوى",
      verificationPending: "التحقق قيد الانتظار",
      network: "الشبكة",
      developer: "المطور",
      exportData: "تصدير البيانات",
      assistance: "المساعدة",
      terminateAccount: "إنهاء الحساب",
      signOut: "تسجيل الخروج",
      deleteConfirm: "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء."
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.profile = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
