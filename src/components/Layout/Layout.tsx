import { Box, useBreakpointValue } from '@chakra-ui/react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  showNavbar?: boolean
}

const Layout = ({ children, showNavbar = true }: LayoutProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {showNavbar && !isMobile && (
        <Box position="sticky" top="0" zIndex="1000">
          <Navbar />
        </Box>
      )}

      <Box 
        flex="1" 
        pb={isMobile ? "80px" : "0"} // Padding bottom solo en mobile para la navbar inferior
        w="100%"
      >
        {children}
      </Box>

      {!isMobile && <Footer />}

  
      {showNavbar && isMobile && (
        <Box 
          position="fixed" 
          bottom="0" 
          left="0" 
          right="0" 
          zIndex="1000"
        >
          <Navbar />
        </Box>
      )}
    </Box>
  )
}

export default Layout
