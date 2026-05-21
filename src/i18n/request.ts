import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
 
  // Ensure that incoming `locale` is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  const fs = require('fs');
  const path = require('path');
  
  // Try to find the messages directory in both root and web-platform contexts
  let messagesDir = path.resolve(process.cwd(), `messages/${locale}`);
  if (!fs.existsSync(messagesDir)) {
    messagesDir = path.resolve(process.cwd(), `web-platform/messages/${locale}`);
  }
  
  let messages = {};
  if (fs.existsSync(messagesDir)) {
    const files = fs.readdirSync(messagesDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(messagesDir, file);
        const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        messages = { ...messages, ...fileContent };
      }
    }
  } else {
    // Fallback to legacy single file if directory doesn't exist
    try {
      messages = (await import(`../../messages/${locale}.json`)).default;
    } catch (e) {
      console.error(`Failed to load messages for locale ${locale}`, e);
    }
  }
 
  return {
    locale,
    messages
  };
});