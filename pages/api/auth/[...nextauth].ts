import NextAuth, { Awaitable, NextAuthOptions, RequestInternal, User } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import { Provider } from "next-auth/providers/index"
import Credentials from 'next-auth/providers/credentials';
import { compare } from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadbClient from "../../../libs/prismadb";


const providers: Provider[] = [
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    authorization: {
      params: {
        scope: 'public_profile read_insights',
      }
    },
    profile: (profile, token) => {
      console.log('check', profile, token)
      return profile
    }
  }),
  Credentials({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'text',
      },
      password: {
        label: 'Password',
        type: 'passord'
      }
    },
    authorize: async (credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "headers" | "body" | "query" | "method">) => {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password required');
      }

      const user = await prismadbClient.user.findUnique({ where: {
        email: credentials.email
      }});

      if (!user || !user.hashedPassword) {
        throw new Error('Email does not exist');
      }

      const isCorrectPassword = await compare(credentials.password, user.hashedPassword);

      if (!isCorrectPassword) {
        throw new Error('Incorrect password');
      }

      return user;
    }
  })
]

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    jwt: async({token, user, account, trigger, session}) => {
      if (account) {
        token.access_token = account.access_token
        token.refresh_token = account.refresh_token;
      }
      if (trigger === 'update' && session) {
        if (session.name) {
          token.name = session.name
        }
        if (session.email) {
          token.email = session.email
        }
      }
      return token;
    },
    session: async({session, token, trigger, newSession}) => {
      session.access_token = token.access_token
      session.user.id = token.sub;
      if (trigger === 'update' && newSession) {
        console.log(newSession)
        if (newSession.name) {
          session.user.name = newSession.name
        }
        if (newSession.email) {
          session.user.email = newSession.email
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/_error'
  },
  logger: {
    error(code, metadata) {
      console.log(code, metadata)
    },
    warn(code) {
      console.log(code)
    },
    debug(code, metadata) {
      console.log(code, metadata)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadbClient),
  session: { strategy: 'jwt' },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)