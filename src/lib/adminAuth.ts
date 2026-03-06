import crypto from 'crypto';
import { NextRequest } from 'next/server';

const SUPER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.ADMIN_PASSWORD || 'fallback-secret-for-signing';

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
  signSession: (isSuper: boolean = false): string => {
    const today = new Date().toISOString().split('T')[0];
    const data = `ikike_admin_v4:${today}:${isSuper ? 'super' : 'regular'}`;
    const hmac = crypto.createHmac('sha256', SESSION_SECRET);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return btoa(`${data}:${signature}`);
  },

  /**
   * Verifies an admin session token from a request.
   */
  verifySession: (req: NextRequest): { isValid: boolean; isSuper: boolean } => {
    const token = req.cookies.get('admin_session')?.value;
    if (!token) return { isValid: false, isSuper: false };

    try {
      const decoded = atob(token);
      const parts = decoded.split(':');
      if (parts.length !== 5) return { isValid: false, isSuper: false };

      const [version, date, role, hmacSig] = [parts[0], parts[1], parts[2], parts[4]];
      const data = `${version}:${date}:${role}`;

      const hmac = crypto.createHmac('sha256', SESSION_SECRET);
      hmac.update(data);
      const expectedSignature = hmac.digest('hex');

      if (hmacSig !== expectedSignature) return { isValid: false, isSuper: false };

      // Enforce daily session expiry
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) return { isValid: false, isSuper: false };

      return { 
        isValid: true, 
        isSuper: role === 'super' 
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
  }
};
