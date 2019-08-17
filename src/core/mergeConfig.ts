import { AxiosRequestConfig, Method } from '../types'
import { isPlainObject } from '../helpers/utils'
interface Strat {
  [propName: string]: (
    val1: keyof AxiosRequestConfig,
    val2?: keyof AxiosRequestConfig
  ) => keyof AxiosRequestConfig
}

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2: AxiosRequestConfig = {}
): AxiosRequestConfig {
  const fromVal2List: Array<keyof AxiosRequestConfig> = ['url', 'params', 'data']
  const fromKeysList: Array<keyof AxiosRequestConfig> = ['headers']
  const strat: Strat = {
    default: function defaultStrat(val1, val2) {
      return val2 || val1
    }
  }
  fromVal2List.forEach((key: keyof AxiosRequestConfig) => {
    strat[key] = function fromVal2Strat(val1, val2) {
      return val2!
    }
  })
  fromKeysList.forEach((key: keyof AxiosRequestConfig) => {
    strat[key] = function deepStrat(val1, val2?): keyof AxiosRequestConfig {
      return isPlainObject(val2)
        ? deepMerge(val1, val2)
        : val2 !== void 0
        ? val2
        : isPlainObject(val1)
        ? deepMerge(val1)
        : val1
    }
  })
  const config: AxiosRequestConfig = Object.create(null)
  let key: keyof AxiosRequestConfig
  for (key in config2) {
    config[key] = (strat[key] || strat['default'])(config1[key], config2[key])
  }
  for (key in config1) {
    if (!config2[key]) {
      config[key] = (strat[key] || strat['default'])(config1[key])
    }
  }
  return config
}
