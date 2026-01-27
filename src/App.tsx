import { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import i18n from './i18n'
import { theme } from './styles/styles'

function App() {
  useEffect(() => {
    i18n.init()
  }, [])

  return (
    <Router>
      <ChakraProvider theme={theme}>
        <Routes />
      </ChakraProvider>
    </Router>
  )
}

export default App
