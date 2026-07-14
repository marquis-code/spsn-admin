import { GATEWAY_ENDPOINT } from '../axios.config'

export const digests_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/digests'),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/digests', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/digests/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/digests/${id}`),
}
