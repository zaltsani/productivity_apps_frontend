// import NextAuth from 'next-auth';
// import { authConfig } from '@/auth.config';
// import { auth } from '@/auth';
import { handlers } from "@/auth";

// const handler = NextAuth(authConfig);
// const handler = auth

// Next.js App Router requires exporting the methods (GET, POST) 
// from the route. NextAuth will handle them.
// export { handler as GET, handler as POST };
export const { GET, POST } = handlers