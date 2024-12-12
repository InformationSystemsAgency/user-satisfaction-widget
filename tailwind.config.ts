/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      screens: {
        xs: '320px',
      },

      fontSize: {
        base: ['1rem', '2rem'],
      },

      keyframes: {
        'accessibility-outline-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 3px #BD13B8' },
          '50%': { boxShadow: '0 0 0 6px #BD13B8' },
        },
      },

      animation: {
        'accessibility-outline-pulse': 'accessibility-outline-pulse 300ms ease-in-out',
      },

      boxShadow: {
        cards: '0 2px 4px 0 #0000000D',
        cardsHover: '0 2px 8px 0 #00000026',
        accessibilityOutline: '0 0 0 3px #BD13B8',
        modalWindow: '0 8px 16px 0 #0000004D',
        overflowMenu: '0px 4px 8px 0px #0000004d',
      },

      colors: {
        primary: '#355C8C',
        secondary: '#56B7B2',
        accessibility: '#BD13B8',
        searchBox: '#000000CC',
        overlay: '#1A1A1A66',
        overlayDark: '#000000BF',

        blue: {
          100: '#F0F4F9',
          200: '#DDE5EE',
          300: '#CBD6E3',
          400: '#B8C6D8',
          500: '#A5B7CD',
          600: '#8099B8',
          700: '#5A7AA2',
          800: '#355C8C',
          900: '#2A4A70',
          1000: '#203754',
          1100: '#152538',
          1200: '#0B121C',
        },

        green: {
          100: '#F6FFFF',
          200: '#EEF8F7',
          300: '#DDF1F0',
          400: '#CCE9E8',
          500: '#BBE2E0',
          600: '#9AD4D1',
          700: '#78C5C1',
          800: '#56B7B2',
          900: '#45928E',
          1000: '#346E6B',
          1100: '#224947',
          1200: '#112524',
        },

        gray: {
          100: '#C1C0C0',
          200: '#B2B1B1',
          300: '#A3A2A2',
          400: '#959494',
          500: '#868585',
          600: '#686767',
          700: '#4B4A4A',
          800: '#2D2C2C',
          900: '#242323',
          1000: '#1B1A1A',
          1100: '#121212',
          1200: '#0E0D0D',
        },

        text: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#DCDCDC',
          400: '#BFBFBF',
          500: '#999999',
          600: '#747474',
          700: '#454545',
          800: '#1A1A1A',
        },

        link: {
          main: '#004D99',
          active: '#000040',
          visited: '#800080',
        },

        systemMessage: {
          success: '#358000',
          successLight: '#EEFFE2',
          info: '#1B86C3',
          infoLight: '#E2F2FB',
          error: '#CC0000',
          errorLight: '#FFE0E0',
          warning: '#FEBB30',
          warningLight: '#FFEECC',
        },

        button: {
          default: '#167F16',
          hover: '#1B691B',
          active: '#155115',
          stroke: '#0F420F',
        },

        visualization: {
          turquoise: {
            main: '#56D4D6',
            high: '#9AE5E6',
            medium: '#CCF2F3',
            low: '#EEFAFA',
          },

          teal: {
            main: '#15B094',
            high: '#73D0BF',
            medium: '#B9E7DF',
            low: '#E7F7F4',
          },

          magenta: {
            main: '#D81884',
            high: '#E874B5',
            medium: '#F3BADA',
            low: '#FBE7F2',
          },

          purple: {
            main: '#8F2B8F',
            high: '#BC80BC',
            medium: '#DDBFDD',
            low: '#F3E9F3',
          },

          orange: {
            main: '#FF6A38',
            high: '#FFA688',
            medium: '#FFD2C3',
            low: '#FFF0EB',
          },

          violet: {
            main: '#474E95',
            high: '#9195BF',
            medium: '#C8CADF',
            low: '#ECEDF4',
          },
        },

        yesem: {
          primary: '#004FA3',

          blue: {
            600: '#2677CE',
          },
        },

        background: {
          white: '#FFFFFF',
          alternative: '#F5F5F580',
        },
      },

      spacing: {
        'viewport-standard': '1168px',
        'viewport-narrow': '767px',
        'viewport-mobile': '100%',
      },

      transitionProperty: {
        'max-height': 'max-height',
      },
    },
  },
};
