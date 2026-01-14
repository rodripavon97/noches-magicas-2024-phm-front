import { Button, Card, Container, HStack, SimpleGrid, Badge, Image, Stack, Text, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { usuarioService } from '../../service/usuarioService'
import { useOnInit } from '../../hooks/useOnInit.jsx'
import { useMessageToast } from '../../hooks/useToast'
import { theme } from 'src/styles/styles.js'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { Carrito } from '../../domain/Carrito'
import { DateFormatter } from '../../utils/dateFormatter'
import { ScoreFormatter } from '../../utils/scoreFormatter'

const CarritoPage = () => {
    const [shows, setShows] = useState([])
    const [showsAgrupados, setShowsAgrupados] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const { errorToast, successToast } = useMessageToast()

    const agruparShowsPorId = (showsData: Carrito[]) => {
        const grupos: Map<string, Carrito[]> = new Map()
        
        // Agrupar por idShow
        showsData.forEach(show => {
            if (!grupos.has(show.idShow)) {
                grupos.set(show.idShow, [])
            }
            grupos.get(show.idShow)!.push(show)
        })
        
        // Convertir a array y combinar información
        return Array.from(grupos.values()).map(grupo => {
            const showBase = grupo[0]
            const cantidadTotal = grupo.reduce((sum, item) => sum + item.sizeCarrito, 0)
            const precioTotal = grupo.reduce((sum, item) => sum + (item.precioEntrada * item.sizeCarrito), 0)
            
            return {
                ...showBase,
                ubicaciones: grupo.map(item => ({
                    ubicacion: item.ubicacion,
                    cantidad: item.sizeCarrito,
                    precio: item.precioEntrada
                })),
                cantidadTotal,
                precioTotal
            }
        })
    }

    const getCarrito = async () => {
        try {
            const showsData = await usuarioService.getCarrito()
            setShows(showsData)
            
            // Agrupar shows por ID
            const agrupados = agruparShowsPorId(showsData)
            setShowsAgrupados(agrupados)
            
            // Calcular el precio total considerando la cantidad de entradas por item
            const totalPrice = showsData.reduce((total, show) => 
                total + (show.precioEntrada * (show.sizeCarrito || 1)), 0)
            setTotalPrice(totalPrice)
        } catch (error) {
            // Error al cargar carrito
        }
    }

    const vaciarCarrito = async () => {
        try {
            await usuarioService.vaciarCarrito()
            await getCarrito()
            successToast('Carrito vaciado correctamente.')
        } catch (error) {
            errorToast(error)
        }
    }

    const navigate = useNavigate()

    const comprarEntradas = async () => {
        try {
            await usuarioService.comprarEntradas()
            await getCarrito()
            successToast('Compra realizada exitosamente.')
            navigate('/usuario')
        } catch (error){
            errorToast(error)
        }
    }

    useOnInit(getCarrito)

    return (
        <>
            <Container maxW='100vm' h='84vh' p='0' display='flex' flexDirection='column' justifyContent='space-between' mb="18vh">
                <SimpleGrid columns={3} placeItems='center' spacing={10} p={8} gap={5} mb='3rem'>
                    {showsAgrupados.map((show, index) => (
                        <CarritoItemCardAgrupada show={show} key={`${show.idShow}-${index}`} />
                    ))}
                </SimpleGrid>
                <Card bg={theme.colors.brand.colorSecundary} alignItems='end' color={theme.styles.global} fontWeight='bold' fontSize='20px' p='5px'>
                    Total: ${totalPrice}
                    <HStack mb='10px'>
                        <Button onClick={comprarEntradas} color={theme.styles.global} bg={theme.colors.brand.colorThrird}>
                            Continuar Pago
                        </Button>
                        {
                            shows.length > 0 && (
                                <Button onClick={vaciarCarrito} color={theme.styles.global} bg={theme.colors.brand.colorFourth}>
                                    Vaciar
                                </Button>
                            )
                        }
                    </HStack>
                </Card>
            </Container>
        </>
    )
}

// Componente para mostrar items del carrito agrupados por show
interface CarritoAgrupado extends Carrito {
    ubicaciones: Array<{
        ubicacion: string
        cantidad: number
        precio: number
    }>
    cantidadTotal: number
    precioTotal: number
}

const CarritoItemCardAgrupada = ({ show }: { show: CarritoAgrupado }) => {
    return (
        <Card
            width={380}
            borderRadius="1rem"
            bg={theme.colors.brand.colorSecundary}
            borderColor={theme.colors.brand.borderColorCard}
            variant="outline"
        >
            <Image
                srcSet={show.imagen}
                alt={`${show.nombreBanda} - ${show.nombreRecital}`}
                borderRadius="1rem 1rem 0 0"
                w="100%"
                h="230px"
                objectFit="cover"
            />
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
                fontSize="1rem"
                fontWeight="bold"
            >
                x{show.cantidadTotal}
            </Badge>
            
            <Stack p={2} color="white">
                <Flex justify="space-between" alignItems="center">
                    <Text fontSize="12px" fontWeight="400">
                        {show.nombreBanda} - {show.nombreRecital}
                    </Text>
                    <HStack spacing={1} fontSize="12px">
                        <FaStar color={theme.colors.brand.colorFourth} />
                        <Text>{ScoreFormatter.formatScore(show.puntaje)}</Text>
                        <Text>({show.comentariosTotales})</Text>
                    </HStack>
                </Flex>
                
                <Flex direction="column" gap={1} mt={2}>
                    <Text fontSize="12px" fontWeight="bold">Entradas por ubicación:</Text>
                    {show.ubicaciones.map((ubi, idx) => (
                        <Flex key={idx} justify="space-between" alignItems="center" pl={2}>
                            <Text fontSize="11px">
                                • {ubi.ubicacion} x{ubi.cantidad}
                            </Text>
                            <Text fontSize="11px" fontWeight="600">
                                ${ubi.precio * ubi.cantidad}
                            </Text>
                        </Flex>
                    ))}
                </Flex>
                
                <Text fontSize="12px" mt={1}>
                    Fechas: {show.fecha.length === 1
                        ? DateFormatter.formatToShortDate(show.fecha[0])
                        : `${DateFormatter.formatToShortDate(show.fecha[0])} - ${DateFormatter.formatToShortDate(show.fecha[show.fecha.length - 1])}`}
                </Text>
                
                <Flex justify="flex-end" alignItems="center" mt={2} pt={2} borderTop="1px solid" borderColor={theme.colors.brand.borderColorCard}>
                    <Text fontSize="16px" fontWeight="bold" color={theme.colors.brand.colorFourth}>
                        Total: ${show.precioTotal}
                    </Text>
                </Flex>
            </Stack>
        </Card>
    )
}

export default CarritoPage