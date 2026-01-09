import Footer from '../../components/Footer/Footer'
import { UsuarioSidebar } from '../../components/PerfilUsuario/UsuarioSidebar'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from '@chakra-ui/react'
import { UsuarioEntradas } from '../../components/PerfilUsuario/UsuarioEntradas'
import { UsuarioAmigosComponent } from '../../components/PerfilUsuario/UsuarioAmigos'
import { UsuarioComentarios } from '../../components/PerfilUsuario/UsuarioComentarios'
import { useState } from "react"
import { useOnInit } from "../../hooks/useOnInit"
import { usuarioService } from "../../service/usuarioService"

const UsuarioPage = () => {
    const [entradas, setEntradas] = useState([])
    const [amigos, setAmigos] = useState([])
    const [comentarios, setComentarios] = useState([])

    const getEntradas = async () => {
        try {
            const shows = await usuarioService.getEntradasCompradas()
            setEntradas(shows)
        } catch (error) {
            console.log(error)
        }
    }

    const getAmigos = async () => {
        try {
            const amigos = await usuarioService.getAmigos()
            setAmigos(amigos)
        } catch (error) {
            console.log(error)
        }
    }

    const getComentarios = async () => {
        try {
            const comentarios = await usuarioService.getComentarios()
            setComentarios(comentarios)
        } catch (error) {
            console.log(error)
        }
    }

    const cargarContenido = async (tabIndex) => {
        switch (tabIndex) {
            case 0: return await getEntradas()
            case 1: return await getAmigos()
            case 2: return await getComentarios()
        }
    }

    useOnInit(getEntradas)

    return(
        <>
            <Flex>
                <UsuarioSidebar/>
                <Tabs w="70vw" onChange={(index) => cargarContenido(index)}>
                    <TabList>
                        <Tab>Entradas Compradas</Tab>
                        <Tab>Amigos</Tab>
                        <Tab>Comentarios</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel> <UsuarioEntradas entradas={entradas}/> </TabPanel>
                        <TabPanel> <UsuarioAmigosComponent amigos={amigos}/> </TabPanel>
                        <TabPanel> <UsuarioComentarios comentarios={comentarios}/> </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
            <Flex mb={6}>
            <Footer/>
            </Flex>
        </>
    )
}

export default UsuarioPage