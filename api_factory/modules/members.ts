import { GATEWAY_ENDPOINT } from '../axios.config'

export const members_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/members'),
    getOne: (id: string) => GATEWAY_ENDPOINT.get(`/members/${id}`),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/members/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/members/${id}`),
}
