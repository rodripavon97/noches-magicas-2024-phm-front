import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/raleway'
import '@fontsource/poppins/400.css'

const colors = {
  brand: {
    colorPrimary: '#2D3250',
    colorSecundary: '#424769',
    colorThrird: '#7077A1',
    colorFourth: '#F58F29',
    soldOut: '#A6F098',
    semiSoldOut: '#F0E498',
    nullSoldOut: '#F09898',
    colorDatePrimary: '#9CC2C9',
    colorDateSecundary: '#83B2CB',
    text: '#FFFFFF',
    borderColorCard: '#2c2552'
  },
}

const styles = {
  global: {
    'html, body': {
      background: colors.brand.colorPrimary,
      color: 'white',
    },
  },
}

const fonts = {
  fonts: {
    heading: `'Raleway Variable', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  negrita: {
    fontWeight: 'bold',
  },
}

export const theme = extendTheme({ colors, styles, fonts })
