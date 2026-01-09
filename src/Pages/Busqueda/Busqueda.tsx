import { Flex, Image, SimpleGrid, Text } from '@chakra-ui/react'
import CardShow from '../../components/Card/Card'
import FiltroBusqueda from '../../components/FiltroBusqueda/FiltroBusqueda'
import { useState } from 'react'
import { showService } from '../../service/showService'
import { useOnInit } from '../../hooks/useOnInit'
import errorFound from '../../assets/error.svg'

const BusquedaPage = () => {
  const [show, setShows] = useState([])
  const [artistaABuscar, setArtistaABuscar] = useState('')
  const [locacionABuscar, setLocacionABuscar] = useState('')
  const [conAmigosFiltro, setConAmigosFiltros] = useState('')

  const getShows = async () => {
    try {
      const shows = await showService.getShows({
        artista: artistaABuscar,
        location: locacionABuscar,
        conAmigos: conAmigosFiltro === 'false',
      })
      setShows(shows)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchClick = () => {
    getShows()
  }

  const handleTextChangeLocation = (e) => {
    setLocacionABuscar(e.target.value)
  }

  const handleTextChangeArtista = (e) => {
    setArtistaABuscar(e.target.value)
  }

  const handleCheckAmigos = (e) => {
    setConAmigosFiltros(e.target.checked)
  }

  useOnInit(getShows)


  return (
    <>
      <FiltroBusqueda isAdmin={false} clickSearch={handleSearchClick} changeArtistaText={handleTextChangeArtista} changeLocacionText={handleTextChangeLocation} changeCheckboxAmigos={handleCheckAmigos}/>
     
        {show.length > 0 ? (
           <SimpleGrid columns={3} placeItems="center" spacing={10} p={8} gap={5} mb="3rem">
            {show.map((shows) => (
              <CardShow show={shows} key={shows.id} mostrarCantidadEntrada={false} estaEnPerfil={false}/>
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
