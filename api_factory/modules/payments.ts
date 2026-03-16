import { GATEWAY_ENDPOINT } from '../axios.config'

export const payments_api = {
    getAll: () => GATEWAY_ENDPOINT.get('/payments'),
    initiate: (payload: any) => GATEWAY_ENDPOINT.post('/payments/initiate', payload),
    updateStatus: (reference: string, status: string) => GATEWAY_ENDPOINT.patch(`/payments/${reference}/status`, { status }),
}
