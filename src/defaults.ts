import { AxiosRequestConfig, Method } from './types'
import { flattenHeaders, processHeaders } from './helpers/header'
import { transformRequest, transformResponse } from './helpers/data'

const defaults: AxiosRequestConfig = {
  method: 'GET',

  timeOut: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  transformRequest: [
    function(data: any, headers?: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
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
