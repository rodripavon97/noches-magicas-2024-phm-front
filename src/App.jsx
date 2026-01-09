import { theme } from './styles/styles'
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from './components/Navbar/Navbar'
import Footer from "../src/components/Footer/Footer.jsx"
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
          <Navbar />
          <Routes />
          <Footer/>
        </ChakraProvider>
    </Router>
  )
}

export default App
