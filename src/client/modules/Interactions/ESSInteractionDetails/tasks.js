import axios from 'axios'

import urls from '../../../../lib/urls'
import { transformResponseToESSInteractionDetails } from './transformers'

export const getESSInteractionDetails = (essId) =>
  Promise.all([
    axios.get(urls.interactions.exportSupportService.detailsData(essId)),
  ])
    .then(([{ data }]) => ({
      ...transformResponseToESSInteractionDetails(data),
    }))
    .catch(() => Promise.reject('Unable to load Export Support details.'))
