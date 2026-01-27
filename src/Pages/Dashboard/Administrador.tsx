// ============================================
// PÁGINA ADMINISTRADOR - Dashboard Admin
// ============================================

import React, { useState, useEffect } from 'react'
import { Button, Divider, Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import FiltroBusqueda from '../../components/FiltroBusqueda/FiltroBusqueda'
import CardAdmin from '../../components/Card/CardAdmin'
import { FaPlus } from 'react-icons/fa'
import { theme } from '../../styles/styles'
import CardFecha from '../../components/Card/CardFecha'
import Form from '../../components/Form/ModalForm'
import { showService } from '../../services'
import { useOnInit } from '../../hooks'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'
import timeFormat from '../../utils/formatHour'
import dateFormat from '../../utils/formatDate'
import moment from 'moment'
import 'moment/locale/es'

moment.updateLocale('es', {
  weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
})

const Administrador = (isAdmin: any) => {
  const { t } = useTranslation('dashboard')
  const [shows, setShows] = useState([])
  const [artistaABuscar, setArtistaABuscar] = useState('')
  const [locacionABuscar, setLocacionABuscar] = useState('')
  const [showData, setShowData] = useState({})
  const [mostrarData, setMostrarData] = useState(false)
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [inputNombreBanda, setInputNombreBanda] = useState('')
  const [inputNombreRecital, setInputNombreRecital] = useState('')
  const [selectedShowId, setSelectedShowId] = useState(null)
  const toast = useToast()

  const getShows = async () => {
    try {
      const shows = await showService.getShowsAdmin({
        artista: artistaABuscar,
        location: locacionABuscar,
      })

      setShows(shows)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
  useEffect(() => {
    getShows()
  }, [])

  const handleSubmitForm = async (formData) => {
    await showService.agregarNuevaFuncion(showData.id, formData)
    getShows()

  }
  const handleSearchClick = () => {
    getShows()
  }

  const handleTextChangeLocation = (e) => {
    setLocacionABuscar(e.target.value)
  }

  const handleTextChangeArtista = (e) => {
    setArtistaABuscar(e.target.value)
  }
  const handleShowClick = (showData) => {
    setSelectedShowId(showData.id)
    setShowData(showData)
    setMostrarData(true)
  }
  const handleEditClick = () => {
    setInputNombreBanda(showData.nombreBanda)
    setInputNombreRecital(showData.nombreRecital)

    setIsEdit(true)
  }
  const handleSubmitFormShow = async (formData) => {
    await showService.editarShow(showData.id, formData).then(() => {
      toast.success('Show editado correctamente')
    }).catch(() => {
      toast.error('Error al editar show')
    })
    getShows()
  }
  useOnInit(getShows)

  const colorVentas = () => {
    if (showData.ventas < 1000000) {
      return theme.colors.brand.nullSoldOut // Rojo
    } else if (showData.ventas < 2000000) {
      return theme.colors.brand.semiSoldOut // Amarillo
    } else {
      return theme.colors.brand.soldOut // Verde
    }

  }
  const colorPersonasEnEspera = () => {
    if (showData.personasEnEspera < 100) {
      return theme.colors.brand.nullSoldOut // Rojo
    } else if (showData.personasEnEspera < 200) {
      return theme.colors.brand.semiSoldOut // Amarillo
    } else {
      return theme.colors.brand.soldOut // Verde
    }
  }

  const colorRentabilidad = () => {
    if (showData.rentabilidad < 50) {
      return theme.colors.brand.nullSoldOut // Rojo
    } else if (showData.rentabilidad < 70) {
      return theme.colors.brand.semiSoldOut // Amarillo
    } else {
      return theme.colors.brand.soldOut // Verde
    }
  }
  const colorSouldOut = () => {
    const totalFunciones = showData.fecha.length || 0
    const funcionesAgotadas = showData.souldOut || 0

    const porcentajeAgotadas = (funcionesAgotadas / totalFunciones) * 100

    if (porcentajeAgotadas < 20) {
      return theme.colors.brand.nullSoldOut // Rojo
    } else if (porcentajeAgotadas < 75) {
      return theme.colors.brand.semiSoldOut // Amarillo
    } else {
      return theme.colors.brand.soldOut // Verde
    }
  }


  const kpis = () => {

    return (<Flex alignItems="center" justifyContent="center" mb={30}>
      <CardFecha color={colorVentas} width={200} title={t('sales')} text1={'$'.concat(parseInt(showData.ventas).toLocaleString())} />
      <CardFecha color={colorPersonasEnEspera} width={200} title={t('waitingPeople')} text1={showData.personasEnEspera} />
      <CardFecha color={colorRentabilidad} width={200} title={t('rentability')} text1={typeof showData.rentabilidad === 'number' ? showData.rentabilidad.toFixed(0) + '%' : 0}

      />
      <CardFecha color={colorSouldOut} width={200} title={t('souldOut')} text1={showData.souldOut} />
    </Flex>)
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="center" mb="60px">
        <FiltroBusqueda isAdmin={true} clickSearch={handleSearchClick} changeArtistaText={handleTextChangeArtista} changeLocacionText={handleTextChangeLocation} />
      </Flex>
      <div style={{ height: '400px', overflowY: 'scroll' }}>
        <Flex
          mt={5} mb={2} alignItems="center" justifyContent="center" flexDir='column'
        >
          {
            shows.map((shows) => (
              <CardAdmin show={shows} key={shows.id} mostrarCantidadEntrada={false} onShowClick={handleShowClick} actualizarData={getShows} handlerEdit={handleEditClick} isSelected={shows.id === selectedShowId}/>
            ))
          }

        </Flex>
      </div>

      <Flex justifyContent="end" mb={5}>
        <Button size="sm" bg={theme.colors.brand.colorFourth} color={'white'} ml={5} >
          <FaPlus />
        </Button>
      </Flex>

      <Divider mb={5} />

      {mostrarData && (
        <Flex alignItems="center" justifyContent="center" mb={5}>
          {showData.
            // @ts-ignore
            fecha.map((fecha, index) => (
              // @ts-ignore

              <CardFecha key={index} color={theme.colors.brand.colorDatePrimary} width={150} title={moment(fecha).format('dddd')} text1={dateFormat(fecha)} text2={timeFormat(showData.hora[index])} />


            ))}
          
        {showData.puedeAgregarFuncion && (
          <Button size="sm" bg={theme.colors.brand.colorFourth} color={'white'} ml={5} onClick={() => setIsOpen(true)}>
            <FaPlus />
          </Button>)}
        </Flex>
      )}


      <Divider mb={5} />
      {mostrarData && kpis()}
      {isEdit && <Form isOpen={isEdit} onClose={() => setIsEdit(false)} title={'Editar Show'} text={showData.nombreBanda + ' ' + showData.nombreRecital}
        initialValues={{
          nombreBanda: inputNombreBanda,
          nombreShow: inputNombreRecital,
        }} inputs={[{ value: inputNombreBanda, type: 'text', name: 'nombreBanda', label: 'Nombre de la banda' }, { value: inputNombreRecital, type: 'text', name: 'nombreShow', label: 'Nombre del recital' },]} onSubmit={handleSubmitFormShow} />}

      {isOpen && <Form isOpen={isOpen} onClose={() => setIsOpen(false)} title={'Agregar Función'} text={showData.nombreBanda + ' ' + showData.nombreRecital} inputs={[
        { value: input1, type: 'date', name: 'fecha', label: 'Fecha' },
        { value: input2, type: 'time', name: 'hora', label: 'Hora' },
      ]} onSubmit={handleSubmitForm}
        initialValues={{
          fecha: '',
          hora: '',
        }} />}

    </>

  )
}

export default Administrador
