export const FILE_SIZES = {
  '1Mb': 1024 * 1024,
  '50Mb': 50 * 1024 * 1024,
  '5GB': 5000 * 1024 * 1024,
}

export const MAX_FILE_SIZE_ABBR = {
  production: '5GB',
  development: '50Mb',
  test: '1Mb',
}[process.env.NODE_ENV]

export const MAX_FILE_SIZE = FILE_SIZES[MAX_FILE_SIZE_ABBR]

export const MAX_FILE_SIZE_ERR_MSG = `File must be no larger than ${MAX_FILE_SIZE_ABBR}`
