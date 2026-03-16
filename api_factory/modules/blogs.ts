import { GATEWAY_ENDPOINT } from '../axios.config'

export const blogs_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/blogs'),
    create: (payload: any) => GATEWAY_ENDPOINT.post('/blogs', payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/blogs/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/blogs/${id}`),
}
