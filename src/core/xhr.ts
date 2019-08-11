import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/header'
import { createError } from './helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers, responseType, timeOut } = config
    const request = new XMLHttpRequest()
    request.open(method, url, true)
    if (responseType) {
      request.responseType = responseType
    }
    if (timeOut) {
      request.timeout = timeOut
    }
    request.onreadystatechange = e => {
      if (request.readyState !== 4) return
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }
    request.onerror = function handleError() {
      reject(createError(`Network Error`, config, null, request))
    }
    request.ontimeout = function handleError() {
      reject(createError(`Timeout Error`, config, 'ECONNABORTED', request))
    }
    Object.entries(headers).forEach(([key, val]) => {
      if (data === null && key.toLowerCase() === 'content-type') {
        delete headers[key]
      } else {
        request.setRequestHeader(key, val as string)
      }
    })
    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      const status = response.status
      if (status >= 200 && status < 300) {
        resolve(response)
      } else {
        reject(createError(`Timeout Error`, config, null, request, response))
      }
    }
  })
}
