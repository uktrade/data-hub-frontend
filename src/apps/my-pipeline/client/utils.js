import urls from '../../../lib/urls'
import { URL_MAP } from './constants'

export function getPipelineUrl({ status } = {}) {
  return urls.pipeline[URL_MAP[status] || 'index']()
}
