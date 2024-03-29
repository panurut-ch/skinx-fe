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
    localStorage.removeItem("accessToken");

    router.push("/login");
  };
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiPath_refreshToken =
          process.env.NEXT_PUBLIC_API_PATH_REFRESH_TOKEN;
        const response = await fetch(`${apiUrl}${apiPath_refreshToken}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);

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
