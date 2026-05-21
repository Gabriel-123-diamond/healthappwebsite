import crypto from 'crypto';
import { NextRequest } from 'next/server';

const SUPER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_PASSWORD || 'fallback-secret-for-signing';

// Simple in-memory rate limiter for server instances
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export interface AdminSession {
  isValid: boolean;
  isSuper: boolean;
  countryIso?: string;
  stateIso?: string;
}

export const adminAuth = {
  /**
   * Hashes a password using PBKDF2.
   */
  hashPassword: (password: string): string => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  },

  /**
   * Compares a plaintext password with a hashed one.
   */
  comparePassword: (password: string, storedHash: string): boolean => {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  },

  /**
   * Signs a session token for admins.
   */
  signSession: (isSuper: boolean = false, countryIso: string = '', stateIso: string = ''): string => {
    const today = new Date().toISOString().split('T')[0];
    const role = isSuper ? 'super' : 'regular';
    // Format: version:date:role:countryIso:stateIso
    const data = `ikike_admin_v5:${today}:${role}:${countryIso}:${stateIso}`;
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return btoa(`${data}:${signature}`);
  },

  /**
   * Verifies an admin session token from a request.
   */
  verifySession: (req: NextRequest): AdminSession => {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) return { isValid: false, isSuper: false };

    try {
      const decoded = atob(token);
      const parts = decoded.split(':');
      // New format has 7 parts (v5:date:role:countryIso:stateIso:signature_marker:signature)
      if (parts.length < 5) return { isValid: false, isSuper: false };

      const signature = parts[parts.length - 1];
      const dataParts = parts.slice(0, parts.length - 1);
      const data = dataParts.join(':');

      const hmac = crypto.createHmac('sha256', SESSION_SECRET);
      hmac.update(data);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) return { isValid: false, isSuper: false };

      const [version, date, role, countryIso, stateIso] = dataParts;

      // Enforce daily session expiry
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) return { isValid: false, isSuper: false };

      return { 
        isValid: true, 
        isSuper: role === 'super',
        countryIso: countryIso || undefined,
        stateIso: stateIso || undefined
      };
    } catch (e) {
      return { isValid: false, isSuper: false };
    }
  },

  /**
   * Check if provided password is the Super Admin password.
   */
  isSuperAdminPassword: (password: string): boolean => {
    return !!SUPER_ADMIN_PASSWORD && password === SUPER_ADMIN_PASSWORD;
  },

  /**
   * Basic Rate Limiting check
   */
  checkRateLimit: (ip: string): { allowed: boolean; remaining: number } => {
    const limit = 5; // max 5 attempts
    const window = 15 * 60 * 1000; // 15 minutes
    const now = Date.now();
    
    const record = loginAttempts.get(ip);
    
    if (!record) {
      loginAttempts.set(ip, { count: 1, lastAttempt: now });
      return { allowed: true, remaining: limit - 1 };
    }

    if (now - record.lastAttempt > window) {
      loginAttempts.set(ip, { count: 1, lastAttempt: now });
      return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0 };
    }

    record.count += 1;
    record.lastAttempt = now;
    return { allowed: true, remaining: limit - record.count };
  }
};
