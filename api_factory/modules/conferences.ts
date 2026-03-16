import { GATEWAY_ENDPOINT } from '../axios.config'

export const conferences_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/conferences'),
    getOne: (id: string) => GATEWAY_ENDPOINT.get(`/conferences/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/conferences', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/conferences/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/conferences/${id}`),
}
