import { ResolveFn, RejectFn, Interceptor } from '../types'

export class AxiosInterceptorManager<T> {
  private interceptors: Set<Interceptor<T>>
  constructor() {
    this.interceptors = new Set()
  }
  use(resolved: ResolveFn<T>, rejectd?: RejectFn): Interceptor<T> {
    const interceptor = {
      resolved,
      rejectd
    }
    this.interceptors.add(interceptor)
    return interceptor
  }
  eject(interceptor: Interceptor<T>) {
    this.interceptors.delete(interceptor)
  }
  forEach(fn: any): void {
    this.interceptors.forEach(fn)
  }
}
