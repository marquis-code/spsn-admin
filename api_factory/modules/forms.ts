import { GATEWAY_ENDPOINT } from '../axios.config'

export const forms_api = {
  async getAll() {
    return GATEWAY_ENDPOINT.get('/forms')
  },
  async getById(id: string) {
    return GATEWAY_ENDPOINT.get(`/forms/${id}`)
  },
  async create(data: any) {
    return GATEWAY_ENDPOINT.post('/forms', data)
  },
  async delete(id: string) {
    return GATEWAY_ENDPOINT.delete(`/forms/${id}`)
  },
  async getResponses(formId: string) {
    return GATEWAY_ENDPOINT.get(`/forms/${formId}/responses`)
  }
}
