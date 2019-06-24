import { AxiosRequestConfig } from './types'

export default function xhr(config: AxiosRequestConfig): void {
  const { url = '', data = null, method = 'GET' } = config
  const request = new XMLHttpRequest()
  request.open(method.toUpperCase(), url, false)
  request.send(data)
}
