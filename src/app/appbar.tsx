import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ButtonAppBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("accessToken");

    // Redirect to the login page
    router.push("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SkinX Blog Post
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
          {/* <Button color="inherit">
            <Link href="/login">Login</Link>
          </Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
