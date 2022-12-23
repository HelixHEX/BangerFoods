import { extendTheme,type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true
}
const theme = extendTheme({
  config,
  colors: {
    background: '#E6EBE0',
    primary: '#ED6A5A',
    secondary: '#183059',
    gray: {
      10:  '#979797',
    },
  },
  fonts: {
    heading: `'Avenir Next LT Pro', sans-serif`,
    body: `'Avenir Next LT Pro', sans-serif`,
  },
  
});

export default theme;
