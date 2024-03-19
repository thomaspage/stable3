import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import Content from "../Content";
import LanguageSelector from "../LanguageSelector";
import Menu from "../Menu";
import { LayoutContainer, Title } from "./Layout.styles";

const Layout = ({}) => {
  const { pathname } = useLocation();

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const title = {
    "/accomodations": t("pages.accomodations.path"),
    "/schedule": t("pages.schedule.path"),
    "/rsvp": t("pages.rsvp.path"),
  }[pathname];

  useEffect(() => {
    amplitude.track("Page View", { pathname, language });
  }, [pathname]);

  return (
    <LayoutContainer>
      {/* Menu */}
      <Menu />

      {/* Content */}
      <Content>
        <>
          <Title sx={{ textAlign: pathname === "/schedule" ? "center" : "" }}>
            {title}
          </Title>
          <Outlet />
        </>
      </Content>

      {/* Lanugage Selector */}
      <LanguageSelector />
    </LayoutContainer>
  );
};

export function useSetTitle() {
  return useOutletContext();
}

export default Layout;
