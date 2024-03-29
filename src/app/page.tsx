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
        const response = await fetch(
          "http://localhost:3001/auth/refresh-token",
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
