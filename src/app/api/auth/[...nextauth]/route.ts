import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@/lib/neon/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const result = await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
                    const user = result[0];
                    if (!user) return null;

                    const isValidPassword = await bcrypt.compare(credentials.password, user.passwordhash);
                    if (!isValidPassword) return null;

                    return { id: user.email, email: user.email, name: user.name };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_development",
    pages: {
        signIn: '/login',
    }
});

export { handler as GET, handler as POST };
