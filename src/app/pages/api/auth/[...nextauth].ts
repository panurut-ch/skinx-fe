// pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { login } from "../../../services/api"; // Import your login function from your API

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        // Customize credential inputs if needed
        email: { label: "Email", type: "email", placeholder: "Your email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        try {
          // Call your API login function
          const user = await login(credentials.email, credentials.password);
          console.log('user', user)
          if (user) {
            // Return user data if login is successful
            return user;
          } else {
            // Return null if login failed
            return null;
          }
        } catch (error) {
          // Return null if an error occurs
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
    // Add other authentication providers if needed
  ],
});
