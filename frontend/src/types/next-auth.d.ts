import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    subscription: string;
    subscription_status?: string;
    provider?: string;
  }

  interface Session {
    user: User;
  }
}