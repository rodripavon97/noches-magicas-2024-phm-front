// ============================================
// PÁGINA DE PERFIL DE USUARIO - UI Pura
// ============================================

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { UsuarioSidebar } from '../../components/PerfilUsuario/UsuarioSidebar'
import { UsuarioEntradas } from '../../components/PerfilUsuario/UsuarioEntradas'
import { UsuarioAmigosComponent } from '../../components/PerfilUsuario/UsuarioAmigos'
import { UsuarioComentarios } from '../../components/PerfilUsuario/UsuarioComentarios'
import { useUsuario } from '../../hooks/useUsuario'
import { useOnInit } from '../../hooks/useOnInit'

/**
 * Página de Perfil de Usuario
 * RESPONSABILIDAD: Solo UI - renderizar perfil del usuario
 * NO tiene lógica de negocio, usa hooks para todo
 */
const UsuarioPage = () => {
  const {
    entradasCompradas,
    amigos,
    comentarios,
    refreshEntradas,
    refreshAmigos,
    refreshComentarios,
  } = useUsuario()

  /**
   * Handlers de carga de contenido por tab
   */
  const tabLoaders: Record<number, () => Promise<void>> = {
    0: refreshEntradas,
    1: refreshAmigos,
    2: refreshComentarios,
  }

  const cargarContenido = async (tabIndex: number) => {
    const loader = tabLoaders[tabIndex]
    if (loader) {
      await loader().catch(() => {
        // Error manejado por el hook
      })
    }
  }

  /**
   * Cargar entradas al montar
   */
  useOnInit(() => {
    refreshEntradas().catch(() => {
      // Error manejado por el hook
    })
  })

  return (
    <Flex direction={{ base: 'column', sm: 'row' }}>
      <UsuarioSidebar />

      {/* Accordion para Mobile */}
      <Box display={{ base: 'block', md: 'none' }} w={{ base: '100%', sm: '70vw' }} p={4}>
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton onClick={() => cargarContenido(0)}>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                Entradas Compradas
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <UsuarioEntradas entradas={entradasCompradas} onComentarioPublicado={refreshEntradas} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton onClick={() => cargarContenido(1)}>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                Amigos
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <UsuarioAmigosComponent amigos={amigos} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton onClick={() => cargarContenido(2)}>
              <Box flex="1" textAlign="left" fontWeight="semibold">
                Comentarios
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <UsuarioComentarios comentarios={comentarios} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Tabs para Desktop */}
      <Box display={{ base: 'none', md: 'block' }} w="70vw">
        <Tabs onChange={(index) => cargarContenido(index)}>
          <TabList>
            <Tab>Entradas Compradas</Tab>
            <Tab>Amigos</Tab>
            <Tab>Comentarios</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <UsuarioEntradas entradas={entradasCompradas} onComentarioPublicado={refreshEntradas} />
            </TabPanel>
            <TabPanel>
              <UsuarioAmigosComponent amigos={amigos} />
            </TabPanel>
            <TabPanel>
              <UsuarioComentarios comentarios={comentarios} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  )
}

export default UsuarioPage
