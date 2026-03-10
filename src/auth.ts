import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "admin" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        try {
          await dbConnect();
          
          const user = await User.findOne({ name: credentials.username });
          
          if (!user) return null;
          
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          
          if (passwordsMatch) {
            return { id: user._id.toString(), name: user.name, email: user.email };
          }
          
        } catch (error) {
          console.error("Authentication error:", error);
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  }
})
