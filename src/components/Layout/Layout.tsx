import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Content from "../Content";
import { LayoutContainer } from "./Layout.styles";
import { useTheme } from "@mui/material";

/**
 * Main layout wrapper component
 * Handles page view tracking and provides consistent layout structure
 */
const Layout = () => {
  const { pathname } = useLocation();
  const {
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();

  // Track page views with Amplitude analytics
  useEffect(() => {
    amplitude.track("Page View", { pathname, language });
  }, [pathname, language]);

  return (
    <LayoutContainer className={`theme-${theme.palette.mode}`}>
      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
};

/**
 * Hook to access outlet context (if needed in child components)
 */
export function useSetTitle() {
  return useOutletContext();
}

export default Layout;
