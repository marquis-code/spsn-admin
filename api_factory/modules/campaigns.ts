import { GATEWAY_ENDPOINT } from '../axios.config';

export const campaigns_api = {
  broadcast: (payload: { type: string; data: any }) => {
    return GATEWAY_ENDPOINT.post('/campaigns/broadcast', payload);
  },
};
