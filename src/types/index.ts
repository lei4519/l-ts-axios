export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'patch'
  | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method: Method
  data?: any
  params?: any
  headers?: any
}
export interface AxiosInterceptorManager<T> {
  use(resolve: ResolveFn<T>, reject: RejectFn): Interceptor<T>
  eject(error: any): any
}
export interface Interceptor<T> {
  resolve: ResolveFn<T>
  reject?: RejectFn
}
export interface ResolveFn<T> {
  (val: T): T | Promise<T>
}
export interface RejectFn {
  (error: any): any
}
