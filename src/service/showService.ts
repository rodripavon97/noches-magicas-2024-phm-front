import axios, { AxiosResponse } from 'axios'
import { Show } from '../domain/Show'
import { ShowDetalle } from '../domain/detalleShow'
import { ShowJSON, Ubicacion } from '../interface/interfaces'
import { REST_SERVER_URL } from './constant'

interface GetShowsParams {
    artista: string
    location: string
    conAmigos: boolean
}

interface GetShowsAdminParams {
    artista: string
    location: string
}

interface NuevaFuncionData {
    fecha: string
    hora: string
}

interface EditarShowData {
    nombreBanda: string
    nombreShow: string
}

class ShowService {

    async getShows({ artista, location, conAmigos }: GetShowsParams): Promise<Show[]> {
        const id = localStorage.getItem('userId')
        const showJSON$ = await axios.get<ShowJSON[]>(
            `${REST_SERVER_URL}/shows?artista=${artista || ''}&locacion=${location || ''}&id=${id || ''}&conAmigos=${conAmigos || ''}`
        )
        const show = showJSON$.data.map((showJSON) =>
            Show.fromJSON(showJSON),
        )
        return show
    }

    async getShowsAdmin({ artista, location }: GetShowsAdminParams): Promise<Show[]> {
        const id = localStorage.getItem('userId')
        const showsJSON$ = await axios.get<ShowJSON[]>(
            `${REST_SERVER_URL}/admin/shows?artista=${artista || ''}&locacion=${location || ''}&id=${id || ''}`)
        return showsJSON$.data.map((showDataAdmin) => Show.fromJSON(showDataAdmin))
    }

    async agregarCarrito(idShow: string, idEntrada: number, cantidad: number, ubi: Ubicacion): Promise<any> {
        console.log(ubi, "ubi")
        const id = localStorage.getItem('userId')

        const carritoJSON = await axios.post(
            `${REST_SERVER_URL}/agregar-carrito/${id}/${idShow}/${idEntrada}/${cantidad}/${ubi}`
        )
        return carritoJSON.data

    }

    async getShowPorID(id: string): Promise<ShowDetalle> {
        const showJSON = await axios.get(`${REST_SERVER_URL}/show-detalle/${id}`)
        return ShowDetalle.fromJSON(showJSON.data)
    }

    async agregarNuevaFuncion(showId: string, nuevaFuncion: NuevaFuncionData): Promise<any> {
        try {
            const payload = {
                fecha: nuevaFuncion.fecha,
                hora: nuevaFuncion.hora + ':00',
                estado: "PrecioBase"
            }
            const response = await axios.post(`${REST_SERVER_URL}/show/${showId}/nueva-funcion`, payload)
            return response.data
        } catch (error) {
            console.error('Error al agregar nueva función:', error)
            throw error
        }
    }
    
    async eliminarShow(id: string): Promise<any> {
        try {
            const response = await axios.delete(`${REST_SERVER_URL}/show/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al eliminar el show:', error)
            throw error
        }
    }

    async sumarAListaEspera(showId: string): Promise<void> {
        const id = localStorage.getItem('userId')
        await axios.post(`${REST_SERVER_URL}/show/${showId}/fila-espera/${id}`)
    }


    async editarShow(id: string, newData: EditarShowData): Promise<any> {
        try {
            const payload = {
                nombreBanda: newData.nombreBanda,
                nombreRecital: newData.nombreShow,
            }
            const response = await axios.patch(`${REST_SERVER_URL}/show/${id}`, payload)
            return response.data
        } catch (error) {
            console.error('Error al editar el show:', error)
            throw error
        }
    }

    async registrarLogClick(idShow: string, idUsuario: string, payload: any): Promise<any> {
        try {
            const response = await axios.post(`${REST_SERVER_URL}/show/${idShow}/log/${idUsuario}`, payload)
            return response.data
        } catch (error) {
            console.error('Error al registrar el log de clic:', error)
            throw error
        }
    }
}

export const showService = new ShowService()