import { extendTheme, theme } from "native-base";

export const defaultTheme = extendTheme({
  colors: {
    primary: {
      500: theme.colors.yellow[400],
      600: theme.colors.yellow[500],
      700: "#64695f",
      800: theme.colors.yellow[700],
    },
    secondary: {
      500: theme.colors.coolGray[700],
      700: theme.colors.coolGray[600],
    },
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "sm",
        size: "lg",
      },
    },
    Input: {
      defaultProps: {
        backgroundColor: "coolGray.700",
        borderColor: "coolGray.600",
        size: "2xl",
        color: "white",
      },
    },
    Heading: {
      defaultProps: {
        fontFamily: "Rubik_700Bold",
        color: "coolGray.100",
      },
    },
    Text: {
      defaultProps: {
        color: "coolGray.100",
        fontFamily: "Karla_400Regular",
      },
    },
    FormControlLabel: {
      defaultProps: {
        _text: {
          color: "coolGray.200",
          fontSize: "md",
          fontFamily: "Karla_400Regular",
        },
      },
    },
  },
});
