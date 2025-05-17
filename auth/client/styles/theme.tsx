import { createContext, PropsWithChildren, useContext, useState } from 'react';

export const DarkTheme = {
  // App level
  app: {
    background: '#071318',
    foreground: '#fff',

    altBackground: '#1d2830',
    controlsBorder: '#424e57',
    focusedBorder: '#d4d4d4',
    actionBackground: '#2196f3',

    errorBackground: '#4f1a1a99',
    errorForeground: '#ffc0c0',
    errorControlBackground: '#ffa0a0',
  },
};

export const LightTheme = {
  app: {
    background: '#FFFFFF',
    foreground: '#000000',

    altBackground: '#E6EBF3',
    controlsBorder: '#d4d4d4',
    focusedBorder: '#424E57',
    actionBackground: '#173D58',

    errorBackground: '#ffbaba',
    errorForeground: '#810e1d',
    errorControlBackground: '#ffa0a0',
  },
};

const ThemeNames = {
  LIGHT: 'light',
  DARK: 'dark',
};

const themeKey = 'theme-name';

const ThemeContext = createContext(ThemeNames.LIGHT);

export function useTheme() {
  const themeName = useContext(ThemeContext);
  return themeName === ThemeNames.LIGHT ? LightTheme : DarkTheme;
}

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem(themeKey) ?? ThemeNames.DARK
  );
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
