import { axios } from '@/utils/request'

export function fetch() {
  return axios({
    url: '/api/v1/dicts/map',
    method: 'get'
  })
}
