import { AxiosRequestConfig, Method } from './types'

const defaults: AxiosRequestConfig = {
  method: 'GET',

  timeOut: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
}
const methodNoData: Method[] = ['GET', 'HEAD', 'OPTIONS', 'DELETE']
const methodWithData: Method[] = ['POST', 'PUT', 'PATCH']

methodNoData.forEach(key => {
  defaults.headers[key] = {}
})

methodWithData.forEach(key => {
  defaults.headers[key] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
