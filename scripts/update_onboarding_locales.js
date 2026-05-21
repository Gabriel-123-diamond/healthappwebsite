/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: require('./locales_onboarding/en'),
  fr: require('./locales_onboarding/fr'),
  es: require('./locales_onboarding/es'),
  de: require('./locales_onboarding/de'),
  zh: require('./locales_onboarding/zh'),
  ar: require('./locales_onboarding/ar')
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, locale, 'auth.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.onboarding = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
