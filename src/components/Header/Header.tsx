import * as amplitude from "@amplitude/analytics-browser";
import { useTranslation } from "react-i18next";
import {
  Button,
  IconButton,
  PaletteMode,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import logoDark from "../../assets/logoDark.png";
import logoLight from "../../assets/logoLight.png";
import ListIcon from "@mui/icons-material/List";
import MapIcon from "@mui/icons-material/Map";

import {
  FilterButton,
  HeaderContainer,
  HeaderOptions,
  Logo,
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

  return (
    <HeaderContainer>
      <Logo src={logo} />
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
    </HeaderContainer>
  );
};

export default Header;
