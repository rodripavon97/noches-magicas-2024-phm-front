import { Avatar, Card, CardBody, Grid, GridItem, IconButton, Text, Icon } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { FaTrash } from "react-icons/fa"
import { FaStar } from "react-icons/fa"
import { useState } from "react"
import { useUserComments, UseUser } from '../../hooks'
import { useMessageToast } from '../../hooks/useToast'
import { Comentario } from "src/domain/Comentario"

export interface CardComentarioProps {
    comentario: Comentario,
    estaEnPerfil: boolean
}
const CardComentario = ({comentario, estaEnPerfil}: CardComentarioProps) => {
    const [existeComentario, setExisteComentario] = useState(true)
    const [loading, setLoading] = useState(false)
    const { userId } = UseUser()
    const { deleteComment } = useUserComments(userId || 0)
    const { errorToast, successToast } = useMessageToast()

    const quitarComentario = async () => {
        setLoading(true)
        try {
            await deleteComment(comentario.idShow)
            setExisteComentario(false)
            successToast('Comentario eliminado correctamente')
        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false)
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
                                <IconButton 
                                    aria-label="delete" 
                                    icon={<FaTrash/>} 
                                    colorScheme="black" 
                                    minWidth={"1.5rem"} 
                                    onClick={quitarComentario}
                                    isLoading={loading}
                                    isDisabled={loading}
                                />
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