const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const enDir = path.join(messagesDir, 'en');
const locales = ['ar', 'de', 'es', 'fr', 'zh'];

if (!fs.existsSync(enDir)) {
  console.error("en directory not found!");
  process.exit(1);
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      if (target[key] === undefined) {
        target[key] = source[key];
      }
    }
  }
}

const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));

locales.forEach(locale => {
  const localeDir = path.join(messagesDir, locale);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }

  enFiles.forEach(file => {
    const enFilePath = path.join(enDir, file);
    const localeFilePath = path.join(localeDir, file);
    
    const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
    let localeData = {};
    
    if (fs.existsSync(localeFilePath)) {
      localeData = JSON.parse(fs.readFileSync(localeFilePath, 'utf8'));
    }
    
    deepMerge(localeData, enData);
    fs.writeFileSync(localeFilePath, JSON.stringify(localeData, null, 2));
  });
  
  console.log(`Synced missing keys to ${locale} directory`);
});
