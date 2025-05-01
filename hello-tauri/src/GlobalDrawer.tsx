import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Drawer, Button, List, Divider,
  ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

// メニュー項目とパスの定義
const MENU_ITEMS: { text: string; path: string }[] = [
  { text: "app2",     path: "/app2" },
  { text: "app3",   path: "/app3" },
  { text: "app4",path: "/app4" },
  { text: "app5",    path: "/app5" },
];

export function GlobalDrawer() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer =
    (isOpen: boolean) =>
    (event?: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event?.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
         (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(isOpen);
    };

  // menuList をオブジェクト配列版に変更
  const menuList = () =>
    MENU_ITEMS.map(({ text, path }, index) => (
      <ListItem key={text} disablePadding>
        <ListItemButton
          sx={{ "&:hover": { backgroundColor: "#e0f7fa" }, px: 2 }}
          onClick={() => {
            navigate(path);   // ここで画面遷移
            setOpen(false);   // ドロワーを閉じる
          }}
        >
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    ));

  const drawerContent = (
    <Box
      sx={{ width: 260, bgcolor: "#fafafa", height: "100%", boxShadow: 3, pt: 2 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ px: 2, pb: 1 }}>メニュー</Typography>
      <Divider />
      <List>{menuList()}</List>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed", top: 16, left: 16, zIndex: 1300,
          bgcolor: "#1976d2", color: "white",
          "&:hover": { bgcolor: "#1565c0" }
        }}
        variant="contained"
      >
        メニュー
      </Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={(e, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            setOpen(false);
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
