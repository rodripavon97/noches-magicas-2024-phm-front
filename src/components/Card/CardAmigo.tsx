import { Avatar, Card, CardBody, Grid, GridItem, IconButton } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { FaTrash } from "react-icons/fa"
import { useState } from "react"
import { useUserFriends, UseUser } from "../../hooks"
import { useMessageToast } from "../../hooks/useToast"
import { Usuario } from "src/domain/Usuario"
import { UsuarioAmigos } from "src/domain/UserAmigos"

interface CardAmigoProps {
    usuario: UsuarioAmigos
}
const CardAmigo = ({usuario}: CardAmigoProps) => {
    const [esAmigo, setEsAmigo] = useState(true)
    const [loading, setLoading] = useState(false)
    const { userId } = UseUser()
    const { removeFriend } = useUserFriends(userId || 0)
    const { errorToast, successToast } = useMessageToast()

    const quitarAmigo = async () => {
        setLoading(true)
        try {
            await removeFriend(usuario.id)
            setEsAmigo(false)
            successToast(`${usuario.nombre} ${usuario.apellido} eliminado de amigos`)
        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false)
        }
    }

    if (esAmigo) {
        return (
            <Card bg={theme.colors.brand.colorSecundary} borderColor={theme.colors.brand.colorThrird} maxW="22vw">
                <CardBody>
                    <Grid templateAreas={'"Avatar Nombre Delete" "Avatar Pais Delete"'} columnGap="1rem" color="white">
                        <GridItem area="Avatar">
                            <Avatar name={usuario.nombre + " " + usuario.apellido} src={usuario.foto}/>
                        </GridItem>
                        <GridItem area="Nombre" maxW="12vw">
                            <b>{usuario.nombre + " " + usuario.apellido}</b>
                        </GridItem>
                        <GridItem area="Pais">
                            Argentina
                        </GridItem>
                        <GridItem area="Delete">
                            <IconButton 
                                aria-label="delete" 
                                icon={<FaTrash/>} 
                                colorScheme="black" 
                                variant="ghost" 
                                onClick={quitarAmigo}
                                isLoading={loading}
                                isDisabled={loading}
                            />
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        )
    }
}

export default CardAmigo;