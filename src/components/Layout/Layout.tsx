import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Content from "../Content";
import LanguageSelector from "../LanguageSelector";
import Menu from "../Menu";
import { LayoutContainer, Title } from "./Layout.styles";
import { useTheme } from "@mui/material";

const Layout = ({}) => {
  const { pathname } = useLocation();

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const theme = useTheme();

  useEffect(() => {
    amplitude.track("Page View", { pathname, language });
  }, [pathname]);

  return (
    <LayoutContainer className={`theme-${theme.palette.mode}`}>
      {/* Menu */}
      {/* <Menu /> */}

      {/* Content */}
      <Content>
        <Outlet />
      </Content>

      {/* Lanugage Selector
      <LanguageSelector /> */}
    </LayoutContainer>
  );
};

export function useSetTitle() {
  return useOutletContext();
}

export default Layout;
