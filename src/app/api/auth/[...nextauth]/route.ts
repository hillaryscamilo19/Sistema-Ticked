// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        const user = await res.json();

        if (!res.ok || !user) return null;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login?error=CredentialsSignin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        username: token.username,
      };
      return session;
    },
  },
});

// 👇 named exports para que Next.js los use correctamente
export { handler as GET, handler as POST };
