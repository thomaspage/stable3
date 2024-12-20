import * as amplitude from "@amplitude/analytics-browser";
import { useTranslation } from "react-i18next";
import { Hamburger, ThemeSelectorContainer } from "./ThemeSelector.styles";
import { IconButton, PaletteMode, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeSelector = ({
  setMode,
}: {
  setMode: (mode: PaletteMode) => void;
}) => {
  const {
    palette: { mode },
  } = useTheme();

  const newMode = mode === "light" ? {mode: "dark", icon: DarkMode} : {mode: "light", icon: LightMode}
  
  const toggleTheme = () => {
    amplitude.track("Change Theme Mode", { mode });
    localStorage.setItem("mode", newMode.mode)
    setMode(newMode.mode as PaletteMode);
  };

  return (
    <ThemeSelectorContainer>
      <Hamburger size="small" color="inherit" onClick={toggleTheme}  >
        <newMode.icon fontSize="small" />
      </Hamburger>
    </ThemeSelectorContainer>
  );
};

export default ThemeSelector;
