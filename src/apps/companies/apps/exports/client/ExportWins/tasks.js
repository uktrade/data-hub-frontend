import axios from 'axios'
import { format } from '../../../../../../client/utils/date-utils'
import { currencyGBP } from '../../../../../../client/utils/number-utils'
import { GREEN, BLUE } from 'govuk-colours'

import { NOT_IMPLEMENTED } from './state'

function getBadges(win) {
  const badges = []

  if (win.hvc?.code) {
    badges.push({
      text: 'HVC',
      borderColour: BLUE,
    })
  }

  if (win.response?.confirmed) {
    badges.push({
      text: 'Confirmed',
      borderColour: GREEN,
    })
  }

  return badges
}

function getMetadata(win) {
  const { contact, officer } = win
  const metadata = [
    [
      'Lead officer',
      `${officer.name} (${officer.team.type} ${officer.team.sub_type})`,
    ],
    [
      'Company contact',
      `${contact.name} (${contact.job_title} - ${contact.email})`,
    ],
    ['Customer', win.customer],
    ['Type of export', win.business_type],
    [
      'Total export value',
      currencyGBP(win.value.export.total, {
        maximumSignificantDigits: 3,
      }),
    ],
    ['Type of win', win.name_of_export],
    ['Country exported to', win.country || 'Unknown'],
    ['Sector', win.sector],
  ]

  if (win.business_potential) {
    metadata.push(['Company type', win.business_potential])
  }

  if (win.response?.confirmed) {
    metadata.push(['Date confirmed', format(win.response.date)])
  }

  if (win.hvc) {
    metadata.push(['HVC name', `${win.hvc.code}: ${win.hvc.name}`])
  }

  return metadata.map(([label, value]) => ({ label, value }))
}

export function fetchExportWins({ companyId, companyName, activePage }) {
  const offset = activePage * 10 - 10
  const param = offset ? '?offset=' + offset : ''

  return axios
    .get(`/api-proxy/v4/company/${companyId}/export-win${param}`)
    .catch((e) => {
      if (e.response?.status === 501) {
        return { [NOT_IMPLEMENTED]: true }
      }

      if ([404, 500, 502].includes(e.response?.status)) {
        return Promise.reject(
          `We were unable to lookup Export Wins for ${companyName}, please try again later.`
        )
      }

      return Promise.reject(e.message)
    })
    .then((response) => {
      if (response[NOT_IMPLEMENTED]) {
        return response
      }

      const { data } = response
      return {
        count: data.count,
        results: data.results.map((win) => ({
          badges: getBadges(win),
          headingText: win.title,
          subheading: `Won on ${format(win.date)}`,
          metadata: getMetadata(win),
        })),
      }
    })
}
