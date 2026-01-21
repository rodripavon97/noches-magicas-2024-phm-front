import { useState } from 'react'
import { theme } from '../../styles/styles'
import { Center, Text, Input, Button, VStack, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { usuarioService } from '../../service/usuarioService'
import UseUser from "../../hooks/useUser"
import { useMessageToast } from '../../hooks/useToast'

const CardLoginShow = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const { login, setUser } = UseUser()
    const { errorToast, successToast } = useMessageToast()

    const intentoLogin = async() => {
        try {
            const usuario = await usuarioService.login(username, password)
            if (usuario) {
                login()
                setUser(usuario)
                successToast("Login Exitoso")
                navigate(usuario.esAdm ? "/dashboardAdm" : "/busqueda")
            }

        } catch (error) {
            errorToast(error)
        }
    }

    return (
        <Center h='80vh'>
            <Container bg={theme.colors.brand.colorPrimary}>
                <VStack alignItems="left">
                    <Text
                        alignSelf='center'
                        fontSize='50'
                        fontWeight='bold'
                        fontStyle='italic'
                        textShadow='5px 5px black'>
                        Noches Mágicas
                    </Text>
                    <Text>Usuario</Text>
                    <Input type="text" placeholder="Usuario" onChange={e => setUsername(e.target.value)} />
                    <Text>Contraseña</Text>
                    <Input type='password' placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
                    <Button w='15%' alignSelf="center" mt="5" p="5" bg={theme.colors.brand.colorFourth} onClick={intentoLogin}>
                        Ingresar
                    </Button>
                </VStack>
            </Container>
        </Center>
    )
}

export default CardLoginShow
