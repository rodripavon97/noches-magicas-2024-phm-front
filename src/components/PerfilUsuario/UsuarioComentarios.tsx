import { Grid } from "@chakra-ui/react"
import CardComentario from "../Card/CardComentarios"
import { Comentario } from "src/domain/Comentario"

export interface Comentarios {
  comentarios: Comentario[]
}

export const UsuarioComentarios = ({ comentarios }: Comentarios) => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap="1rem" placeItems="center">
            {comentarios.map((comentario) => (<CardComentario key={comentario.idShow} comentario={comentario} estaEnPerfil={true}/>))}
        </Grid>
    )
}