import { adminDb } from "@/lib/firebaseAdmin";

export type LogAction = 
  | 'ADMIN_LOGIN' 
  | 'ADMIN_CREATE' 
  | 'EXPERT_VERIFY' 
  | 'EXPERT_REJECT' 
  | 'DATABASE_SEED'
  | 'SECURITY_ALERT';

export const logService = {
  /**
   * Logs an admin action to the system_logs collection.
   * This is called server-side from API routes.
   */
  logAction: async (action: LogAction, data: any, isSuper: boolean = false) => {
    try {
      await adminDb.collection('system_logs').add({
        action,
        data,
        isSuper,
        timestamp: new Date().toISOString(),
        severity: action === 'SECURITY_ALERT' ? 'high' : 'info'
      });
    } catch (error) {
      console.error("[LogService Error]", error);
    }
  }
};
