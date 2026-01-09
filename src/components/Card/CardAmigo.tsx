import { Avatar, Card, CardBody, Grid, GridItem, IconButton } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { FaTrash } from "react-icons/fa"
import { useState } from "react"
import { usuarioService } from "../../service/usuarioService";
import { Usuario } from "src/domain/Usuario";
import { UsuarioAmigos } from "src/domain/UserAmigos";

interface CardAmigoProps {
    usuario: UsuarioAmigos
}
const CardAmigo = ({usuario}: CardAmigoProps) => {
    const [esAmigo, setEsAmigo] = useState(true)

    const quitarAmigo = async () => {
        try {
            await usuarioService.quitarAmigo(usuario.id)
            setEsAmigo(false)
        } catch (error) {
            console.log(error)
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
                            <IconButton aria-label="delete" icon={<FaTrash/>} colorScheme="black" variant="ghost" onClick={quitarAmigo}/>
                        </GridItem>
                    </Grid>
                </CardBody>
            </Card>
        )
    }
}

export default CardAmigo;