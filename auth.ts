import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import Account, { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./lib/validations";
import User from "./database/user.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/mongoose";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          await dbConnect();

          // const { data: existingAccount } = (await api.accounts.getByProvider(
          //   email
          // )) as ActionResponse<IAccountDoc>;
          const existingAccount = await Account.findOne({
            provider: "credentials",
            providerAccountId: email,
          });

          if (!existingAccount) return null;

          // const { data: existingUser } = (await api.users.getById(
          //   existingAccount.userId.toString()
          // )) as ActionResponse<IUserDoc>;
          const existingUser = await User.findById(existingAccount.userId);

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        await dbConnect();
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccountDoc>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
