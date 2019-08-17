import dispatchRequest from './dispatchRequest'
import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolveFn,
  RejectFn
} from '../types'
import { AxiosInterceptorManager } from './InterceptorManager'
interface Interceptor {
  request: AxiosInterceptorManager<AxiosRequestConfig>
  response: AxiosInterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectFn
}
export default class Axios {
  interceptor: Interceptor
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.interceptor = {
      request: new AxiosInterceptorManager<AxiosRequestConfig>(),
      response: new AxiosInterceptorManager<AxiosResponse>()
    }
    this.defaults = initConfig
  }
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
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    this.interceptor.request.forEach((interceptor: any) => {
      chain.unshift(interceptor)
    })
    this.interceptor.response.forEach((interceptor: any) => {
      chain.unshift(interceptor)
    })
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
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
