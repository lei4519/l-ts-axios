import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      headers = {},
      responseType,
      timeOut,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config
    const request = new XMLHttpRequest()
    request.open(method, url!, true)
    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function configureRequest() {
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
      if (responseType) {
        request.responseType = responseType
      }
      if (timeOut) {
        request.timeout = timeOut
      }
    }
    function addEvents() {
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
    }
    function processHeaders() {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName && xsrfHeaderName) {
        const xsrfVal = cookie.read(xsrfCookieName)
        if (xsrfVal) {
          headers[xsrfHeaderName] = xsrfVal
        }
      }
      if (auth) {
        headers.Authorization = `Basic ${btoa(auth.username)}:${btoa(auth.password)}`
      }
      Object.entries(headers).forEach(([key, val]) => {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          request.setRequestHeader(key, val as string)
        }
      })
    }
    function processCancel() {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }
    function handleResponse(response: AxiosResponse): void {
      const status = response.status
      if (validateStatus!(status)) {
        resolve(response)
      } else {
        reject(
          createError(`Request failed with status code ${status}`, config, null, request, response)
        )
      }
    }
  })
}
