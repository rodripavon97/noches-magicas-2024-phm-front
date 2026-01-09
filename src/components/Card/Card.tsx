import { theme } from '../../styles/styles'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  Image,
  Stack,
  Text,
  Tooltip,
  Wrap,
} from '@chakra-ui/react'
import { Show } from '../../domain/Show'
import UseUser from '../../hooks/useUser'
import ModalComentario from '../Comentario/ModalComentario'
import { showService } from '../../service/showService'

const CardShow = ( { show, mostrarCantidadEntrada, estaEnPerfil }: CardShowProps ) => {
  const navigate = useNavigate()
  const { isLoggedIn } = UseUser()
  const navigateToComprar = () => {
    if (isLoggedIn) {
      enviarLogs()
      navigate(`/detalle-show/${show.id}`);
    } else {
      navigate('/login');
    }

  }
  const enviarLogs = async () => {
    const usuarioString = localStorage.getItem('user');
    const usuario = JSON.parse(usuarioString);
    const body ={
      fecha: new Date().toISOString(),
      nombreAlojamiento: show.ubicacion,
      hora: new Date().toLocaleTimeString(),
      usuario: usuario,
    }
    await showService.registrarLogClick(show.id,usuario.id,body)
   

  }
  const formatDate = (date) => {
    const parsedDate = new Date(date)
    const day = parsedDate.getDate().toString().padStart(2, '0')
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
    return `${day}/${month}`
  }

  const formatPuntaje = (puntaje) => {
    return puntaje.toFixed(2)
  }


  return (
    <>

      <Card
        width={380}
        borderRadius="1rem 1rem 1rem 1rem"
        bg={theme.colors.brand.colorSecundary}
        borderColor={theme.colors.brand.borderColorCard}
        variant="outline"
      >
        <Image
          srcSet={show.imagen}
          alt="AC/DC Power Up Tour"
          borderRadius="1rem 1rem 1rem 1rem"
          w="100%"
          h="230px"
          objectFit="cover"
        />
        {
          mostrarCantidadEntrada ? (
            <>
              <Badge
                borderRadius="full"
                px="2"
                bg={theme.colors.brand.borderColorCard}
                color={theme.colors.brand.text}
                position="absolute"
                top="0"
                right="0"
                mt="1"
                mr="1"
              >
                X2
              </Badge>

            </>
          ) : (<>

          </>)

        }

        <CardBody p={1}>
          <Stack
            direction="row"
            justify="space-between"
            alignItems="center"
            color="white"
          >
            <Text fontSize="12px" fontWeight="400">
              {show.nombreBanda} - {show.nombreRecital}
            </Text>
            <HStack spacing={1} fontSize="12px">
              <FaStar color={theme.colors.brand.colorFourth} />
              <Text>{formatPuntaje(show.puntaje)}</Text>
              <Text>({show.comentariosTotales})</Text>
            </HStack>
          </Stack>
          <Stack
            direction="row"
            justify="space-between"
            alignItems="center"
            color="white"
          >
            <HStack spacing={1}>
              <Text fontSize="12px" fontWeight="bold">
                Ubicacion:
              </Text>
              <Text fontSize="12px" fontWeight="200">
                {show.ubicacion}
              </Text>
            </HStack>
            <HStack spacing={1} fontSize="14px">
              <Tooltip label={show.fecha.map(formatDate).join(', ')} placement="top-start">
                <Text>
                  Fechas:
                  {show.fecha.length === 1
                    ? formatDate(show.fecha[0])
                    : `${formatDate(show.fecha[0])} - ${formatDate(show.fecha[show.fecha.length - 1])}`}
                </Text>
              </Tooltip>
            </HStack>
          </Stack>
          {
            isLoggedIn && (
              <Wrap
                direction="row"
                justifyItems="center"
                alignItems="center"
                color="white"
                p={1}
              >
                {show.amigosQueVanAlShow.length > 0 ? (
                  <Wrap
                    direction="row"
                    justifyItems="center"
                    alignItems="center"
                    color="white"
                    p={1}
                  >
                    <Text fontSize="12px" fontWeight="400">
                      Asistieron al show
                    </Text>
                    <AvatarGroup
                      size="sm"
                      max={2}
                      borderColor={theme.colors.brand.colorFourth}
                      variant="solid"
                      spacing={1}
                    >
                      {show.amigosQueVanAlShow.map((data) => (
                        <Tooltip key={data.id} label={`${data.nombre} ${data.apellido}`} placement="top">
                          <AvatarGroup size='md' max={2} spacing={1}>
                            <Avatar src={data.foto} />
                          </AvatarGroup>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Wrap>
                ) : (
                  <Text color="white" h="61px" p={1} textAlign="center">
                    No asiste ningún amigo
                  </Text>
                )}

              </Wrap>
            )
          }

          <Stack
            direction="row"
            justify="space-between"
            alignItems="center"
            color="white"
            mb='4px'
            pr={1}
            pl={1}
          >
            {
              estaEnPerfil ? (
                <>
                  <Text fontSize="14px" fontWeight="600">
                    Precio pagado ${show.precioEntrada}
                  </Text>
                  {
                    show.estaAbierto ? (
                      <></>
                    ) : (
                      <ModalComentario entrada={show} />
                    )
                  }
                </>
              ) : (
                <>
                  <Text fontSize="14px" fontWeight="600">
                    Desde ${show.precioLocacionBarata} a ${show.precioLocacionCara}
                  </Text>
                  
                    <Button size="sm" bg={theme.colors.brand.colorFourth}
                      onClick={navigateToComprar}>
                      Comprar
                    </Button>
                  

                </>
              )
            }


          </Stack>
        </CardBody>
      </Card>
    </>
  )
}

export default CardShow

interface CardShowProps {
  show: Show
  mostrarCantidadEntrada: boolean
  estaEnPerfil: boolean
}

