import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Buns,
  Hamburger,
  Hearts,
  List,
  ListItem,
  ListType,
  MenuContainer,
  Patty,
} from "./Menu.styles";
import { useTranslation } from "react-i18next";
import * as amplitude from "@amplitude/analytics-browser";

const Menu = ({}) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const { pathname } = useLocation();

  const [showSecretDinner, setShowSecretDinner] = useState(
    !!localStorage.getItem("showSecretDinner")
  );

  const routes: {
    pathname: string;
    label: string;
    hearts?: {
      version: number;
      $height?: number;
      $top?: number;
      $right?: number;
      $left?: number;
      $bottom?: number;
    };
  }[] = [
    {
      pathname: "/",
      label: t("pages.home.path"),
      hearts: {
        version: 2,
        $height: 25,
        $top: -9,
        $right: 0,
      },
    },
    {
      pathname: "/schedule",
      label: t("pages.schedule.path"),
      hearts: {
        version: 1,
        $height: 22,
        $top: -2,
        $left: -13,
      },
    },
    {
      pathname: "/accomodations",
      label: t("pages.accomodations.path"),
      hearts: {
        version: 4,
        $height: 14,
        $top: -3,
        $right: 0,
      },
    },
    {
      pathname: "/rsvp",
      label: t("pages.rsvp.path"),
      hearts: {
        version: 3,
        $height: 14,
        $bottom: 10,
        $right: 3,
      },
    },
  ];

  showSecretDinner &&
    routes.push({
      pathname: "/welcome-evening",
      label: t("pages.secretDinner.path"),
      hearts: {
        version: 1,
        $height: 22,
        $top: -2,
        $left: -13,
      },
    });

  // Show welcome-evening permanently if user navigates to it
  useEffect(() => {
    if (pathname === "/welcome-evening") {
      localStorage.setItem("showSecretDinner", "true");
      setShowSecretDinner(true);
    }
  }, [pathname]);

  const handleClick = () => {
    setOpen(false);
    window.scrollTo(0, 0);
    amplitude.track("Click", { button: "Menu", pathname });
  };

  return (
    <MenuContainer open={open}>
      <Hamburger color="inherit" onClick={() => setOpen(!open)}>
        <Buns>
          <Patty open={open} />
          <Patty open={open} />
          <Patty open={open} />
        </Buns>
      </Hamburger>

      <List open={open}>
        {routes.map((route, i) => {
          const selected = route.pathname === pathname;
          const src = `${process.env.PUBLIC_URL}/img/hearts${route.hearts?.version}.png`;
          return (
            <ListItem key={i} to={route.pathname} onClick={handleClick}>
              <ListType selected={selected}>{route.label}</ListType>
              {selected && route.hearts && (
                <Hearts src={src} {...route.hearts} />
              )}
            </ListItem>
          );
        })}
      </List>
    </MenuContainer>
  );
};

export default Menu;
