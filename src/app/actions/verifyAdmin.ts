"use server";

export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD;
  
  if (!correctPassword) {
    console.error("ADMIN_PASSWORD is not set in environment variables");
    return { success: false, message: "Server configuration error" };
  }

  if (password === correctPassword) {
    return { success: true };
  } else {
    return { success: false, message: "Invalid password" };
  }
}