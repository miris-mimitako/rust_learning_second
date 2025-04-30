import * as React from "react";
import {
  Box,
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export function GlobalDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer =
    (isOpen: boolean) =>
    (event?: React.KeyboardEvent | React.MouseEvent) => {
      // タブやShiftキーの押下ではDrawerを閉じないようにする
      if (
        event?.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(isOpen);
    };

  const menuList = (items: string[]) =>
    items.map((text, index) => (
      <ListItem key={text} disablePadding>
        <ListItemButton
          sx={{
            "&:hover": {
              backgroundColor: "#e0f7fa",
            },
            px: 2,
          }}
          onClick={() => {
            console.log(`Clicked ${text}`);
            // Drawerを閉じるのは必要ならここで
            setOpen(false);
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
      sx={{
        width: 260,
        bgcolor: "#fafafa",
        height: "100%",
        boxShadow: 3,
        pt: 2,
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ px: 2, pb: 1 }}>
        メニュー
      </Typography>
      <Divider />
      <List>{menuList(["Inbox", "Starred", "Send email", "Drafts"])}</List>
      <Divider />
      <List>{menuList(["All mail", "Trash", "Spam"])}</List>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          bgcolor: "#1976d2",
          color: "white",
          "&:hover": {
            bgcolor: "#1565c0",
          },
        }}
        variant="contained"
      >
        メニュー
      </Button>

      <Drawer
  anchor="left"
  open={open}
  onClose={(event, reason) => {
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
