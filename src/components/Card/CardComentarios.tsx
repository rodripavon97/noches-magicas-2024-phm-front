import { Avatar, Card, CardBody, Grid, GridItem, IconButton, Text, Icon } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { FaTrash } from "react-icons/fa"
import { FaStar } from "react-icons/fa"
import { useState } from "react"
import { usuarioService } from '../../services/usuarioService'
import { Comentario } from "src/domain/Comentario"

export interface CardComentarioProps {
    comentario: Comentario,
    estaEnPerfil: boolean
}
const CardComentario = ({comentario, estaEnPerfil}: CardComentarioProps) => {
    const [existeComentario, setExisteComentario] = useState(true)

    const quitarComentario = async () => {
        try {
            await usuarioService.borrarComentario(comentario.idShow)
            setExisteComentario(false)
        } catch (error) {
        }
    }

    if (existeComentario) {
        return (
            <Card bg={theme.colors.brand.colorSecundary} borderColor={theme.colors.brand.colorThrird} maxW="22rem">
                <CardBody >
                    <Grid templateColumns="0.5fr 3fr 1fr" columnGap="1rem" color="white">
                        <GridItem>
                            {estaEnPerfil ? (
                                <Avatar src={comentario.fotoBanda}/>
                            ) : (
                                <Avatar src={comentario.fotoUsuario}/>
                            )}
                        </GridItem>
                        <GridItem>
                            {estaEnPerfil ? (
                                <GridItem fontWeight="bold">Para: {comentario.nombreBanda}</GridItem>
                            ) : (
                                <GridItem fontWeight="bold">{comentario.nombreUsuario}</GridItem>
                            )}
                            <GridItem>{comentario.fecha}</GridItem> 
                        </GridItem>
                        <GridItem justifyContent={'flex-end'}>
                            <Icon aria-label="fav" as={FaStar}/> {comentario.puntuacion}
                            {estaEnPerfil ? (
                                <IconButton aria-label="delete" icon={<FaTrash/> } colorScheme="black" minWidth={"1.5rem"} onClick={quitarComentario}/>
                            ) : (
                                <></>
                            )}
                        </GridItem>
                    </Grid>
                    <Text color="white">{comentario.contenido}</Text>
                </CardBody>
            </Card>
        )
    }
}

export default CardComentario