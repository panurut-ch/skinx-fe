"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@mui/material/Button";
import Table from "./table";
import ButtonAppBar from "./appbar";

export default function Home() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect to the login page
    router.push("/login");
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Retrieve the JWT token from localStorage
  //     const token = localStorage.getItem("accessToken");

  //     if (!token) {
  //       router.push("/login"); // Redirect to the login page if the token is not found
  //     }
  //   };

  //   fetchData();
  // }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve the JWT token from localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login"); // Redirect to the login page if the token is not found
        return;
      }

      try {
        // Make a request to your server to validate the token
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiPath_refreshToken = process.env.NEXT_PUBLIC_API_PATH_REFRESH_TOKEN;
        const response = await fetch(
          `${apiUrl}${apiPath_refreshToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );

        if (response.ok) {
          // Token is valid, do nothing
        } else {
          // Token is invalid, redirect to login page
          router.push("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        // Handle error, for example, redirect to login page
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  return (
    <>
      <ButtonAppBar />
      <Table />
    </>
  );
}
