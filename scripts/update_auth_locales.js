/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    welcomeBack: "Welcome back",
    signInSubtitle: "Access your personalized health intelligence node.",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    signInBtn: "Initialize Session",
    noAccount: "New to the grid?",
    signUpLink: "Create intelligence node",
    signUpTitle: "Initialize Identity",
    signUpSubtitle: "Join the global network of health intelligence.",
    firstNameLabel: "First Name",
    lastNameLabel: "Last Name",
    confirmPasswordLabel: "Confirm Password",
    signUpBtn: "Create Identity",
    haveAccount: "Already in the registry?",
    signInLink: "Access Session",
    forgotPassword: "Reset encryption key?",
    emailPlaceholder: "name@domain.com",
    passwordPlaceholder: "••••••••"
  },
  fr: {
    welcomeBack: "Bon retour",
    signInSubtitle: "Accédez à votre nœud d'intelligence santé personnalisé.",
    emailLabel: "Adresse E-mail",
    passwordLabel: "Mot de passe",
    signInBtn: "Initialiser la session",
    noAccount: "Nouveau sur la grille ?",
    signUpLink: "Créer une identité clinique",
    signUpTitle: "Initialiser l'Identité",
    signUpSubtitle: "Rejoignez le réseau mondial d'intelligence santé.",
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    confirmPasswordLabel: "Confirmer le mot de passe",
    signUpBtn: "Créer l'identité",
    haveAccount: "Déjà dans le registre ?",
    signInLink: "Accéder à la session",
    forgotPassword: "Réinitialiser la clé de cryptage ?",
    emailPlaceholder: "nom@domaine.com",
    passwordPlaceholder: "••••••••"
  },
  es: {
    welcomeBack: "Bienvenido de nuevo",
    signInSubtitle: "Acceda a su nodo de inteligencia de salud personalizado.",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    signInBtn: "Iniciar sesión",
    noAccount: "¿Nuevo en la red?",
    signUpLink: "Crear identidad clínica",
    signUpTitle: "Inicializar Identidad",
    signUpSubtitle: "Únase a la red global de inteligencia de salud.",
    firstNameLabel: "Nombre",
    lastNameLabel: "Apellido",
    confirmPasswordLabel: "Confirmar contraseña",
    signUpBtn: "Crear Identidad",
    haveAccount: "¿Ya está en el registro?",
    signInLink: "Acceder a la sesión",
    forgotPassword: "¿Restablecer clave de cifrado?",
    emailPlaceholder: "nombre@dominio.com",
    passwordPlaceholder: "••••••••"
  },
  de: {
    welcomeBack: "Willkommen zurück",
    signInSubtitle: "Greifen Sie auf Ihren personalisierten Gesundheitsintelligenzknoten zu.",
    emailLabel: "E-Mail-Adresse",
    passwordLabel: "Passwort",
    signInBtn: "Sitzung initialisieren",
    noAccount: "Neu im Netz?",
    signUpLink: "Klinische Identität erstellen",
    signUpTitle: "Identität initialisieren",
    signUpSubtitle: "Treten Sie dem globalen Netzwerk für Gesundheitsintelligenz bei.",
    firstNameLabel: "Vorname",
    lastNameLabel: "Nachname",
    confirmPasswordLabel: "Passwort bestätigen",
    signUpBtn: "Identität erstellen",
    haveAccount: "Bereits im Register?",
    signInLink: "Sitzung aufrufen",
    forgotPassword: "Verschlüsselungsschlüssel zurücksetzen?",
    emailPlaceholder: "name@domain.de",
    passwordPlaceholder: "••••••••"
  },
  zh: {
    welcomeBack: "欢迎回来",
    signInSubtitle: "访问您的个性化健康智能节点。",
    emailLabel: "电子邮件地址",
    passwordLabel: "密码",
    signInBtn: "初始化会话",
    noAccount: "新加入网络？",
    signUpLink: "创建临床身份",
    signUpTitle: "初始化身份",
    signUpSubtitle: "加入全球健康智能网络。",
    firstNameLabel: "名字",
    lastNameLabel: "姓氏",
    confirmPasswordLabel: "确认密码",
    signUpBtn: "创建身份",
    haveAccount: "已在登记册中？",
    signInLink: "访问会话",
    forgotPassword: "重置加密密钥？",
    emailPlaceholder: "name@domain.com",
    passwordPlaceholder: "••••••••"
  },
  ar: {
    welcomeBack: "مرحباً بعودتك",
    signInSubtitle: "الوصول إلى عقدة ذكاء الصحة الشخصية الخاصة بك.",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    signInBtn: "بدء الجلسة",
    noAccount: "جديد في الشبكة؟",
    signUpLink: "إنشاء هوية سريرية",
    signUpTitle: "تهيئة الهوية",
    signUpSubtitle: "انضم إلى الشبكة العالمية لذكاء الصحة.",
    firstNameLabel: "الاسم الأول",
    lastNameLabel: "اسم العائلة",
    confirmPasswordLabel: "تأكيد كلمة المرور",
    signUpBtn: "إنشاء الهوية",
    haveAccount: "مسجل بالفعل؟",
    signInLink: "الدخول للجلسة",
    forgotPassword: "إعادة تعيين مفتاح التشفير؟",
    emailPlaceholder: "name@domain.com",
    passwordPlaceholder: "••••••••"
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.auth = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
