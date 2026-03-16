import { GATEWAY_ENDPOINT } from '../axios.config'

export const appointments_api = {
  async getAll() {
    return GATEWAY_ENDPOINT.get('/appointments')
  },
  async getById(id: string) {
    return GATEWAY_ENDPOINT.get(`/appointments/${id}`)
  },
  async update(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/appointments/${id}`, data)
  },
  async delete(id: string) {
    return GATEWAY_ENDPOINT.delete(`/appointments/${id}`)
  }
}
