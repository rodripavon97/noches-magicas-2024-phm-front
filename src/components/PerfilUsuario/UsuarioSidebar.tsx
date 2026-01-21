// @ts-nocheck
import { Box, Button, Flex, Avatar, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Text } from "@chakra-ui/react"
import { theme } from '../../styles/styles'
import { useState, useEffect } from "react"
import { usuarioService } from "../../service/usuarioService"
import { Usuario } from "../../domain/Usuario"
import { useMessageToast } from "@hooks/useToast"
import UseUser from "@hooks/useUser"

export const UsuarioSidebar = () => {
    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [creditos, setCreditos] = useState()
    const { errorToast, successToast } = useMessageToast()
    const { setUser } = UseUser()

    const getDatosUsuario = async () => {
        try {
            setLoading(true)
            const datosUsuario = await usuarioService.getInfoUsuario()
            const usuarioObjeto = Usuario.fromJSON(datosUsuario)
            setUsuario(usuarioObjeto)
        } catch (error) {
            errorToast('Error al cargar datos del usuario')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDatosUsuario()
    }, [])
    
    const generarNuevoUsuario = (value) => {
        // Asegurarse de que fechaNacimiento sea un Date
        const fechaNacimiento = value.fechaNacimiento instanceof Date 
            ? value.fechaNacimiento 
            : new Date(value.fechaNacimiento)
        
        const nuevoUsuario = new Usuario(
            value.id,
            value.nombre,
            value.apellido,
            fechaNacimiento,
            value.fotoPerfil,
            value.username,
            value.esAdm,
            value.edad,
            value.saldo,
            value.dni,
            value.entradasCompradas || [],
            value.amigosDelUsuario || []
        )
        setUsuario(nuevoUsuario)
    }

    const cambiarNombre = (event) => {
        if (!usuario) return
        const usuarioActualizado = { ...usuario, nombre: event.target.value }
        generarNuevoUsuario(usuarioActualizado)
    }

    const cambiarApellido = (event) => {
        if (!usuario) return
        const usuarioActualizado = { ...usuario, apellido: event.target.value }
        generarNuevoUsuario(usuarioActualizado)
    }

    const enviarCambios = async () => {
        try {
            await usuarioService.editarDatos(usuario.nombre, usuario.apellido)
            successToast("Datos editados con éxito")
            
            const datosActualizados = await usuarioService.getInfoUsuario()
            const usuarioActualizado = Usuario.fromJSON(datosActualizados)
            
            setUsuario(usuarioActualizado)
            
            const usuarioPlano = Object.assign({}, {
                id: usuarioActualizado.id,
                nombre: usuarioActualizado.nombre,
                apellido: usuarioActualizado.apellido,
                fechaNacimiento: usuarioActualizado.fechaNacimiento instanceof Date 
                    ? usuarioActualizado.fechaNacimiento.toISOString() 
                    : usuarioActualizado.fechaNacimiento,
                fotoPerfil: usuarioActualizado.fotoPerfil,
                username: usuarioActualizado.username,
                esAdm: usuarioActualizado.esAdm,
                edad: usuarioActualizado.edad,
                saldo: usuarioActualizado.saldo,
                dni: usuarioActualizado.dni,
            })
            
            setUser(usuarioPlano)
        } catch (error) {
            errorToast(error)
        }
    }

    const sumarCredito = async () => {
        try {
            await usuarioService.sumarCredito(creditos)
            onClose()
            successToast("Saldo cargado correctamente")
            await getDatosUsuario()
        } catch (error) {
          errorToast(error)
        }
    }

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" w="30vw" padding="1rem" minH="50vh">
                <Text fontSize="xl">Cargando datos del usuario...</Text>
            </Flex>
        )
    }

    if (!usuario) {
        return (
            <Flex direction="column" align="center" justify="center" w="30vw" padding="1rem" minH="50vh">
                <Text fontSize="xl" color="red.500">Error al cargar usuario</Text>
                <Button mt={4} onClick={getDatosUsuario} bg={theme.colors.brand.colorFourth}>
                    Reintentar
                </Button>
            </Flex>
        )
    }

    return (
        <Flex direction="column" align="center" justify={{base: "center", lg: "space-evenly"}} w={{base: "100%", lg: "30vw"}} padding="1rem" paddingBottom="3rem" gap="1rem" maxHeight="100vh">
            <Avatar size="xl" name={usuario.username} src={usuario.fotoPerfil}/>
            
            <Flex direction="column" align={{"sm": "center", "lg": "start"}} width={{base: "100%", lg: "25vw"}} px={{base: "1rem", lg: "0"}}>
                <Text fontWeight="bold" mb={1}>Nombres</Text>
                <Input 
                    w="100%" 
                    onChange={cambiarNombre} 
                    value={usuario.nombre || ''} 
                    placeholder="Nombre"
                    mb={3}
                />
                
                <Text fontWeight="bold" mb={1}>Apellidos</Text>
                <Input 
                    w="100%" 
                    onChange={cambiarApellido} 
                    value={usuario.apellido || ''} 
                    placeholder="Apellido"
                    mb={3}
                />
                
                <Text fontWeight="bold" mb={1}>Fecha de Nacimiento</Text>
                <Input 
                    w="100%" 
                    type="date" 
                    disabled={true} 
                    value={usuario.fechaNacimiento instanceof Date ? usuario.fechaNacimiento.toISOString().split('T')[0] : usuario.fechaNacimiento}
                />
            </Flex>
            
            <Box fontSize="1.5rem">
                <b>Edad:</b> {usuario.edad || 0} años
            </Box>

            <Flex justify="center" width={{base: "100%", lg: "25vw"}} px={{base: "1rem", lg: "0"}}>
                <Button 
                    bgColor={theme.colors.brand.colorFourth} 
                    onClick={enviarCambios} 
                    width="100%" 
                    textColor={theme.colors.brand.text}
                >
                    Guardar Cambios
                </Button>
            </Flex>
            
            <Flex direction="column" align="start" width={{base: "100%", lg: "25vw"}} px={{base: "1rem", lg: "0"}}>
                <Text fontWeight="bold" mb={1}>DNI</Text>
                <Input 
                    w="100%" 
                    type="text" 
                    disabled={true} 
                    value={usuario.dni || ''} 
                    placeholder="Sin DNI registrado"
                    bg="gray.100"
                />
            </Flex>
            
            <Box fontSize="1.5rem">
                <b>Crédito:</b> ${usuario.saldo || 0}
            </Box>
            
            <Flex justify="center" width={{base: "100%", lg: "25vw"}} px={{base: "1rem", lg: "0"}}>
                <Button 
                    bgColor={theme.colors.brand.colorFourth} 
                    onClick={onOpen} 
                    width="100%" 
                    textColor={theme.colors.brand.text}
                >
                    Sumar Crédito
                </Button>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor={theme.colors.brand.colorPrimary}>
                    <ModalHeader>Sumar Crédito</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input 
                            type="number" 
                            onChange={e => setCreditos(e.target.value)} 
                            value={creditos}
                            placeholder="Monto a agregar"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button mr="3" bgColor={theme.colors.brand.colorFourth} onClick={sumarCredito}>
                            Confirmar
                        </Button>
                        <Button color={theme.colors.brand.colorFourth} variant='ghost' onClick={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}