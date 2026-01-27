// ============================================
// CARD ADMIN - Componente UI
// ============================================

import { Button, Card, CardBody, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { theme } from '../../styles/styles'
import { FaPen, FaTrash } from 'react-icons/fa'
import dateFormat from '../../utils/formatDate'
import { useNavigate } from 'react-router-dom'
import { showService } from '../../services'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'
import { Show } from '../../domain/Show'

interface CardAdminProps {
  show: Show
  onShowClick: (show: Show) => void
  actualizarData: () => void
  handlerEdit: () => void
  isSelected: boolean
}

const CardAdmin = ({
  show,
  onShowClick,
  actualizarData,
  handlerEdit,
  isSelected,
}: CardAdminProps) => {
  const { t } = useTranslation('commons')
  const navigate = useNavigate()
  const toast = useToast()

  const navigateToDetalle = () => {
    navigate(`/detalle-show/admin/${show.id}`)
  }

  const handleClickShow = () => {
    onShowClick(show)
  }

  const handleClickDelete = async () => {
    try {
      await showService.eliminarShow(show.id)
      toast.success('Show eliminado con éxito')
      actualizarData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

   
  

    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            width={{ base: '80%', sm: '50%' }}
            style={{
                border: `2px solid ${theme.colors.brand.colorFourth}`,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 0 15px orange` : 'none'
            }}
            onClick={handleClickShow}

        >
            <Image
                objectFit='cover'
                srcSet={show.imagen}
                maxW={{ base: '100%', sm: '200px' }}
                alt='Caffe Latte'
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                <CardBody >
                    <Heading size='md'>  {show.nombreBanda} - {show.nombreRecital}
                    </Heading>
                    <Text fontSize="12px" fontWeight="bold">
                        {t('ubication')}                    </Text>
                    <Text fontSize="12px" fontWeight="200">
                        {show.ubicacion}
                    </Text>
                    <Text> {t('dates')}: {show.fecha.length === 1
                        ? dateFormat(show.fecha[0])
                        : `${dateFormat(show.fecha[0])} - ${dateFormat(show.fecha[show.fecha.length - 1])}`}</Text>
                    <Text fontSize="15px" fontWeight="600">
                        {t('desde')} ${show.precioLocacionBarata} a ${show.precioLocacionCara}
                    </Text>
                </CardBody>
                <Flex direction="column" alignItems="center">

                    <Flex direction="row" alignItems="center" mb={4}>
                        <FaTrash color={theme.colors.brand.colorFourth} onClick={handleClickDelete} />
                        <FaPen color={theme.colors.brand.colorFourth} onClick={handlerEdit}/>

                    </Flex>

                    <Button size="sm" bg={theme.colors.brand.colorFourth} color={'white'} onClick={navigateToDetalle}>
                        {t('detail')}
                    </Button>
                </Flex>

            </Stack>
        </Card>

    )
} 

export default CardAdmin 
