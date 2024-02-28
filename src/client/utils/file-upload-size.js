import config from '../config'

const fiftyMegabytes = 50 * 1024 * 1024
const fiveGigabytes = 5000 * 1024 * 1024

export const MAX_FILE_SIZE = config.isDev ? fiftyMegabytes : fiveGigabytes
export const MAX_FILE_SIZE_ERR_MSG = `File must be no larger than ${
  config.isDev ? '50Mb' : '5GB'
}`
