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
import { useAuth } from '../../hooks'
import ModalComentario from '../Comentario/ModalComentario'
import { DateFormatter } from '../../utils/dateFormatter'
import { ScoreFormatter } from '../../utils/scoreFormatter'
import { loggingService } from '../../services'

const CardShow = ( { show, mostrarCantidadEntrada, estaEnPerfil, onComentarioPublicado }: CardShowProps ) => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  
  const navigateToComprar = async () => {
    if (isLoggedIn) {
      await loggingService.registrarClickEnShow(show.id, show.ubicacion)
      navigate(`/detalle-show/${show.id}`)
    } else {
      navigate('/login')
    }
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
              <Text>{ScoreFormatter.formatScore(show.puntaje)}</Text>
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
              <Tooltip label={show.fecha.map(DateFormatter.formatToShortDate).join(', ')} placement="top-start">
                <Text>
                  Fechas:
                  {show.fecha.length === 1
                    ? DateFormatter.formatToShortDate(show.fecha[0])
                    : `${DateFormatter.formatToShortDate(show.fecha[0])} - ${DateFormatter.formatToShortDate(show.fecha[show.fecha.length - 1])}`}
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
                      <ModalComentario entrada={show} onComentarioPublicado={onComentarioPublicado} />
                    )
                  }
                </>
              ) : (
                <>
                  <Text fontSize="14px" fontWeight="600">
                    Desde ${show.precioLocacionBarata} a ${show.precioLocacionCara}
                  </Text>
                  
                    <Button size="sm" bg={theme.colors.brand.colorFourth}
                      textColor={theme.colors.brand.text}
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
  onComentarioPublicado?: () => void
}

