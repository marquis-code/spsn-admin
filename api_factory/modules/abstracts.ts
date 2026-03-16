import { GATEWAY_ENDPOINT } from '../axios.config'

export const abstracts_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/abstracts'),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/abstracts', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/abstracts/${id}`, payload),
}
