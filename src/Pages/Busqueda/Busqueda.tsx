// ============================================
// PÁGINA DE BÚSQUEDA - UI Pura
// ============================================

import { useState } from 'react'
import { Flex, Image, SimpleGrid, Text } from '@chakra-ui/react'
import CardShow from '../../components/Card/Card'
import FiltroBusqueda from '../../components/FiltroBusqueda/FiltroBusqueda'
import { useShows } from '../../hooks/useShows'
import { useOnInit } from '../../hooks/useOnInit'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../errors'
import errorFound from '../../assets/error.svg'

/**
 * Página de Búsqueda de Shows
 * RESPONSABILIDAD: Solo UI - renderizar lista de shows
 * NO tiene lógica de negocio, usa hooks para todo
 */
const BusquedaPage = () => {
  const [artistaABuscar, setArtistaABuscar] = useState('')
  const [locacionABuscar, setLocacionABuscar] = useState('')
  const [conAmigosFiltro, setConAmigosFiltros] = useState(false)

  const { shows, loading, buscarShows } = useShows()
  const toast = useToast()

  /**
   * Buscar shows con filtros
   */
  const handleSearch = async () => {
    try {
      await buscarShows()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  /**
   * Handlers de cambio de filtros
   */
  const handleTextChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocacionABuscar(e.target.value)
  }

  const handleTextChangeArtista = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistaABuscar(e.target.value)
  }

  const handleCheckAmigos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConAmigosFiltros(e.target.checked)
  }

  /**
   * Cargar shows al montar
   */
  useOnInit(() => {
    handleSearch()
  })

  return (
    <>
      <FiltroBusqueda
        isAdmin={false}
        clickSearch={handleSearch}
        changeArtistaText={handleTextChangeArtista}
        changeLocacionText={handleTextChangeLocation}
        changeCheckboxAmigos={handleCheckAmigos}
      />

      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="100%" mt="3rem">
          <Text color="white" fontSize="20px">Cargando shows...</Text>
        </Flex>
      ) : shows.length > 0 ? (
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 3 }}
          placeItems="center"
          spacing={10}
          p={8}
          gap={5}
          mb="3rem"
        >
          {shows.map((show) => (
            <CardShow
              show={show}
              key={show.id}
              mostrarCantidadEntrada={false}
              estaEnPerfil={false}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Flex
          justifyContent="center"
          alignItems="center"
          h="100%"
          flexDir="column"
          gap={10}
          mt="3rem"
        >
          <Image src={errorFound} width={500} height={500} alt="No se encontraron shows" />
          <Text color="white" fontSize="20px" fontWeight="bold">
            No se encontraron shows
          </Text>
        </Flex>
      )}
    </>
  )
}

export default BusquedaPage
