'use server'

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth";

export async function authenticate(formData) {
  try {
    const response = await signIn('credentials', formData)
    console.log("Action Response", response)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'credentials':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}