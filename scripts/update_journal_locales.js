/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: {
    badge: "Personalized Log",
    title: "Clinical Journal",
    subtitle: "Quantify your well-being through secure data logging.",
    history: "History",
    trends: "Trends",
    decrypting: "Decrypting Records",
    noEntries: "No entries yet",
    addEntry: "Add New Entry",
    form: {
      symptoms: "Symptoms",
      severity: "Severity Level",
      notes: "Additional Notes",
      submit: "Log Entry",
      placeholderSymptoms: "e.g. Headache, fatigue...",
      placeholderNotes: "Describe how you feel...",
      success: "Entry logged successfully"
    },
    trendsChart: {
      title: "Health Trajectory",
      subtitle: "Symptom severity over time",
      severity: "Severity"
    }
  },
  fr: {
    badge: "Journal Personnel",
    title: "Journal Clinique",
    subtitle: "Quantifiez votre bien-être grâce à l'enregistrement sécurisé des données.",
    history: "Historique",
    trends: "Tendances",
    decrypting: "Décryptage des Dossiers",
    noEntries: "Aucune entrée pour le moment",
    addEntry: "Ajouter une Nouvelle Entrée",
    form: {
      symptoms: "Symptômes",
      severity: "Niveau de Sévérité",
      notes: "Notes Additionnelles",
      submit: "Enregistrer l'Entrée",
      placeholderSymptoms: "ex: Mal de tête, fatigue...",
      placeholderNotes: "Décrivez comment vous vous sentez...",
      success: "Entrée enregistrée avec succès"
    },
    trendsChart: {
      title: "Trajectoire de Santé",
      subtitle: "Sévérité des symptômes au fil du temps",
      severity: "Sévérité"
    }
  },
  es: {
    badge: "Registro Personalizado",
    title: "Diario Clínico",
    subtitle: "Cuantifique su bienestar a través del registro seguro de datos.",
    history: "Historial",
    trends: "Tendencias",
    decrypting: "Descifrando Registros",
    noEntries: "Aún no hay entradas",
    addEntry: "Agregar Nueva Entrada",
    form: {
      symptoms: "Síntomas",
      severity: "Nivel de Severidad",
      notes: "Notas Adicionales",
      submit: "Registrar Entrada",
      placeholderSymptoms: "ej. Dolor de cabeza, fatiga...",
      placeholderNotes: "Describe cómo te sientes...",
      success: "Entrada registrada con éxito"
    },
    trendsChart: {
      title: "Trayectoria de Salud",
      subtitle: "Severidad de los síntomas a lo largo del tiempo",
      severity: "Severidad"
    }
  },
  de: {
    badge: "Personalisiertes Protokoll",
    title: "Klinisches Tagebuch",
    subtitle: "Quantifizieren Sie Ihr Wohlbefinden durch sichere Datenprotokollierung.",
    history: "Verlauf",
    trends: "Trends",
    decrypting: "Einträge werden entschlüsselt",
    noEntries: "Noch keine Einträge",
    addEntry: "Neuen Eintrag hinzufügen",
    form: {
      symptoms: "Symptome",
      severity: "Schweregrad",
      notes: "Zusätzliche Notizen",
      submit: "Eintrag protokollieren",
      placeholderSymptoms: "z.B. Kopfschmerzen, Müdigkeit...",
      placeholderNotes: "Beschreiben Sie, wie Sie sich fühlen...",
      success: "Eintrag erfolgreich protokolliert"
    },
    trendsChart: {
      title: "Gesundheitsverlauf",
      subtitle: "Symptomschwere im Zeitverlauf",
      severity: "Schweregrad"
    }
  },
  zh: {
    badge: "个性化日志",
    title: "临床日志",
    subtitle: "通过安全的数据记录量化您的健康状况。",
    history: "历史记录",
    trends: "趋势",
    decrypting: "正在解密记录",
    noEntries: "暂无记录",
    addEntry: "添加新记录",
    form: {
      symptoms: "症状",
      severity: "严重程度",
      notes: "备注",
      submit: "记录条目",
      placeholderSymptoms: "例如：头痛、疲劳...",
      placeholderNotes: "描述您的感受...",
      success: "记录成功"
    },
    trendsChart: {
      title: "健康轨迹",
      subtitle: "症状严重程度随时间的变化",
      severity: "严重程度"
    }
  },
  ar: {
    badge: "سجل شخصي",
    title: "اليوميات السريرية",
    subtitle: "قم بقياس عافيتك من خلال تسجيل البيانات الآمن.",
    history: "السجل",
    trends: "الاتجاهات",
    decrypting: "جاري فك تشفير السجلات",
    noEntries: "لا توجد مدخلات بعد",
    addEntry: "إضافة مدخل جديد",
    form: {
      symptoms: "الأعراض",
      severity: "مستوى الشدة",
      notes: "ملاحظات إضافية",
      submit: "تسجيل المدخل",
      placeholderSymptoms: "مثال: صداع، تعب...",
      placeholderNotes: "صف كيف تشعر...",
      success: "تم تسجيل المدخل بنجاح"
    },
    trendsChart: {
      title: "مسار الصحة",
      subtitle: "شدة الأعراض مع مرور الوقت",
      severity: "الشدة"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.journalPage = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
