/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const localesDir = 'web-platform/messages';
const locales = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

const translations = {
  en: require('./locales_profile/en'),
  fr: require('./locales_profile/fr'),
  es: require('./locales_profile/es'),
  de: require('./locales_profile/de'),
  zh: require('./locales_profile/zh'),
  ar: require('./locales_profile/ar')
};

locales.forEach(locale => {
  const filePath = path.join(localesDir, locale, 'profile.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.profile = translations[locale]; 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${locale}.json`);
  }
});
