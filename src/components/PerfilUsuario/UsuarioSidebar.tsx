// @ts-nocheck
import { Box, Button, Flex, Avatar, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { useState } from "react"
import { usuarioService } from "../../service/usuarioService"
import { useOnInit } from "../../hooks/useOnInit"
import { Usuario } from "../../domain/Usuario"
import { useMessageToast } from "src/hooks/useToast"
import UseUser from "src/hooks/useUser"

export const UsuarioSidebar = () => {
    const [usuario, setUsuario] = useState(new Usuario())
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [creditos, setCreditos] = useState()
    const { errorToast, successToast } = useMessageToast()
    const { setUser } = UseUser()

    const getDatosUsuario = async () => {
        const datosUsuario = await usuarioService.getInfoUsuario()
        setUsuario(datosUsuario)
    }

    useOnInit(getDatosUsuario)
    
    const generarNuevoUsuario = (value) => {
        const nuevoUsuario = Object.assign(new Usuario(), value)
        setUsuario(nuevoUsuario)
    }

    const cambiarNombre = (event) => {
        usuario.nombre = event.target.value
        generarNuevoUsuario(usuario)
    }

    const cambiarApellido = (event) => {
        usuario.apellido = event.target.value
        generarNuevoUsuario(usuario)
    }

    const enviarCambios = async () => {
        try {
            await usuarioService.editarDatos(usuario.nombre, usuario.apellido)
            successToast("Datos editado con exito")
            getDatosUsuario()
            setUser(usuario)
        } catch (error) {
            errorToast(error)
        }
    }

    const sumarCredito = async () => {
        try {
            await usuarioService.sumarCredito(creditos)
            onClose()
            successToast("Saldo cargado correctamente")
            getDatosUsuario()
            
        } catch (error) {
          errorToast(error)
        }
    }

    return (
        <Flex direction="column" align="center" justify="space-evenly" w="30vw" padding="1rem" paddingBottom="3rem" gap="1rem" maxHeight="100vh">
            <Avatar size="xl" name={usuario.username} src={usuario.fotoPerfil}/>
            <Flex direction="column" align="start">
                Nombres
                <Input w="25vw" onChange={cambiarNombre} value={usuario.nombre}/>
                Apellidos
                <Input w="25vw" onChange={cambiarApellido} value={usuario.apellido}/>
                Fecha de Nacimiento
                <Input w="25vw" type="date" disabled={true} value={usuario.fechaNacimiento}/>
            </Flex>
            <Box fontSize="1.5rem"><b>Edad:</b> {usuario.edad} años</Box>
            <Button bgColor={theme.colors.brand.colorFourth} onClick={enviarCambios}>Guardar Cambios</Button>
            <Flex direction="column" align="start">
                DNI
                <Input w="25vw" type="number" disabled={true} value={usuario.dni}/>
            </Flex>
            <Box fontSize="1.5rem"><b>Crédito:</b> ${usuario.saldo}</Box>
            <Button bgColor={theme.colors.brand.colorFourth} onClick={onOpen}>Sumar Crédito</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={theme.colors.brand.colorPrimary}>
                    <ModalHeader>Sumar Credito</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input type="number" onChange={e => setCreditos(e.target.value)} value={creditos}></Input>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr="3" bgColor={theme.colors.brand.colorFourth} onClick={sumarCredito}>Confirmar</Button>
                        <Button color={theme.colors.brand.colorFourth} variant='ghost' onClick={onClose}>Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}