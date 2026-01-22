import Footer from '../../components/Footer/Footer'
import { UsuarioSidebar } from '../../components/PerfilUsuario/UsuarioSidebar'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner } from '@chakra-ui/react'
import { UsuarioEntradas } from '../../components/PerfilUsuario/UsuarioEntradas'
import { UsuarioAmigosComponent } from '../../components/PerfilUsuario/UsuarioAmigos'
import { UsuarioComentarios } from '../../components/PerfilUsuario/UsuarioComentarios'
import { useEffect } from "react"
import { usePurchasedTickets, useUserFriends, useUserComments, UseUser } from "../../hooks"
import { useMessageToast } from "../../hooks/useToast"
import { Show } from "../../domain/Show"
import { Usuario } from "../../domain/Usuario"
import { Comentario } from "../../domain/Comentario"

const UsuarioPage = () => {
    const { userId } = UseUser()
    const { errorToast } = useMessageToast()

    // Hooks de servicios
    const { tickets, loading: loadingEntradas, error: errorEntradas, refetch: refetchEntradas } = usePurchasedTickets(userId || 0)
    const { friends, loading: loadingAmigos, error: errorAmigos, refetch: refetchAmigos } = useUserFriends(userId || 0)
    const { comments, loading: loadingComentarios, error: errorComentarios, refetch: refetchComentarios } = useUserComments(userId || 0)

    // Mostrar errores con toast
    useEffect(() => {
        if (errorEntradas) errorToast(errorEntradas)
        if (errorAmigos) errorToast(errorAmigos)
        if (errorComentarios) errorToast(errorComentarios)
    }, [errorEntradas, errorAmigos, errorComentarios, errorToast])

    // Convertir tickets a Shows
    const entradas = tickets.map(ticket => Show.fromJSON(ticket))
    const amigos = friends.map(friend => Usuario.fromJSON(friend))
    const comentarios = comments.map(comment => Comentario.fromJSON(comment))

    const cargarContenido = async (tabIndex: number) => {
        const loaders = {
            0: refetchEntradas,
            1: refetchAmigos,
            2: refetchComentarios
        }
        const loader = loaders[tabIndex]
        if (loader) {
            await loader()
        }
    }

    useEffect(() => {
        if (userId) {
            refetchEntradas()
        }
    }, [userId, refetchEntradas])

    return(
        <>
            <Flex direction={{base: "column", sm: "row"}}>
                <UsuarioSidebar/>
                
                {/* Accordion para Mobile */}
                <Box display={{base: "block", md: "none"}} w={{base: "100%", sm: "70vw"}} p={4}>
                    <Accordion allowToggle>
                        <AccordionItem>
                            <AccordionButton onClick={() => cargarContenido(0)}>
                                <Box flex="1" textAlign="left" fontWeight="semibold">
                                    Entradas Compradas
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {loadingEntradas ? <Spinner /> : <UsuarioEntradas entradas={entradas} onComentarioPublicado={refetchEntradas}/>}
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton onClick={() => cargarContenido(1)}>
                                <Box flex="1" textAlign="left" fontWeight="semibold">
                                    Amigos
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {loadingAmigos ? <Spinner /> : <UsuarioAmigosComponent amigos={amigos}/>}
                            </AccordionPanel>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionButton onClick={() => cargarContenido(2)}>
                                <Box flex="1" textAlign="left" fontWeight="semibold">
                                    Comentarios
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                {loadingComentarios ? <Spinner /> : <UsuarioComentarios comentarios={comentarios}/>}
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>

                {/* Tabs para Desktop */}
                <Box display={{base: "none", md: "block"}} w="70vw">
                    <Tabs onChange={(index) => cargarContenido(index)}>
                        <TabList>
                            <Tab>Entradas Compradas</Tab>
                            <Tab>Amigos</Tab>
                            <Tab>Comentarios</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel> 
                                {loadingEntradas ? <Spinner /> : <UsuarioEntradas entradas={entradas} onComentarioPublicado={refetchEntradas}/>}
                            </TabPanel>
                            <TabPanel> 
                                {loadingAmigos ? <Spinner /> : <UsuarioAmigosComponent amigos={amigos}/>}
                            </TabPanel>
                            <TabPanel> 
                                {loadingComentarios ? <Spinner /> : <UsuarioComentarios comentarios={comentarios}/>}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            
            </Flex>
        </>
    )
}

export default UsuarioPage