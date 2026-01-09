import { Grid } from '@chakra-ui/react'
import CardShow from '../Card/Card'
import { Show } from 'src/domain/Show'

export interface Entradas {
  entradas: Show[]
}

export const UsuarioEntradas = ({ entradas }: Entradas) => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap="1rem" placeItems="center">
      {entradas.map((show) => (<CardShow show={show} key={show.id} mostrarCantidadEntrada={false} estaEnPerfil={true}/>))}
    </Grid>
  )
}