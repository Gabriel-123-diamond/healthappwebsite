/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    title: "Intelligence Node",
    subtitle: "Expand the network grid. Earn {points} credits for every verified peer acquisition.",
    networkAuthority: "Network Authority",
    rank: "RANK",
    level: "Level",
    viewTiers: "View Tiers",
    ptsToEvolve: "{pts} PTS TO EVOLVE",
    currentMilestone: "Current Milestone",
    nextEvolution: "Next Evolution",
    networkTracker: "Network Tracker",
    trackerSubtitle: "Real-time Acquisition History",
    selectionResult: "Selection Result",
    displayingFiltered: "Displaying Filtered Data",
    rewardsInSelection: "Rewards in selection",
    authorityTiers: "Authority Tiers",
    evolutionPath: "Network Evolution Path",
    active: "Active",
    tiers: [
      { name: "Starting Node", desc: "Your intelligence node has been initialized." },
      { name: "Network Peer", desc: "Actively contributing to network expansion." },
      { name: "Intelligence Hub", desc: "A central point for health knowledge distribution." },
      { name: "Protocol Guardian", desc: "Ensuring high-integrity clinical connections." },
      { name: "Clinical Architect", desc: "Master-level authority in the health network." }
    ]
  },
  fr: {
    title: "Nœud d'Intelligence",
    subtitle: "Développez la grille du réseau. Gagnez {points} crédits pour chaque acquisition de pair vérifiée.",
    networkAuthority: "Autorité du Réseau",
    rank: "RANG",
    level: "Niveau",
    viewTiers: "Voir les Niveaux",
    ptsToEvolve: "{pts} PTS POUR ÉVOLUER",
    currentMilestone: "Jalon Actuel",
    nextEvolution: "Prochaine Évolution",
    networkTracker: "Suivi du Réseau",
    trackerSubtitle: "Historique d'Acquisition en Temps Réel",
    selectionResult: "Résultat de la Sélection",
    displayingFiltered: "Affichage des Données Filtrées",
    rewardsInSelection: "Récompenses dans la sélection",
    authorityTiers: "Niveaux d'Autorité",
    evolutionPath: "Chemin d'Évolution du Réseau",
    active: "Actif",
    tiers: [
      { name: "Nœud de Départ", desc: "Votre identité clinique a été initialisée." },
      { name: "Pair du Réseau", desc: "Contribue activement à l'expansion du réseau." },
      { name: "Hub d'Intelligence", desc: "Un point central pour la distribution des connaissances en santé." },
      { name: "Gardien du Protocole", desc: "Assurer des connexions cliniques de haute intégrité." },
      { name: "Architecte Clinique", desc: "Autorité de niveau maître dans le réseau de santé." }
    ]
  },
  es: {
    title: "Nodo de Inteligencia",
    subtitle: "Expanda la red. Gane {points} créditos por cada adquisición de pares verificada.",
    networkAuthority: "Autoridad de Red",
    rank: "RANGO",
    level: "Nivel",
    viewTiers: "Ver Niveles",
    ptsToEvolve: "{pts} PTS PARA EVOLUCIONAR",
    currentMilestone: "Hito Actual",
    nextEvolution: "Próxima Evolución",
    networkTracker: "Rastreador de Red",
    trackerSubtitle: "Historial de Adquisición en Tiempo Real",
    selectionResult: "Resultado de Selección",
    displayingFiltered: "Mostrando Datos Filtrados",
    rewardsInSelection: "Recompensas en selección",
    authorityTiers: "Niveles de Autoridad",
    evolutionPath: "Ruta de Evolución de la Red",
    active: "Activo",
    tiers: [
      { name: "Nodo Inicial", desc: "Su identidad clínica ha sido inicializada." },
      { name: "Par de Red", desc: "Contribuyendo activamente a la expansión de la red." },
      { name: "Hub de Inteligencia", desc: "Un punto central para la distribución de conocimientos de salud." },
      { name: "Guardián del Protocolo", desc: "Garantizando conexiones clínicas de alta integridad." },
      { name: "Arquitecto Clínico", desc: "Autoridad de nivel maestro en la red de salud." }
    ]
  },
  de: {
    title: "Intelligenzknoten",
    subtitle: "Erweitern Sie das Netzwerk. Verdienen Sie {points} Credits für jede verifizierte Partner-Akquise.",
    networkAuthority: "Netzwerkautorität",
    rank: "RANG",
    level: "Stufe",
    viewTiers: "Stufen anzeigen",
    ptsToEvolve: "{pts} PKT BIS ZUR ENTWICKLUNG",
    currentMilestone: "Aktueller Meilenstein",
    nextEvolution: "Nächste Entwicklung",
    networkTracker: "Netzwerk-Tracker",
    trackerSubtitle: "Echtzeit-Akquise-Verlauf",
    selectionResult: "Auswahlergebnis",
    displayingFiltered: "Gefilterte Daten werden angezeigt",
    rewardsInSelection: "Belohnungen in der Auswahl",
    authorityTiers: "Autoritätsstufen",
    evolutionPath: "Netzwerk-Entwicklungspfad",
    active: "Aktiv",
    tiers: [
      { name: "Startknoten", desc: "Ihre klinische Identität wurde initialisiert." },
      { name: "Netzwerk-Partner", desc: "Trägt aktiv zum Netzwerkausbau bei." },
      { name: "Intelligenz-Hub", desc: "Ein zentraler Punkt für die Verbreitung von Gesundheitswissen." },
      { name: "Protokoll-Wächter", desc: "Gewährleistung hochintegritärer klinischer Verbindungen." },
      { name: "Klinischer Architekt", desc: "Autorität auf Meisterniveau im Gesundheitsnetzwerk." }
    ]
  },
  zh: {
    title: "智能节点",
    subtitle: "扩展网络网格。每获得一次经过验证的同行邀请，即可赚取 {points} 积分。",
    networkAuthority: "网络权威",
    rank: "等级",
    level: "级别",
    viewTiers: "查看等级",
    ptsToEvolve: "还需 {pts} 积分进化",
    currentMilestone: "当前里程碑",
    nextEvolution: "下一次进化",
    networkTracker: "网络追踪器",
    trackerSubtitle: "实时获取历史记录",
    selectionResult: "筛选结果",
    displayingFiltered: "显示筛选后的数据",
    rewardsInSelection: "筛选中的奖励",
    authorityTiers: "权威等级",
    evolutionPath: "网络进化路径",
    active: "活跃",
    tiers: [
      { name: "初始节点", desc: "您的临床身份已初始化。" },
      { name: "网络同行", desc: "积极为网络扩展做出贡献。" },
      { name: "智能中心", desc: "健康知识传播的中心点。" },
      { name: "协议守护者", desc: "确保高完整性的临床连接。" },
      { name: "临床架构师", desc: "健康网络中的大师级权威。" }
    ]
  },
  ar: {
    title: "عقدة الذكاء",
    subtitle: "وسع شبكة الاتصال. اربح {points} نقطة مقابل كل انضمام زميل تم التحقق منه.",
    networkAuthority: "سلطة الشبكة",
    rank: "الرتبة",
    level: "المستوى",
    viewTiers: "عرض المستويات",
    ptsToEvolve: "متبقي {pts} نقطة للتطور",
    currentMilestone: "المرحلة الحالية",
    nextEvolution: "التطور القادم",
    networkTracker: "متتبع الشبكة",
    trackerSubtitle: "سجل الانضمام في الوقت الفعلي",
    selectionResult: "نتيجة التصفية",
    displayingFiltered: "عرض البيانات المصفاة",
    rewardsInSelection: "المكافآت في التصفية",
    authorityTiers: "مستويات السلطة",
    evolutionPath: "مسار تطور الشبكة",
    active: "نشط",
    tiers: [
      { name: "عقدة البداية", desc: "تمت تهيئة هويتك السريرية." },
      { name: "زميل الشبكة", desc: "يساهم بنشاط في توسيع الشبكة." },
      { name: "مركز الذكاء", desc: "نقطة مركزية لتوزيع المعرفة الصحية." },
      { name: "حارس البروتوكول", desc: "ضمان اتصالات سريرية عالية النزاهة." },
      { name: "المهندس السريري", desc: "سلطة بمستوى خبير في الشبكة الصحية." }
    ]
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.referralsPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
