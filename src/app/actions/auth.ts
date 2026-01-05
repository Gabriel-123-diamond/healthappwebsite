"use server";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  // This code runs ONLY on the server.
  // The environment variable ADMIN_PASSWORD is never sent to the client.
  const correctPassword = process.env.ADMIN_PASSWORD;
  
  if (!correctPassword) {
    console.error("ADMIN_PASSWORD is not set in environment variables.");
    return false;
  }

  return password === correctPassword;
}
