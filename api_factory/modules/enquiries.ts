import { GATEWAY_ENDPOINT } from '../axios.config'

export const enquiries_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/enquiries'),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/enquiries', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/enquiries/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/enquiries/${id}`),
}
