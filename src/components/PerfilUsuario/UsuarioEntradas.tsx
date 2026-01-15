import { Grid } from '@chakra-ui/react'
import CardShow from '../Card/Card'
import { Show } from 'src/domain/Show'

export interface Entradas {
  entradas: Show[]
  onComentarioPublicado?: () => void
}

export const UsuarioEntradas = ({ entradas, onComentarioPublicado }: Entradas) => {
  return (
    <Grid templateColumns={{sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)"}} gap="1rem" placeItems="center">
      {entradas.map((show) => (<CardShow show={show} key={show.id} mostrarCantidadEntrada={false} estaEnPerfil={true} onComentarioPublicado={onComentarioPublicado}/>))}
    </Grid>
  )
}