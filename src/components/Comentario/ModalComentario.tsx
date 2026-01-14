import {
Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
Button, Textarea, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Box, Icon, Flex,
} from '@chakra-ui/react'
import { theme } from '../../styles/styles'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { usuarioService } from "../../service/usuarioService"
import { useMessageToast } from '../../hooks/useToast'
import { Show } from 'src/domain/Show'


const ModalComentario = ({ entrada, onComentarioPublicado }: ModalComentarioProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [contenido, setContenido] = useState("")
    const [puntuacion, setPuntuacion] = useState(0)
    const { errorToast, successToast } = useMessageToast()

    const enviarComentario = async () => {
        try {
            await usuarioService.dejarComentario(entrada.idShow, entrada.id, contenido, puntuacion)
            successToast("Comentario publicado")
            onClose()
            setContenido("")
            setPuntuacion(0)
            // Notificar al componente padre que se publicó un comentario
            if (onComentarioPublicado) {
                onComentarioPublicado()
            }
        } catch (error) {
            errorToast(error)
        }
    }

    return(
        <>
            <Button size="sm" bg={theme.colors.brand.colorFourth} textColor={theme.colors.brand.text}
                onClick={onOpen}>
                Dejar Comentario
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={theme.colors.brand.colorPrimary}>
                    <ModalHeader>Dejar comentario para {entrada.nombreBanda} - {entrada.nombreRecital}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center">
                            <Textarea onChange={e => setContenido(e.target.value)} value={contenido} placeholder="Comentario" marginBottom="1rem"></Textarea>
                            <Slider defaultValue={0} min={0} max={5} step={0.25} maxWidth="20rem" onChangeEnd={(val) => setPuntuacion(val)}>
                                <SliderMark value={0} mt='0.5rem'>0 </SliderMark>
                                <SliderMark value={1} mt='0.5rem'>1 </SliderMark>
                                <SliderMark value={2} mt='0.5rem'>2 </SliderMark>
                                <SliderMark value={3} mt='0.5rem'>3 </SliderMark>
                                <SliderMark value={4} mt='0.5rem'>4 </SliderMark>
                                <SliderMark value={5} mt='0.5rem'>5 </SliderMark>
                                <SliderTrack bg={theme.colors.brand.colorSecundary}>
                                    <SliderFilledTrack bg={theme.colors.brand.colorFourth} />
                                </SliderTrack>
                                <SliderThumb boxSize={6}>
                                    <Box color={theme.colors.brand.colorFourth} as={FaStar} />
                                </SliderThumb>
                            </Slider>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr="3" bgColor={theme.colors.brand.colorFourth} onClick={enviarComentario}>Publicar comentario</Button>
                        <Button color={theme.colors.brand.colorFourth} variant='ghost' onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalComentario

export interface ModalComentarioProps {
    entrada: Show
    onComentarioPublicado?: () => void
}