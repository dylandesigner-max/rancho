// Gerado por scripts/build-tokens.mjs a partir de design/tokens/onda.figma.json.
// Não edite à mão: altere no Figma, reexporte e rode `npm run tokens`.

import type { TextStyle } from 'react-native';

export const primitives = {
  "green": {
    "50": "#F0FBE8",
    "100": "#E1F7CF",
    "200": "#C0EF98",
    "300": "#8EE20F",
    "400": "#70BA00",
    "500": "#69AB18",
    "600": "#548C00",
    "700": "#2D7227",
    "800": "#0F562C",
    "900": "#033A26",
    "950": "#072019",
    "400A40": "#70BA0066",
    "300A40": "#8EE20F66"
  },
  "orange": {
    "50": "#FEF4F1",
    "100": "#FEE9E2",
    "200": "#FED3C4",
    "300": "#FDB79E",
    "400": "#FA916A",
    "500": "#F45F1C",
    "600": "#CE4305",
    "700": "#A63403",
    "800": "#7E2502",
    "900": "#571701",
    "950": "#340A00"
  },
  "neutral": {
    "50": "#F8F5EB",
    "100": "#E8E2D5",
    "200": "#E8DDC9",
    "300": "#D5C9B7",
    "400": "#BDAE9F",
    "500": "#A29285",
    "600": "#88766C",
    "700": "#6E5C54",
    "800": "#473632",
    "900": "#2E201D",
    "950": "#170C09",
    "950A50": "#170C0980",
    "950A70": "#170C09B2"
  },
  "amber": {
    "50": "#FEF5EB",
    "100": "#FDECD5",
    "200": "#FDD7A5",
    "300": "#FCBE63",
    "400": "#FBAC16",
    "500": "#C6870F",
    "600": "#A36E0A",
    "700": "#815706",
    "800": "#614003",
    "900": "#432B02",
    "950": "#271701"
  },
  "red": {
    "50": "#FDF5F4",
    "100": "#FBEAE9",
    "200": "#F8D4D2",
    "300": "#F4BAB7",
    "400": "#ED9693",
    "500": "#E26B6B",
    "600": "#D22539",
    "700": "#AF1D2E",
    "800": "#851320",
    "900": "#5D0A14",
    "950": "#380408"
  },
  "base": {
    "white": "#FFFFFF"
  }
} as const;

export type ColorTokens = {
  "bg": {
    "canvas": string;
    "surface": string;
    "subtle": string;
    "inverse": string;
    "disabled": string;
    "brand": string;
    "brandPressed": string;
    "brandSubtle": string;
    "accent": string;
    "accentPressed": string;
    "accentSubtle": string;
    "successSubtle": string;
    "warning": string;
    "warningSubtle": string;
    "danger": string;
    "dangerSubtle": string;
    "overlay": string;
    "control": string;
  };
  "text": {
    "primary": string;
    "secondary": string;
    "tertiary": string;
    "disabled": string;
    "inverse": string;
    "brand": string;
    "onBrand": string;
    "accent": string;
    "onAccent": string;
    "success": string;
    "warning": string;
    "onWarning": string;
    "danger": string;
    "onDanger": string;
  };
  "icon": {
    "primary": string;
    "secondary": string;
    "brand": string;
    "onBrand": string;
    "danger": string;
    "accent": string;
  };
  "border": {
    "default": string;
    "strong": string;
    "brand": string;
    "focus": string;
    "danger": string;
    "brandSubtle": string;
  };
};

