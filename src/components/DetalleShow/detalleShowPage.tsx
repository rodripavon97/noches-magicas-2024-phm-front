// ============================================
// COMPONENTE DETALLE SHOW - UI Pura
// ============================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react'
import CardFecha from '../Card/CardFecha'
import CardUbicacion from '../Card/CardUbicacion'
import CardComentario from '../Card/CardComentarios'
import { useNavigate, useParams } from 'react-router-dom'
import { FaLocationDot, FaPlus } from 'react-icons/fa6'
import { FaStar } from 'react-icons/fa'
import { theme } from '../../styles/styles'
import Form from '../Form/ModalForm'
import { ShowDetalle } from '../../domain/detalleShow'
import { useOnInit } from '../../hooks/useOnInit'
import { showService, usuarioService, authService } from '../../services'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'
import dateFormat from '../../utils/formatDate'
import timeFormat from '../../utils/formatHour'
import moment from 'moment'
import 'moment/locale/es'
import { ScoreFormatter } from '../../utils/scoreFormatter'

moment.updateLocale('es', {
  weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
})

export interface DetalleShowProps {
  isAdmin: boolean
}

export const DetalleShow = ({ isAdmin }: DetalleShowProps) => {
  const { t } = useTranslation('detalleShow')
  const [cantidades, setCantidades] = useState<number[]>([0, 0, 0])
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [showDetalle, setShow] = useState<ShowDetalle | null>(null)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null)
  const [funcion, setFuncion] = useState<number | null>(null)
  const toast = useToast()

  const getShowPorID = async () => {
    try {
      if (!id) return
      const ShowByID = await showService.getShowPorID(id)
      setShow(ShowByID)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const navigateToDashboard = async () => {
    try {
      if (!showDetalle) return
      const userId = authService.getUserId()
      if (!userId) {
        toast.error('Debes estar autenticado')
        return
      }
      await showService.sumarAListaEspera(showDetalle.id, userId)
      toast.success('Te avisaremos cuando haya una nueva función')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const navigate = useNavigate()

  const agregarToCarrito = async () => {
    if (funcion === null || funcion === undefined) {
      toast.error('Por favor selecciona una función')
      return
    }

    if (!showDetalle) return

    const ubicaciones = Array.from(showDetalle.ubicacionCosto.keys())
    const totalEntradas = cantidades.reduce((sum, cant) => sum + cant, 0)

    if (totalEntradas === 0) {
      toast.error('Por favor selecciona al menos una entrada')
      return
    }

    try {
      const userId = authService.getUserId()
      if (!userId) {
        toast.error('Debes estar autenticado')
        return
      }

      for (let i = 0; i < cantidades.length; i++) {
        if (cantidades[i] > 0 && ubicaciones[i]) {
          await agregarAlCarrito(userId, showDetalle.id, funcion, cantidades[i], ubicaciones[i])
        }
      }

      toast.success('Se ha agregado al carrito')
      navigate('/carrito')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const agregarAlCarrito = async (
    userId: string,
    idShow: string,
    funcion: number,
    cantidad: number,
    ubicacion: string
  ) => {
    const ubicacionString = ubicacion.toString()
    await usuarioService.agregarAlCarrito(userId, idShow, funcion, cantidad, ubicacionString as any)
  }


  const handleSubmitForm = async (formData: any) => {
    try {
      if (!showDetalle) return
      await showService.agregarNuevaFuncion(showDetalle.id, formData)
      toast.success('Función agregada exitosamente')
      getShowPorID()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleNumberInputChange = (value: number, ubicacionCosto: number) => {
    const precios = Array.from(showDetalle.ubicacionCosto.values())
    const index = precios.findIndex((i) => i == ubicacionCosto)
    
    if (index !== -1 && index < cantidades.length) {
      const nuevasCantidades = [...cantidades]
      nuevasCantidades[index] = value
      setCantidades(nuevasCantidades)
    }
  }


  const handleClickFuncion = (index: number) => {
    setSelectedCardIndex(selectedCardIndex === index ? null : index)
    setFuncion(index)
  }

  const formatoTitulo = (ubicacion: string) => {
    return ubicacion.replace(/([A-Z])/g, ' $1').trim()
  }

  useOnInit(getShowPorID)

  if (!showDetalle) {
    return <div>Cargando...</div>
  }

  return (
    <>
      <Grid templateRows="0.5fr 1.5fr 1fr" placeItems="center" h="46rem" p={5}>
        <Grid
          h="100%"
          w="100%">
          <Grid>
            <Heading fontSize="2rem" alignItems={'flex-start'}
                     w={'50%'}>{showDetalle.nombreBanda} - {showDetalle.nombreRecital}</Heading>
            <Flex />
            <Flex fontSize="1.3rem" justifyContent={'space-between'} w={'100%'}>

              <Flex fontWeight="bold" flexDirection={'row'} alignItems={'center'} gap={'0.5rem'}>
                <FaStar /> {ScoreFormatter.formatScore(showDetalle.puntaje)} - {showDetalle.cantidadComentario} opiniones
              </Flex>
              <Flex fontWeight="200" alignItems={'center'} gap={'0.5rem'}>
                <FaLocationDot /> {showDetalle.ubicacion}
              </Flex>
              <Flex fontWeight="200" alignItems={'center'}>
                {showDetalle.longitud && showDetalle.latitud && (
                  <span>
                Geolocalizacion: {showDetalle.longitud} - {showDetalle.latitud}
              </span>
                )}
              </Flex>
            </Flex>
          </Grid>
        </Grid>

        <Flex gap={0.5} width={'100%'}>
          <Flex width={'45%'}>
            <Image
              srcSet={showDetalle.fotoArtista}
              justifyContent={'flex-start'}
              objectFit="contain"
              margin={'0.2rem'}
              alt={showDetalle.fotoArtista}
            />
          </Flex>
          <Grid gridColumn={2} w="55%" marginLeft={'1rem'}>


            <React.Fragment>
              <Flex justifyContent={'Center'} gap={1} marginBottom={'1rem'} alignItems={'center'}>
                {showDetalle.fecha && showDetalle.fecha.map((fecha, index) => (
                  <CardFecha
                    key={index}
                    color={theme.colors.brand.colorDatePrimary}
                    selectedColor={theme.colors.brand.colorFourth}
                    width={150}
                    title={moment(fecha).format('dddd')}
                    text1={dateFormat(fecha)}
                    text2={showDetalle.hora ? timeFormat(showDetalle.hora[index]) : 'Hora no disponible'}
                    onClick={() => handleClickFuncion(index)}
                    disabled={isAdmin}

                  />
                ))}

                {
                  isAdmin ? (
                      showDetalle.allSouldOut && (
                        <Button size="sm" bg={theme.colors.brand.colorFourth} color={'white'} ml={5}
                                onClick={() => setIsOpen(true)}>
                          <FaPlus />
                        </Button>
                      )
                    ) :
                    (
                      <>
                      </>
                    )
                }
              </Flex>
            </React.Fragment>


            {isAdmin ? (
              <React.Fragment>
                <Flex flexDirection={'column'} width={'100%'}>
                  <Text>Entradas vendidas totales : {showDetalle.entradasVendidasTotales}</Text>
                  {showDetalle.entradasVendidasPorUbicacion && Array.from(showDetalle.entradasVendidasPorUbicacion.entries()).map(([ubicacion, cantidad]) => (
                    <Text key={ubicacion}> Entradas Vendidas
                      {formatoTitulo(ubicacion)} : {cantidad}
                    </Text>
                  ))}
                  <Text>Recaudacion total : {'$'.concat((showDetalle.totalRecaudado ? parseInt(showDetalle.totalRecaudado.toString()) : 0).toLocaleString())}</Text>
                  <Text>Costo total : ${showDetalle.totalCosto || 0}</Text>
                  <Text>Gente en espera : {showDetalle.usuarioEnEspera}</Text>
                </Flex>
              </React.Fragment>
            ) : (
              <>
                <Flex flexDirection={'column'}>
                  {showDetalle.ubicacionCosto && Array.from(showDetalle.ubicacionCosto.entries()).map(([ubicacion, costo]) => (

                    <CardUbicacion
                      key={ubicacion}
                      title={formatoTitulo(ubicacion)}
                      ubicacionCosto={costo as number}
                      onCardClick={handleNumberInputChange}
                    />))}
                </Flex>

                <Flex justifyContent={'flex-end'}>
                  {!showDetalle.funcionesDisponibles ? (
                    <Button
                      width={'40%'}
                      size="sm" bg={theme.colors.brand.colorFourth}
                      onClick={agregarToCarrito}
                    >
                      Agregar al pedido
                    </Button>
                  ) : (
                    <Button
                      width={'40%'}
                      size="sm" bg={theme.colors.brand.colorFourth}
                      onClick={navigateToDashboard}>
                      Avisarme nueva funcion
                    </Button>
                  )}
                </Flex>
              </>
            )}
          </Grid>
        </Flex>


        {
          isAdmin ? (
              <>
              </>
            ) :
            (
              <Flex flexDirection={'row'} width={'100%'} justifyContent={'space-around'}>
                {showDetalle.comentarios && showDetalle.comentarios.map((comentario, index) => (
                  <CardComentario key={`${comentario.idShow}-${index}-${comentario.nombreUsuario}`} comentario={comentario} estaEnPerfil={false} />))}
              </Flex>

            )
        }


        {isOpen && <Form isOpen={isOpen} onClose={() => setIsOpen(false)} title={'Agregar Función'}
                         text={showDetalle.nombreBanda + ' ' + showDetalle.nombreRecital} inputs={[
          { value: input1, type: 'date', name: 'fecha', label: 'Fecha' },
          { value: input2, type: 'time', name: 'hora', label: 'Hora' },
        ]} onSubmit={handleSubmitForm}
                         initialValues={{
                           fecha: '',
                           hora: '',
                         }} />}
      </Grid>

    </>
  )
}
export default DetalleShow

