import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ConnectToDB } from "@/utils/database";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text" },
            },
            async authorize(credentials) {
                await ConnectToDB();

                const { email, password, username } = credentials;

                if (username) {
                    const userExists = await User.findOne({ email });
                    if (userExists) {
                        throw new Error("User  already exists with that email");
                    }

                    const hashedPassword = await bcrypt.hash(password, 12);
                    const newUser = new User({ email, username, password: hashedPassword });
                    await newUser.save();
                    return { id: newUser._id.toString(), email, username };
                }

                // Sign-In logic
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error("Invalid email or password");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                console.log("✅ User logged in:", user);

                return { id: user._id.toString(), email: user.email, username: user.username };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id || null;
            session.user.email = token.email;
            session.user.username = token.username;
            return session;
        },
    },
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };