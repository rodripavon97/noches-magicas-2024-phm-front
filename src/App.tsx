import { theme } from './styles/styles'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import i18n from './i18n'
import { useEffect } from 'react'

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
