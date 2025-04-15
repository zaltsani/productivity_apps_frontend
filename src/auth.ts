import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import AxiosInstance, { setAuthToken } from '@/lib/axiosInstance';

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  token: string;
}

async function getUser(username: string, password: string): Promise<User | null> {
  try {
    const response = await AxiosInstance.post(`api/v1/dj-rest-auth/login`, {
      username: username,
      password: password,
    })
    const token = response.data.key
    if (!token) {
      console.error("No token received from the backend");
      throw new Error("Authentication failed: No token");
    }
    console.log("Token", token)
    setAuthToken(token)

    const resUser = await AxiosInstance.get(`api/v1/users/me`)
    console.log("user", resUser.data)
    const user = resUser.data

    return { ...user, token: token}
  } catch(error) {
    console.log(error.response?.data?.detail || 'Login failed')
    throw new Error("Failed to fetch user")
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid credentials format");
          throw new Error("Invalid credentials");
        }

        const { username, password } = parsedCredentials.data;

        try {
          const user = await getUser(username, password);
          if (!user) {
            console.log("Authentication failed: No user returned");
            throw new Error("Invalid username or password");
          }
          return user;
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error("Authentication failed");
        }
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
});