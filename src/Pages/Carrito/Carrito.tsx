import { Button, Card, Container, HStack, SimpleGrid } from '@chakra-ui/react'
import CardShow from '../../components/Card/Card'
import { useState } from 'react'
import { usuarioService } from '../../service/usuarioService'
import { useOnInit } from '../../hooks/useOnInit.jsx'
import { useMessageToast } from '../../hooks/useToast'
import { theme } from 'src/styles/styles.js'
import { useNavigate } from 'react-router-dom'

const CarritoPage = () => {
    const [shows, setShows] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const { errorToast, successToast } = useMessageToast()

    const getCarrito = async () => {
        try {
            const showsData = await usuarioService.getCarrito()
            setShows(showsData)
            const totalPrice = showsData.reduce((total, show) => total + show.precioEntrada, 0)
            setTotalPrice(totalPrice)
        } catch (error) {
            console.log(error)
        }
    }

    const vaciarCarrito = async () => {
        try {
            await usuarioService.vaciarCarrito()
            await getCarrito()
            successToast('Carrito vaciado correctamente.')
        } catch (error) {
            console.log(error)
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
            console.log(error)
            errorToast(error)
        }
    }

    useOnInit(getCarrito)

    return (
        <>
            <Container maxW='100vm' h='84vh' p='0' display='flex' flexDirection='column' justifyContent='space-between' mb="18vh">
                <SimpleGrid columns={3} placeItems='center' spacing={10} p={8} gap={5} mb='3rem'>
                    {shows.map((show) => (
                        <CardShow show={show} key={show.id} mostrarCantidadEntrada={true} estaEnPerfil={true} />
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

export default CarritoPage