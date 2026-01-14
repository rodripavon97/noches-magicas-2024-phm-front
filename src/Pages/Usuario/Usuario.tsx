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
            // Error al cargar entradas
        }
    }

    const getAmigos = async () => {
        try {
            const amigos = await usuarioService.getAmigos()
            setAmigos(amigos)
        } catch (error) {
            // Error al cargar amigos
        }
    }

    const getComentarios = async () => {
        try {
            const comentarios = await usuarioService.getComentarios()
            setComentarios(comentarios)
        } catch (error) {
            // Error al cargar comentarios
        }
    }

    const tabLoaders: Record<number, () => Promise<void>> = {
        0: getEntradas,
        1: getAmigos,
        2: getComentarios
    }

    const cargarContenido = async (tabIndex: number) => {
        const loader = tabLoaders[tabIndex]
        if (loader) {
            await loader()
        }
    }

    useOnInit(getEntradas)

    return(
        <>
            <Flex direction={{base: "column", sm: "row"}}>
                <UsuarioSidebar/>
                <Tabs w="70vw" onChange={(index) => cargarContenido(index)}>
                    <TabList>
                        <Tab>Entradas Compradas</Tab>
                        <Tab>Amigos</Tab>
                        <Tab>Comentarios</Tab>
                    </TabList>
                    <TabPanels flexDirection={{base: "column", sm: "row"}}>
                        <TabPanel> <UsuarioEntradas entradas={entradas} onComentarioPublicado={getEntradas}/> </TabPanel>
                        <TabPanel> <UsuarioAmigosComponent amigos={amigos}/> </TabPanel>
                        <TabPanel> <UsuarioComentarios comentarios={comentarios}/> </TabPanel>
                    </TabPanels>
                </Tabs>
            
            </Flex>
        </>
    )
}

export default UsuarioPage