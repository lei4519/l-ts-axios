import { Executor, Canceler, CancelTokenSource } from "../types"
import Cancel from "./Cancel"
interface ResolvePromise {
  (message?: Cancel): void
}
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(executor: Executor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })
    executor(message => {
      if (this.reason) return
      this.reason = new Cancel(message)
      resolvePromise(this.reason)
    })
  }
  throwIfRequested (): void {
    if (this.reason) {
      throw this.reason
    }
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => cancel = c)
    return {
      token,
      cancel
    }
  }
}