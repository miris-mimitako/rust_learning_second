// Layout.tsx
import React from "react";
import { GlobalDrawer } from "./GlobalDrawer";

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: 20, paddingTop: 80 }}>
    <GlobalDrawer />
    {children}
  </div>
);
