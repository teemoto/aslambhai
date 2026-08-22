/**
 * Change `defaultTheme` to any theme name below to set the site's default.
 * Use "system" to preserve the visitor's light/dark system preference.
 */
export const themes = {
  light: { colorScheme: "light" },
  dark: { colorScheme: "dark" },
  linen: { colorScheme: "light" },
  olive: { colorScheme: "light" },
  sky: { colorScheme: "light" },
  white: { colorScheme: "light" },
  apricot: { colorScheme: "light" },
  butter: { colorScheme: "light" },
  midnight: { colorScheme: "dark" },
} as const;

export type ThemeName = keyof typeof themes;

export const defaultTheme: ThemeName | "system" = "light";
export const themeNames = Object.keys(themes) as ThemeName[];
export const darkThemeNames = themeNames.filter((theme) => themes[theme].colorScheme === "dark");
