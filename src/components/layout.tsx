import { Box } from "@mui/material";
import NavBar from "./nav-bar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <NavBar /> */}
      <Box>{children}</Box>
    </>
  );
};

export default Layout;
