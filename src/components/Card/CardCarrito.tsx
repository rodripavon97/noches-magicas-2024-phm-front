import {Button, Card, HStack} from "@chakra-ui/react"
import { theme } from "../../styles/styles"
import { Usuario } from "../../domain/Usuario"

export interface CardCarritoProps {
    usuario: Usuario
}
const CardCarrito = ({usuario}: CardCarritoProps) => {
    const precioTotalCarrito = usuario && usuario.precioTotalCarrito ? usuario.precioTotalCarrito : 0
    return(
        <Card

            bg={theme.colors.brand.colorSecundary}
            alignItems='end'

            color={theme.styles.global}
            fontWeight='bold'
            fontSize='20px'
            p='5px'
        >
            Total: ${precioTotalCarrito}

            <HStack mb='10px'>
                <Button color={theme.styles.global} bg={theme.colors.brand.colorThrird}>Continuar Pago</Button>
                <Button color={theme.styles.global} bg={theme.colors.brand.colorFourth}>Volver</Button>

            </HStack>
        </Card>
    )
}

export default CardCarrito