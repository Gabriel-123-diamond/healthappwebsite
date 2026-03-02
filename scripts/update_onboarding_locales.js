/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    steps: {
      referral: "Referral",
      identity: "Identity",
      security: "Security",
      interests: "Interests",
      role: "Platform Role",
      kyc: "Verification",
      tier: "Expert Tier"
    },
    setupTitle: "Setup your hub.",
    setupSubtitle: "Personalize your intelligence node for the best health insights.",
    back: "Back",
    continue: "Continue",
    complete: "Initialize Node",
    attentionRequired: "Attention Required",
    referral: {
      title: "Network Invitation.",
      subtitle: "Enter a peer invitation code to initialize with bonus network credits.",
      placeholder: "INVITE-CODE-XXXX",
      skip: "Skip for now",
      validating: "Validating code...",
      valid: "Invitation code accepted.",
      invalid: "Invalid code. Please verify and try again."
    },
    identity: {
      title: "Initialize Identity.",
      subtitle: "Your intelligence node is the foundation of your secure health records.",
      firstName: "First Name",
      lastName: "Last Name",
      username: "Grid Username",
      phone: "Secure Phone",
      dob: "Date of Birth",
      ageRange: "Age Range",
      placeholderUsername: "unique_id",
      placeholderPhone: "800 000 0000"
    },
    security: {
      title: "Verify Identity.",
      subtitle: "Complete security checks to enable encrypted platform access.",
      emailLabel: "Primary Email",
      phoneLabel: "Secure Phone",
      checkStatus: "Check Status",
      verifyProtocol: "Verify Protocol",
      verifiedMember: "Verified Member",
      sent: "Sent",
      editInfo: "Edit Info"
    },
    interests: {
      title: "Knowledge Stream.",
      subtitle: "Select topics to customize your intelligence feed and learning paths.",
      search: "Search health topics..."
    },
    role: {
      title: "Platform Role.",
      subtitle: "Select your identity type within the global health network.",
      user: "Health Seeker",
      userDesc: "Access intelligence and verified experts.",
      doctor: "Medical Doctor",
      doctorDesc: "Provide verified clinical expertise.",
      herbal: "Herbalist",
      herbalDesc: "Offer validated traditional wisdom.",
      hospital: "Health Center",
      hospitalDesc: "Register a clinical institution."
    }
  },
  fr: {
    steps: {
      referral: "Parrainage",
      identity: "Identité",
      security: "Sécurité",
      interests: "Intérêts",
      role: "Rôle Plateforme",
      kyc: "Vérification",
      tier: "Niveau Expert"
    },
    setupTitle: "Configurez votre hub.",
    setupSubtitle: "Personnalisez votre nœud d'intelligence pour les meilleures informations de santé.",
    back: "Retour",
    continue: "Continuer",
    complete: "Initialiser le Nœud",
    attentionRequired: "Attention Requise",
    referral: {
      title: "Invitation Réseau.",
      subtitle: "Entrez un code d'invitation pour initialiser avec des crédits réseau bonus.",
      placeholder: "CODE-INVITE-XXXX",
      skip: "Passer pour l'instant",
      validating: "Validation du code...",
      valid: "Code d'invitation accepté.",
      invalid: "Code invalide. Veuillez vérifier et réessayer."
    },
    identity: {
      title: "Initialiser l'Identité.",
      subtitle: "Votre identité clinique est le fondement de vos dossiers de santé sécurisés.",
      firstName: "Prénom",
      lastName: "Nom",
      username: "Nom d'utilisateur",
      phone: "Téléphone sécurisé",
      dob: "Date de naissance",
      ageRange: "Tranche d'âge",
      placeholderUsername: "identifiant_unique",
      placeholderPhone: "06 00 00 00 00"
    },
    security: {
      title: "Vérifier l'Identité.",
      subtitle: "Effectuez les contrôles de sécurité pour activer l'accès crypté à la plateforme.",
      emailLabel: "E-mail principal",
      phoneLabel: "Téléphone sécurisé",
      checkStatus: "Vérifier le statut",
      verifyProtocol: "Vérifier le protocole",
      verifiedMember: "Membre vérifié",
      sent: "Envoyé",
      editInfo: "Modifier les infos"
    },
    interests: {
      title: "Flux de Connaissances.",
      subtitle: "Sélectionnez des sujets pour personnaliser votre flux d'intelligence.",
      search: "Rechercher des sujets de santé..."
    },
    role: {
      title: "Rôle Plateforme.",
      subtitle: "Sélectionnez votre type d'identité au sein du réseau mondial de santé.",
      user: "Chercheur de santé",
      userDesc: "Accédez à l'intelligence et aux experts vérifiés.",
      doctor: "Médecin",
      doctorDesc: "Fournir une expertise clinique vérifiée.",
      herbal: "Herboriste",
      herbalDesc: "Offrir une sagesse traditionnelle validée.",
      hospital: "Centre de santé",
      hospitalDesc: "Enregistrer une institution clinique."
    }
  },
  es: {
    steps: {
      referral: "Referencia",
      identity: "Identidad",
      security: "Seguridad",
      interests: "Intereses",
      role: "Rol de Plataforma",
      kyc: "Verificación",
      tier: "Nivel de Experto"
    },
    setupTitle: "Configure su hub.",
    setupSubtitle: "Personalice su nodo de inteligencia para obtener los mejores conocimientos de salud.",
    back: "Atrás",
    continue: "Continuar",
    complete: "Inicializar Nodo",
    attentionRequired: "Atención Requerida",
    referral: {
      title: "Invitación de Red.",
      subtitle: "Ingrese un código de invitación para inicializar con créditos de red de bonificación.",
      placeholder: "CÓDIGO-INVITACIÓN-XXXX",
      skip: "Omitir por ahora",
      validating: "Validando código...",
      valid: "Código de invitación aceptado.",
      invalid: "Código inválido. Por favor verifique e intente de nuevo."
    },
    identity: {
      title: "Inicializar Identidad.",
      subtitle: "Su identidad clínica es la base de sus registros de salud seguros.",
      firstName: "Nombre",
      lastName: "Apellido",
      username: "Usuario de Red",
      phone: "Teléfono Seguro",
      dob: "Fecha de Nacimiento",
      ageRange: "Rango de Edad",
      placeholderUsername: "id_unico",
      placeholderPhone: "555 000 0000"
    },
    security: {
      title: "Verificar Identidad.",
      subtitle: "Complete los controles de seguridad para habilitar el acceso cifrado a la plataforma.",
      emailLabel: "Correo Principal",
      phoneLabel: "Teléfono Seguro",
      checkStatus: "Verificar Estado",
      verifyProtocol: "Verificar Protocolo",
      verifiedMember: "Miembro Verificado",
      sent: "Enviado",
      editInfo: "Editar Información"
    },
    interests: {
      title: "Flujo de Conocimiento.",
      subtitle: "Seleccione temas para personalizar su feed de inteligencia.",
      search: "Buscar temas de salud..."
    },
    role: {
      title: "Rol de Plataforma.",
      subtitle: "Seleccione su tipo de identidad dentro de la red de salud global.",
      user: "Buscador de Salud",
      userDesc: "Acceda a inteligencia y expertos verificados.",
      doctor: "Médico",
      doctorDesc: "Brinde experiencia clínica verificada.",
      herbal: "Herborista",
      herbalDesc: "Ofrezca sabiduría tradicional validada.",
      hospital: "Centro de Salud",
      hospitalDesc: "Registre una institución clínica."
    }
  },
  de: {
    steps: {
      referral: "Empfehlung",
      identity: "Identität",
      security: "Sicherheit",
      interests: "Interessen",
      role: "Plattform-Rolle",
      kyc: "Verifizierung",
      tier: "Experten-Stufe"
    },
    setupTitle: "Richten Sie Ihren Hub ein.",
    setupSubtitle: "Personalisieren Sie Ihren Intelligenzknoten für die besten Gesundheitseinblicke.",
    back: "Zurück",
    continue: "Weiter",
    complete: "Knoten initialisieren",
    attentionRequired: "Achtung erforderlich",
    referral: {
      title: "Netzwerkeinladung.",
      subtitle: "Geben Sie einen Einladungscode ein, um mit Bonus-Netzwerk-Credits zu starten.",
      placeholder: "EINLADUNGSCODE-XXXX",
      skip: "Vorerst überspringen",
      validating: "Code wird validiert...",
      valid: "Einladungscode akzeptiert.",
      invalid: "Ungültiger Code. Bitte überprüfen und erneut versuchen."
    },
    identity: {
      title: "Identität initialisieren.",
      subtitle: "Ihre klinische Identität ist die Grundlage für Ihre sicheren Gesundheitsakten.",
      firstName: "Vorname",
      lastName: "Nachname",
      username: "Netzwerk-Benutzername",
      phone: "Sicheres Telefon",
      dob: "Geburtsdatum",
      ageRange: "Altersgruppe",
      placeholderUsername: "eindeutige_id",
      placeholderPhone: "0151 0000000"
    },
    security: {
      title: "Identität verifizieren.",
      subtitle: "Führen Sie die Sicherheitsprüfungen durch, um den verschlüsselten Plattformzugriff zu ermöglichen.",
      emailLabel: "Primäre E-Mail",
      phoneLabel: "Sicheres Telefon",
      checkStatus: "Status prüfen",
      verifyProtocol: "Protokoll verifizieren",
      verifiedMember: "Verifiziertes Mitglied",
      sent: "Gesendet",
      editInfo: "Info bearbeiten"
    },
    interests: {
      title: "Wissensstrom.",
      subtitle: "Wählen Sie Themen aus, um Ihren Intelligenz-Feed anzupassen.",
      search: "Gesundheitsthemen suchen..."
    },
    role: {
      title: "Plattform-Rolle.",
      subtitle: "Wählen Sie Ihren Identitätstyp innerhalb des globalen Gesundheitsnetzwerks aus.",
      user: "Gesundheitssuchender",
      userDesc: "Zugriff auf Intelligenz und verifizierte Experten.",
      doctor: "Arzt",
      doctorDesc: "Bieten Sie verifizierte klinische Expertise an.",
      herbal: "Heilpraktiker",
      herbalDesc: "Bieten Sie validiertes traditionelles Wissen an.",
      hospital: "Gesundheitszentrum",
      hospitalDesc: "Registrieren Sie eine klinische Institution."
    }
  },
  zh: {
    steps: {
      referral: "推荐",
      identity: "身份",
      security: "安全",
      interests: "兴趣",
      role: "平台角色",
      kyc: "身份验证",
      tier: "专家等级"
    },
    setupTitle: "设置您的中心。",
    setupSubtitle: "个性化您的智能节点以获得最佳健康见解。",
    back: "上一步",
    continue: "继续",
    complete: "初始化节点",
    attentionRequired: "需要注意",
    referral: {
      title: "网络邀请。",
      subtitle: "输入同行邀请码以获取红利网络积分初始化。",
      placeholder: "邀请码-XXXX",
      skip: "稍后设置",
      validating: "正在验证邀请码...",
      valid: "邀请码已接受。",
      invalid: "验证码无效。请检查后重试。"
    },
    identity: {
      title: "初始化身份。",
      subtitle: "您的临床身份是安全健康记录的基础。",
      firstName: "名字",
      lastName: "姓氏",
      username: "网格用户名",
      phone: "安全电话",
      dob: "出生日期",
      ageRange: "年龄范围",
      placeholderUsername: "唯一标识",
      placeholderPhone: "138 0000 0000"
    },
    security: {
      title: "验证身份。",
      subtitle: "完成安全检查以启用加密平台访问。",
      emailLabel: "主要电子邮件",
      phoneLabel: "安全电话",
      checkStatus: "检查状态",
      verifyProtocol: "验证协议",
      verifiedMember: "已验证会员",
      sent: "已发送",
      editInfo: "编辑信息"
    },
    interests: {
      title: "知识流。",
      subtitle: "选择主题以自定义您的智能 Feed。",
      search: "搜索健康主题..."
    },
    role: {
      title: "平台角色。",
      subtitle: "选择您在全球健康网络中的身份类型。",
      user: "健康寻求者",
      userDesc: "获取智能信息和经过验证的专家服务。",
      doctor: "医生",
      doctorDesc: "提供经过验证的临床专业知识。",
      herbal: "草药从业者",
      herbalDesc: "提供经过验证的传统智慧。",
      hospital: "健康中心",
      hospitalDesc: "注册临床机构。"
    }
  },
  ar: {
    steps: {
      referral: "الإحالة",
      identity: "الهوية",
      security: "الأمن",
      interests: "الاهتمامات",
      role: "دور المنصة",
      kyc: "التحقق",
      tier: "فئة الخبير"
    },
    setupTitle: "قم بإعداد مركزك.",
    setupSubtitle: "قم بتخصيص عقدة الذكاء الخاصة بك للحصول على أفضل الرؤى الصحية.",
    back: "رجوع",
    continue: "استمرار",
    complete: "تهيئة العقدة",
    attentionRequired: "تنبيه مطلوب",
    referral: {
      title: "دعوة الشبكة.",
      subtitle: "أدخل رمز دعوة الزملاء للبدء برصيد شبكة إضافي.",
      placeholder: "رمز-الدعوة-XXXX",
      skip: "تخطي الآن",
      validating: "جاري التحقق من الرمز...",
      valid: "تم قبول رمز الدعوة.",
      invalid: "الرمز غير صالح. يرجى التحقق والمحاولة مرة أخرى."
    },
    identity: {
      title: "تهيئة الهوية.",
      subtitle: "هويتك السريرية هي أساس سجلاتك الصحية الآمنة.",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      username: "اسم مستخدم الشبكة",
      phone: "هاتف آمن",
      dob: "تاريخ الميلاد",
      ageRange: "الفئة العمرية",
      placeholderUsername: "معرف_فريد",
      placeholderPhone: "050 000 0000"
    },
    security: {
      title: "التحقق من الهوية.",
      subtitle: "أكمل فحوصات الأمان لتمكين الوصول المشفر إلى المنصة.",
      emailLabel: "البريد الإلكتروني الأساسي",
      phoneLabel: "الهاتف الآمن",
      checkStatus: "التحقق من الحالة",
      verifyProtocol: "تحقق من البروتوكول",
      verifiedMember: "عضو موثق",
      sent: "تم الإرسال",
      editInfo: "تعديل المعلومات"
    },
    interests: {
      title: "تدفق المعرفة.",
      subtitle: "اختر المواضيع لتخصيص خلاصة الذكاء الخاصة بك.",
      search: "بحث عن مواضيع صحية..."
    },
    role: {
      title: "دور المنصة.",
      subtitle: "اختر نوع هويتك ضمن شبكة الصحة العالمية.",
      user: "باحث عن الصحة",
      userDesc: "الوصول إلى الذكاء والخبراء الموثقين.",
      doctor: "طبيب بشري",
      doctorDesc: "تقديم خبرة سريرية موثقة.",
      herbal: "ممارس أعشاب",
      herbalDesc: "تقديم حكمة تقليدية موثقة.",
      hospital: "مركز صحي",
      hospitalDesc: "تسجيل مؤسسة سريرية."
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.onboarding = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
