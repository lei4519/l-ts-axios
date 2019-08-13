import { ResolveFn, RejectFn, Interceptor } from '../types'

export class AxiosInterceptorManager<T> {
  private interceptors: Set<Interceptor<T>>
  constructor() {
    this.interceptors = new Set()
  }
  use(resolve: ResolveFn<T>, reject?: RejectFn): Interceptor<T> {
    const interceptor = {
      resolve,
      reject
    }
    this.interceptors.add(interceptor)
    return interceptor
  }
  eject(interceptor: Interceptor<T>) {
    this.interceptors.delete(interceptor)
  }
}
