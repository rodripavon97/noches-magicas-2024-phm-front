import { Grid } from "@chakra-ui/react"
import CardAmigo from '../Card/CardAmigo'
import { Usuario } from "src/domain/Usuario"
import { UsuarioAmigos } from "src/domain/UserAmigos"

export interface UsuarioAmigosProps {
    amigos: UsuarioAmigos[]
}

export const UsuarioAmigosComponent = ({ amigos }: UsuarioAmigosProps) => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap="1rem" placeItems="center">
            {amigos.map((amigo) => (<CardAmigo key={amigo.id} usuario={amigo}/>))}
        </Grid>
    )
}