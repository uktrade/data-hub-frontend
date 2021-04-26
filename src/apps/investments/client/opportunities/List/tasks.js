import { apiProxyAxios } from '../../../../../client/components/Task/utils'

const { investments } = require('../../../../../lib/urls')
const { format, parseISO } = require('date-fns')

const { DATE_LONG_FORMAT } = require('../../../../../common/constants')

export function getOpportunities() {
  return apiProxyAxios
    .get('/v4/large-capital-opportunity')
    .then(({ data } = data) => {
      const getArrayNames = (data) => data.map((d) => d.name)
      function transformInvestmentOpportunitiesList({
        name,
        id,
        uk_region_locations,
        created_on,
      }) {
        const locationNames = getArrayNames(uk_region_locations)
        return {
          headingText: name,
          headingUrl: investments.opportunities.details(id),
          itemId: id,
          badges: locationNames.length
            ? locationNames.length === 1
              ? [{ text: locationNames[0] }]
              : [{ text: 'Multiple UK sites' }]
            : [],
          metadata: [
            {
              label: 'Updated on',
              value: format(new Date(parseISO(created_on)), DATE_LONG_FORMAT),
            },
          ],
        }
      }
      return {
        count: data.count,
        results: data.results.map(transformInvestmentOpportunitiesList),
      }
    })
}
