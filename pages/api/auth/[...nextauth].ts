import NextAuth, { NextAuthOptions } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import { Provider } from "next-auth/providers/index"


const providers: Provider[] = [
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    authorization: {
      params: {
        scope: 'public_profile read_insights',
      }
    }
  })
]

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    jwt: async({token, user, account}) => {
      console.log("account", account)
      if (account) {
        console.log(user)
        token.access_token = account.access_token
        token.refresh_token = account.refresh_token;
      }
      return token;
    },
    session: async({session, token}) => {
      console.log("session: ", token);
      (session as any).access_token = token.access_token;
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
}

export default NextAuth(authOptions)