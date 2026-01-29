import * as amplitude from "@amplitude/analytics-browser";
import { Hamburger, ThemeSelectorContainer } from "./ThemeSelector.styles";
import { PaletteMode, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

/**
 * Theme selector component that toggles between light and dark modes
 * Persists user preference to localStorage
 */
const ThemeSelector = ({
  setMode,
}: {
  setMode: (mode: PaletteMode) => void;
}) => {
  const {
    palette: { mode },
  } = useTheme();

  // Determine next mode and corresponding icon
  const newMode = mode === "light" 
    ? { mode: "dark", icon: DarkMode } 
    : { mode: "light", icon: LightMode };
  
  /**
   * Toggle theme and save preference to localStorage
   */
  const toggleTheme = () => {
    amplitude.track("Change Theme Mode", { mode: newMode.mode });
    localStorage.setItem("mode", newMode.mode);
    setMode(newMode.mode as PaletteMode);
  };

  return (
    <ThemeSelectorContainer>
      <Hamburger size="large" color="inherit" onClick={toggleTheme}  >
        <newMode.icon fontSize="large" />
      </Hamburger>
    </ThemeSelectorContainer>
  );
};

export default ThemeSelector;
