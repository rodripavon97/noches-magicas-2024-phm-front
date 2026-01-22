import { Button, Card, Container, HStack, SimpleGrid, Badge, Image, Stack, Text, Flex, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useCart, UseUser } from '../../hooks'
import { useMessageToast } from '@hooks/useToast'
import { theme } from '../../styles/styles'
import { useNavigate } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { Carrito } from '../../domain/Carrito'
import { DateFormatter } from '../../utils/dateFormatter'
import { ScoreFormatter } from '../../utils/scoreFormatter'

const CarritoPage = () => {
    const { userId } = UseUser()
    const { cart, loading, clearCart, checkout, refetch } = useCart(userId || 0)
    const [showsAgrupados, setShowsAgrupados] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const { errorToast, successToast } = useMessageToast()
    const navigate = useNavigate()

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

    // Actualizar datos cuando cambie el carrito
    useEffect(() => {
        if (cart && cart.length > 0) {
            // Agrupar shows por ID
            const agrupados = agruparShowsPorId(cart)
            setShowsAgrupados(agrupados)
            
            // Calcular el precio total considerando la cantidad de entradas por item
            const totalPrice = cart.reduce((total, show) => 
                total + (show.precioEntrada * (show.sizeCarrito || 1)), 0)
            setTotalPrice(totalPrice)
        } else {
            setShowsAgrupados([])
            setTotalPrice(0)
        }
    }, [cart])

    // Cargar carrito al montar
    useEffect(() => {
        if (userId) {
            refetch()
        }
    }, [userId, refetch])

    const handleVaciarCarrito = async () => {
        try {
            await clearCart()
            successToast('Carrito vaciado correctamente.')
        } catch (error) {
            errorToast(error)
        }
    }

    const handleComprarEntradas = async () => {
        try {
            await checkout()
            successToast('Compra realizada exitosamente.')
            navigate('/usuario')
        } catch (error){
            errorToast(error)
        }
    }

    if (loading) {
        return (
            <Container maxW='100vm' minH='84vh' display='flex' justifyContent='center' alignItems='center'>
                <Spinner size='xl' color={theme.colors.brand.colorFourth} />
            </Container>
        )
    }

    return (
        <>
            <Container maxW='100vm' minH='84vh' p='0' display='flex' flexDirection='column' mb="18vh">
                <SimpleGrid columns={{base: 1, lg: 3}} placeItems='center' spacing={10} p={8} gap={5} mb='3rem' flex="1">
                    {showsAgrupados.length > 0 ? (
                        showsAgrupados.map((show, index) => (
                            <CarritoItemCardAgrupada show={show} key={`${show.idShow}-${index}`} />
                        ))
                    ) : (
                        <Text color="white" fontSize="lg" gridColumn="1 / -1">
                            No hay productos en el carrito
                        </Text>
                    )}
                </SimpleGrid>
                <Card 
                    bg={theme.colors.brand.colorSecundary} 
                    color={theme.styles.global} 
                    fontWeight='bold' 
                    fontSize={{base: '16px', md: '20px'}} 
                    p={{base: '15px', md: '5px'}}
                    position={{base: 'fixed', md: 'static'}}
                    bottom={{base: '60px', md: 'auto'}}
                    left="0"
                    right="0"
                    zIndex="10"
                    borderRadius={{base: '0', md: 'md'}}
                >
                    <Flex 
                        direction={{base: 'column', md: 'row'}} 
                        alignItems={{base: 'stretch', md: 'end'}} 
                        justifyContent="space-between"
                        gap={{base: 2, md: 0}}
                        width="100%"
                    >
                        <Text mb={{base: 2, md: 0}}>Total: ${totalPrice}</Text>
                        <HStack spacing={2} justifyContent={{base: 'center', md: 'flex-end'}}>
                            <Button 
                                onClick={handleComprarEntradas} 
                                color={theme.styles.global} 
                                bg={theme.colors.brand.colorThrird}
                                size={{base: 'sm', md: 'md'}}
                                flex={{base: 1, md: 'initial'}}
                                isDisabled={cart.length === 0 || loading}
                                isLoading={loading}
                            >
                                Continuar Pago
                            </Button>
                            {
                                cart.length > 0 && (
                                    <Button 
                                        onClick={handleVaciarCarrito} 
                                        color={theme.styles.global} 
                                        bg={theme.colors.brand.colorFourth}
                                        size={{base: 'sm', md: 'md'}}
                                        flex={{base: 1, md: 'initial'}}
                                        isLoading={loading}
                                    >
                                        Vaciar
                                    </Button>
                                )
                            }
                        </HStack>
                    </Flex>
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