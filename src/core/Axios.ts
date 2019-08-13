import dispatchRequest from './dispatchRequest'
import { AxiosPromise, AxiosRequestConfig, Method } from '../types'

export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {
          method: 'GET'
        }
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }
  get = this._requestMethodWithoutData('GET')
  delete = this._requestMethodWithoutData('DELETE')
  options = this._requestMethodWithoutData('OPTIONS')
  head = this._requestMethodWithoutData('HEAD')
  post = this._requestMethodWithData('POST')
  put = this._requestMethodWithData('PUT')
  patch = this._requestMethodWithData('PATCH')

  _requestMethodWithoutData(method: Method) {
    return (url: string, config?: AxiosRequestConfig): AxiosPromise => {
      return this.request(
        Object.assign(config || {}, {
          method,
          url
        })
      )
    }
  }
  _requestMethodWithData(method: Method) {
    return (url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise => {
      return this.request(
        Object.assign(config || {}, {
          method,
          data,
          url
        })
      )
    }
  }
}
