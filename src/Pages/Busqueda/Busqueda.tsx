import { Flex, Image, SimpleGrid, Text, Spinner } from '@chakra-ui/react'
import CardShow from '../../components/Card/Card'
import FiltroBusqueda from '../../components/FiltroBusqueda/FiltroBusqueda'
import { useState } from 'react'
import { useShows, UseUser } from '../../hooks'
import { useMessageToast } from '../../hooks/useToast'
import { theme } from '../../styles/styles'
import { Show } from '../../domain/Show'
import errorFound from '../../assets/error.svg'

const BusquedaPage = () => {
  const { userId } = UseUser()
  const [artistaABuscar, setArtistaABuscar] = useState('')
  const [locacionABuscar, setLocacionABuscar] = useState('')
  const [conAmigosFiltro, setConAmigosFiltros] = useState(false)
  
  const { shows, loading, error, refetch } = useShows({
    artista: artistaABuscar,
    location: locacionABuscar,
    conAmigos: conAmigosFiltro,
    userId: userId || undefined,
  })
  
  const { errorToast } = useMessageToast()

  // Mostrar error con toast
  if (error) {
    errorToast(error)
  }

  const handleSearchClick = () => {
    refetch({
      artista: artistaABuscar,
      location: locacionABuscar,
      conAmigos: conAmigosFiltro,
      userId: userId || undefined,
    })
  }

  const handleTextChangeLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocacionABuscar(e.target.value)
  }

  const handleTextChangeArtista = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistaABuscar(e.target.value)
  }

  const handleCheckAmigos = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConAmigosFiltros(e.target.checked)
  }

  return (
    <>
      <FiltroBusqueda 
        isAdmin={false} 
        clickSearch={handleSearchClick} 
        changeArtistaText={handleTextChangeArtista} 
        changeLocacionText={handleTextChangeLocation} 
        changeCheckboxAmigos={handleCheckAmigos}
      />
     
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="60vh">
          <Spinner size='xl' color={theme.colors.brand.colorFourth} />
        </Flex>
      ) : shows.length > 0 ? (
        <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} placeItems="center" spacing={10} p={8} gap={5} mb="3rem">
          {shows.map((showJSON) => (
            <CardShow 
              show={Show.fromJSON(showJSON)} 
              key={showJSON.id} 
              mostrarCantidadEntrada={false} 
              estaEnPerfil={false}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Flex justifyContent="center" alignItems="center" h="100%" flexDir="column" gap={10} mt="3rem">
          <Image src={errorFound} width={500} height={500}/>
          <Text color="white" fontSize="20px" fontWeight="bold">No se encontraron shows</Text>
        </Flex>
      )}
    </>
  )
}
export default BusquedaPage
