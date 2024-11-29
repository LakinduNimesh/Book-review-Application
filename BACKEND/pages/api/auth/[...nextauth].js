import NextAuth from 'next-auth'
import connectToDatabase from '@/lib/mongodb'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({

      // name to display in cridentilas
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        const db = await connectToDatabase();
        const collection = db.collection('admin');

        const user = await collection.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          return { _id: user._id, email: user.email };

        }
        return null;
      },
    }),
  ],

  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id // add user id to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id;
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
})