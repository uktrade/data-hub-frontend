const { DateUtils, NumberUtils } = require('data-hub-components')
const moment = require('moment')

const { assertKeyValueTable } = require('./assertions')

const urls = require('../../../../src/lib/urls')
const {
  STATUS_VALUES,
  LIKELIHOOD_VALUES,
} = require('../../../../src/apps/my-pipeline/client/constants')

function getItems(acc, item) {
  acc[item.value] = item
  return acc
}

function assertSummaryTable({ dataAutoId, caption, content }) {
  cy.get(`[data-auto-id="${dataAutoId}"]`)
    .find('caption')
    .should('contain', caption)

  assertKeyValueTable(dataAutoId, content)
}

const STATUS_ITEMS = STATUS_VALUES.reduce(getItems, {})
const LIKELIHOOD_ITEMS = Object.values(LIKELIHOOD_VALUES).reduce(getItems, {})

module.exports = {
  assertProjectDetails: function(item) {
    it('Should render project details', () => {
      const content = {
        'Project name': item.name,
        Company: {
          href: urls.companies.detail(item.company.id),
          name: item.company.name,
        },
        Status: STATUS_ITEMS[item.status].label,
      }

      if (item.likelihood_to_win) {
        content['Export win potential'] =
          LIKELIHOOD_ITEMS[item.likelihood_to_win].label
      }

      if (item.sector) {
        content['Export sector'] = item.sector.segment
      }

      if (item.contact) {
        content['Company contact'] = {
          name: item.contact.name,
          href: urls.contacts.details(item.contact.id),
        }
      }

      if (item.potential_value) {
        content['Potential export value'] = NumberUtils.currencyGBP(
          item.potential_value
        )
      }

      if (item.expected_win_date) {
        content['Expected date for win'] = moment(
          item.expected_win_date
        ).format('MMM Y')
      }

      content['Created on'] = DateUtils.format(item.created_on)

      if (item.archived) {
        content['Reason for archive'] = item.archived_reason
        content['Archived on'] = DateUtils.format(item.archived_on)
      }

      assertSummaryTable({
        dataAutoId: 'bodyMainContent',
        caption: 'Project details',
        content,
      })
    })
  },
}
