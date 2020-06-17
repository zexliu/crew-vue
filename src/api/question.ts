import { axios } from '@/utils/request'

export function enableTemplate(id: string) {
  return axios({
    url: '/api/v1/question/templates/' + id + '/enable',
    method: 'put'
  })
}