export const color: { light: ColorTokens; dark: ColorTokens } = {
  light: {
    "bg": {
      "canvas": "#F8F5EB",
      "surface": "#FFFFFF",
      "subtle": "#E8E2D5",
      "inverse": "#170C09",
      "disabled": "#E8DDC9",
      "brand": "#70BA00",
      "brandPressed": "#548C00",
      "brandSubtle": "#C0EF98B3",
      "accent": "#F45F1C",
      "accentPressed": "#CE4305",
      "accentSubtle": "#FEF4F1",
      "successSubtle": "#E1F7CF",
      "warning": "#FBAC16",
      "warningSubtle": "#FDD7A5CC",
      "danger": "#D22539",
      "dangerSubtle": "#F8D4D2",
      "overlay": "#170C0980",
      "control": "#D5C9B7"
    },
    "text": {
      "primary": "#170C09",
      "secondary": "#6E5C54",
      "tertiary": "#88766C",
      "disabled": "#A29285",
      "inverse": "#F8F5EB",
      "brand": "#2D7227",
      "onBrand": "#072019",
      "accent": "#A63403",
      "onAccent": "#170C09",
      "success": "#2D7227",
      "warning": "#815706",
      "onWarning": "#170C09",
      "danger": "#AF1D2E",
      "onDanger": "#FFFFFF"
    },
    "icon": {
      "primary": "#170C09",
      "secondary": "#6E5C54",
      "brand": "#2D7227",
      "onBrand": "#072019",
      "danger": "#AF1D2E",
      "accent": "#A63403"
    },
    "border": {
      "default": "#D5C9B766",
      "strong": "#BDAE9F",
      "brand": "#548C00",
      "focus": "#548C00",
      "danger": "#D22539",
      "brandSubtle": "#70BA0066"
    }
  },
  dark: {
    "bg": {
      "canvas": "#170C09",
      "surface": "#2E201D",
      "subtle": "#473632",
      "inverse": "#F8F5EB",
      "disabled": "#473632",
      "brand": "#8EE20F",
      "brandPressed": "#70BA00",
      "brandSubtle": "#072019",
      "accent": "#F45F1C",
      "accentPressed": "#CE4305",
      "accentSubtle": "#340A00",
      "successSubtle": "#033A26",
      "warning": "#FBAC16",
      "warningSubtle": "#432B02",
      "danger": "#D22539",
      "dangerSubtle": "#380408",
      "overlay": "#170C09B2",
      "control": "#473632"
    },
    "text": {
      "primary": "#F8F5EB",
      "secondary": "#BDAE9F",
      "tertiary": "#A29285",
      "disabled": "#88766C",
      "inverse": "#170C09",
      "brand": "#8EE20F",
      "onBrand": "#072019",
      "accent": "#FA916A",
      "onAccent": "#170C09",
      "success": "#8EE20F",
      "warning": "#FCBE63",
      "onWarning": "#170C09",
      "danger": "#ED9693",
      "onDanger": "#FFFFFF"
    },
    "icon": {
      "primary": "#F8F5EB",
      "secondary": "#BDAE9F",
      "brand": "#8EE20F",
      "onBrand": "#072019",
      "danger": "#ED9693",
      "accent": "#FA916A"
    },
    "border": {
      "default": "#473632B3",
      "strong": "#88766C",
      "brand": "#8EE20F",
      "focus": "#8EE20F",
      "danger": "#ED9693",
      "brandSubtle": "#8EE20F66"
    }
  },
};

export const space = {
  "none": 0,
  "3xs": 2,
  "2xs": 4,
  "xs": 8,
  "sm": 12,
  "md": 16,
  "lg": 20,
  "xl": 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64
} as const;

export const radius = {
  "none": 0,
  "xs": 4,
  "sm": 8,
  "md": 12,
  "lg": 16,
  "xl": 24,
  "full": 9999
} as const;

// `satisfies` (e não `as const`): o React Native não aceita fontVariant somente-leitura.
export const text = {
  "display": {
    "large": {
      "fontFamily": "LilitaOne_400Regular",
      "fontSize": 40,
      "lineHeight": 44
    },
    "medium": {
      "fontFamily": "LilitaOne_400Regular",
      "fontSize": 32,
      "lineHeight": 36
    }
  },
  "heading": {
    "large": {
      "fontFamily": "LilitaOne_400Regular",
      "fontSize": 24,
      "lineHeight": 28
    },
    "medium": {
      "fontFamily": "NunitoSans_800ExtraBold",
      "fontSize": 20,
      "lineHeight": 26
    },
    "small": {
      "fontFamily": "NunitoSans_700Bold",
      "fontSize": 18,
      "lineHeight": 24
    }
  },
  "body": {
    "large": {
      "fontFamily": "NunitoSans_400Regular",
      "fontSize": 18,
      "lineHeight": 26
    },
    "medium": {
      "fontFamily": "NunitoSans_400Regular",
      "fontSize": 16,
      "lineHeight": 24
    },
    "small": {
      "fontFamily": "NunitoSans_400Regular",
      "fontSize": 14,
      "lineHeight": 20
    }
  },
  "label": {
    "large": {
      "fontFamily": "NunitoSans_700Bold",
      "fontSize": 16,
      "lineHeight": 20
    },
    "medium": {
      "fontFamily": "NunitoSans_700Bold",
      "fontSize": 14,
      "lineHeight": 20
    },
    "small": {
      "fontFamily": "NunitoSans_700Bold",
      "fontSize": 12,
      "lineHeight": 16
    }
  },
  "caption": {
    "fontFamily": "NunitoSans_600SemiBold",
    "fontSize": 12,
    "lineHeight": 16
  },
  "amount": {
    "large": {
      "fontFamily": "NunitoSans_800ExtraBold",
      "fontSize": 36,
      "lineHeight": 40,
      "fontVariant": [
        "tabular-nums"
      ]
    },
    "medium": {
      "fontFamily": "NunitoSans_800ExtraBold",
      "fontSize": 24,
      "lineHeight": 28,
      "fontVariant": [
        "tabular-nums"
      ]
    },
    "small": {
      "fontFamily": "NunitoSans_700Bold",
      "fontSize": 16,
      "lineHeight": 20,
      "fontVariant": [
        "tabular-nums"
      ]
    }
  }
} satisfies Record<string, TextStyle | Record<string, TextStyle>>;
