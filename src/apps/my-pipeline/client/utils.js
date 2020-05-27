import urls from '../../../lib/urls'
import { STATUS_VALUES } from './constants'

const URL_MAP = STATUS_VALUES.reduce((acc, { value, url }) => {
  acc[value] = url
  return acc
}, {})

export function getPipelineUrl({ status } = {}) {
  return (URL_MAP[status] || urls.pipeline.index)()
}
