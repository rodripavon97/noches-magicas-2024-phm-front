import { Button, Card, CardBody, Flex, Heading, Image, Stack, Text, Spinner, IconButton } from '@chakra-ui/react' 
import { useTranslation } from 'react-i18next'
import { theme } from '../../styles/styles'
import { FaPen } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa'
import dateFormat from '../../utils/formatDate'
import {  useNavigate } from 'react-router-dom'
import { useDeleteShow } from '../../hooks'
import { useMessageToast } from '../../hooks/useToast'
import { Show } from 'src/domain/Show'

interface CardAdminProps {
    show: Show
    onShowClick: (show: Show) => void
    actualizarData: () => void
    handlerEdit: () => void
    isSelected: boolean
}
const CardAdmin = ({ show, onShowClick,actualizarData, handlerEdit,isSelected }: CardAdminProps ) => {
    const { t } = useTranslation('commons')
    const navigate = useNavigate()
    const { deleteShow, deleting } = useDeleteShow()
    const { errorToast, successToast } = useMessageToast()

    const navigateToDetalle = () => {
        navigate(`/detalle-show/admin/${show.id}`)
    }

    const handleClickShow = () => {
        onShowClick(show) 
    } 
    const handleClickDelete = async () => {
        try {
            await deleteShow(show.id)
            successToast('Show eliminado con éxito')
            actualizarData()
        } catch (error) {
            errorToast(error)
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

                    <Flex direction="row" alignItems="center" gap={2} mb={4}>
                        {deleting ? (
                            <Spinner size="sm" color={theme.colors.brand.colorFourth} />
                        ) : (
                            <IconButton
                                aria-label="Eliminar show"
                                icon={<FaTrash />}
                                size="sm"
                                variant="ghost"
                                color={theme.colors.brand.colorFourth}
                                onClick={handleClickDelete}
                                isDisabled={deleting}
                            />
                        )}
                        <IconButton
                            aria-label="Editar show"
                            icon={<FaPen />}
                            size="sm"
                            variant="ghost"
                            color={theme.colors.brand.colorFourth}
                            onClick={handlerEdit}
                            isDisabled={deleting}
                        />
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
