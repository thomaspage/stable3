import * as amplitude from "@amplitude/analytics-browser";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Button,
  IconButton,
  PaletteMode,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Drawer,
} from "@mui/material";
import logoDark from "../../assets/logoDark.png";
import logoLight from "../../assets/logoLight.png";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import {
  FilterButton,
  HeaderContainer,
  HeaderOptions,
  Logo,
  MobileMenuButton,
  MobileDrawerContent,
} from "./Header.styles";
import ApplyButton from "components/ApplyButton";
import ThemeSelector from "components/ThemeSelector";
import { Tune } from "@mui/icons-material";

const Header = ({
  setMode,
  view,
  handleViewChange,
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setMode?: (mode: PaletteMode) => void;
  view?: "map" | "list";
  handleViewChange?: (
    event: React.MouseEvent<HTMLElement>,
    newView: "list" | "map"
  ) => void;
  setIsSidebarOpen?: (open: boolean) => void;
  isSidebarOpen?: boolean;
}) => {
  const theme = useTheme();
  const logo = theme.palette.mode === "dark" ? logoDark : logoLight;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <Logo src={logo} />
      
      {/* Desktop Options */}
      <HeaderOptions>
        <ApplyButton />

        {setMode && <ThemeSelector setMode={setMode} />}

        {/* <LanguageSelector /> */}

        {setIsSidebarOpen && (
          <FilterButton
            color="primary"
            size="medium"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Tune fontSize="medium" />
          </FilterButton>
        )}

        {handleViewChange && (
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={handleViewChange}
          >
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
            <ToggleButton value="map">
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </HeaderOptions>

      {/* Mobile Hamburger Menu */}
      <MobileMenuButton
        color="inherit"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </MobileMenuButton>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <MobileDrawerContent>
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            sx={{ alignSelf: 'flex-end', marginBottom: 1 }}
          >
            <CloseIcon />
          </IconButton>

          <ApplyButton />

          {setMode && <ThemeSelector setMode={setMode} />}

          {setIsSidebarOpen && (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen);
                setMobileMenuOpen(false);
              }}
              startIcon={<Tune />}
            >
              Filters
            </Button>
          )}

          {handleViewChange && (
            <ToggleButtonGroup
              size="large"
              value={view}
              exclusive
              onChange={(e, v) => {
                handleViewChange?.(e, v);
                setMobileMenuOpen(false);
              }}
              fullWidth
            >
              <ToggleButton value="list">
                <ListIcon /> List
              </ToggleButton>
              <ToggleButton value="map">
                <MapIcon /> Map
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </MobileDrawerContent>
      </Drawer>
    </HeaderContainer>
  );
};

export default Header;
