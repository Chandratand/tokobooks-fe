import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  const handleDrawerClick = () => {
    setOpen(!open);
  };

  const onMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    onMobile ? setOpen(false) : setOpen(true);
  }, [onMobile]);

  const list = [
    {
      label: "Dashboard",
      href: "/",
      icon: <GridViewIcon />,
    },
    {
      label: "Transaction",
      href: "/transaction",
      icon: <LocalGroceryStoreIcon />,
    },
    {
      label: "Books",
      href: "/books",
      icon: <LibraryBooksIcon />,
    },
    {
      label: "History",
      href: "/history",
      icon: <FormatListBulletedIcon />,
    },
  ];

  const router = useRouter();
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClick}
            edge="start"
            sx={{
              marginRight: !open && 1,
            }}
          >
            {!open ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
          {!open && (
            <Typography variant="h6" noWrap component="div">
              TokoBooks
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <Typography variant="h6" noWrap component="div">
              TokoBooks
            </Typography>
          )}
        </DrawerHeader>
        <List>
          {list.map((menu) => (
            <ListItem
              key={menu.label}
              disablePadding
              sx={{
                display: "block",
              }}
            >
              <Link href={menu.href}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    borderRadius: "8px",
                    backgroundColor:
                      router.pathname === "/" && menu.href === "/"
                        ? "#E6F4F1"
                        : router.pathname.startsWith(menu.href) &&
                          menu.href !== "/" &&
                          "#E6F4F1",
                    margin: "4px",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {menu.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={menu.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 2,
          pt: 10,
          bgcolor: "#f5f5f5",
          height: "100vh",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
