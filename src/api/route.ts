import { axios } from '@/utils/request'

export function enableRoute(id: string) {
  return axios({
    url: '/api/v1/route/tables/' + id + '/enable',
    method: 'put'
  })
}
