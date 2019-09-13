import dispatchRequest, { transformURL } from './dispatchRequest'
import {
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse,
  ResolveFn,
  RejectFn
} from '../types'
import { AxiosInterceptorManager } from './InterceptorManager'
import mergeConfig from './mergeConfig'
interface Interceptor {
  request: AxiosInterceptorManager<AxiosRequestConfig>
  response: AxiosInterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
  resolved: ResolveFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectFn
}
export default class Axios {
  interceptors: Interceptor
  defaults: AxiosRequestConfig
  constructor(initConfig: AxiosRequestConfig) {
    this.interceptors = {
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
    config = mergeConfig(this.defaults, config)
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    this.interceptors.request.forEach((interceptor: any) => {
      chain.unshift(interceptor)
    })
    this.interceptors.response.forEach((interceptor: any) => {
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
  getURI (config?: AxiosRequestConfig) {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }
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
