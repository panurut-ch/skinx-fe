// next-auth.config.js
import { NextAuthOptions } from "next-auth";
import { Credentials } from "next-auth";
import { login } from "./src/app/services/api"; // Import your login function from your API

const options: NextAuthOptions = {
  providers: [
    Credentials({
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
      async authorize(credentials, req) {
        try {
          // Call your API login function
          const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          console.log('response', response)
          if (response.ok) {
            const data = await response.json();
            // Check if the response contains an access token
            if (data.accessToken) {
              // Return the access token
              return { accessToken: data.accessToken };
            } else {
              // Return null if no access token is found in the response
              console.error("No access token found in response");
              return null;
            }
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
  ],
};

export default options;
