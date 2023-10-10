import React from 'react'

import { kebabCase } from 'lodash'

import {
  assertSummaryTable,
  assertLink,
} from '../../../../functional/cypress/support/assertions'
import {
  companyGlobalUltimateAllDetails,
  companyNoGlobalUltimateAllDetails,
  companyNoDetails,
} from '../../../../functional/cypress/fakers/companies'
import {
  ExportStatusDetails,
  latestExportWin,
  maximumTenCurrentExportCountries,
  maximumTenFutureInterestCountries,
  numberOfCurrentExportCountries,
  numberOfFutureInterestCountries,
  SUBSEGMENT,
} from '../../../../../src/apps/companies/apps/company-overview/overview-table-cards/ExportStatusCard'

function convertCountriesListToString(listOfCountries) {
  let appendValue = Array.from(listOfCountries.values()).map(
    (value) => value.name
  )
  return appendValue.join('')
}

function checkListOfCountriesLinks(listOfCountries, company_id, category) {
  for (let country in listOfCountries) {
    const formattedCountryName = kebabCase(
      listOfCountries[country].name.toLowerCase()
    )
    assertLink(
      `${category}-export-country-${formattedCountryName}-link`,
      `/companies/${company_id}/exports/history/${listOfCountries[country].id}`
    )
  }
}

describe('AccountManagementCard', () => {
  const Component = (props) => <ExportStatusDetails {...props} />
  context('When the company has no export details set', () => {
    beforeEach(() => {
      cy.mount(
        <Component
          company={companyNoDetails}
          latestExportWin={latestExportWin}
          numberOfCurrentExportCountries={numberOfCurrentExportCountries(
            companyNoDetails.exportCountries
          )}
          numberOfFutureInterestCountries={numberOfFutureInterestCountries(
            companyNoDetails.exportCountries
          )}
          maximumTenCurrentExportCountries={maximumTenCurrentExportCountries(
            companyNoDetails.exportCountries
          )}
          maximumTenFutureInterestCountries={maximumTenFutureInterestCountries(
            companyNoDetails.exportCountries
          )}
        />
      )
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'export-status-container',
        content: {
          'Export potential': 'Unavailable',
          'Export sub-segment': 'Not set',
          'Currently exporting to': 'Not set',
          'Future countries of interest': 'Not set',
          'Last export win': 'No export wins recorded',
          'Total exports won': '0',
        },
      })
    })
    it('should render link to the full export page', () => {
      assertLink(
        'export-status-page-link',
        `/companies/${companyNoDetails.id}/exports`
      )
    })
  })

  context(
    'When the company has export details set and more than 10 currently and future export countries',
    () => {
      beforeEach(() => {
        cy.mount(
          <Component
            company={companyGlobalUltimateAllDetails}
            latestExportWin={latestExportWin}
            numberOfCurrentExportCountries={numberOfCurrentExportCountries(
              companyGlobalUltimateAllDetails.exportCountries
            )}
            numberOfFutureInterestCountries={numberOfFutureInterestCountries(
              companyGlobalUltimateAllDetails.exportCountries
            )}
            maximumTenCurrentExportCountries={maximumTenCurrentExportCountries(
              companyGlobalUltimateAllDetails.exportCountries
            )}
            maximumTenFutureInterestCountries={maximumTenFutureInterestCountries(
              companyGlobalUltimateAllDetails.exportCountries
            )}
          />
        )
      })
      it('should render the right text', () => {
        assertSummaryTable({
          dataTest: 'export-status-container',
          content: {
            'Export potential': 'Unavailable',
            'Export sub-segment':
              SUBSEGMENT[companyGlobalUltimateAllDetails.exportSubSegment] +
              SUBSEGMENT[companyGlobalUltimateAllDetails.exportSubSegment],
            'Currently exporting to':
              convertCountriesListToString(
                maximumTenCurrentExportCountries(
                  companyGlobalUltimateAllDetails.exportCountries
                )
              ) + 'View 2 more',
            'Future countries of interest':
              convertCountriesListToString(
                maximumTenFutureInterestCountries(
                  companyGlobalUltimateAllDetails.exportCountries
                )
              ) + 'View 4 more',
            'Last export win': 'No export wins recorded',
            'Total exports won': '0',
          },
        })
      })
      it('should have links to any currently exporting to countries', () => {
        checkListOfCountriesLinks(
          maximumTenCurrentExportCountries(
            companyGlobalUltimateAllDetails.exportCountries
          ),
          companyGlobalUltimateAllDetails.id,
          'current'
        )
      })
      it('should have a link to more currently exporting to countries', () => {
        assertLink(
          'export-status-currently-exporting-to-link',
          `/companies/${companyGlobalUltimateAllDetails.id}/exports`
        )
      })
      it('should have links to any future exporting to countries', () => {
        checkListOfCountriesLinks(
          maximumTenFutureInterestCountries(
            companyGlobalUltimateAllDetails.exportCountries
          ),
          companyGlobalUltimateAllDetails.id,
          'future'
        )
      })
      it('should have a link to more future countries of interest', () => {
        assertLink(
          'export-status-future-exporting-to-link',
          `/companies/${companyGlobalUltimateAllDetails.id}/exports`
        )
      })
      it('should render link to the full export page', () => {
        assertLink(
          'export-status-page-link',
          `/companies/${companyGlobalUltimateAllDetails.id}/exports`
        )
      })
    }
  )

  context(
    'When the company has export details set and less than 10 currently and future export countries',
    () => {
      beforeEach(() => {
        cy.mount(
          <Component
            company={companyNoGlobalUltimateAllDetails}
            latestExportWin={latestExportWin}
            numberOfCurrentExportCountries={numberOfCurrentExportCountries(
              companyNoGlobalUltimateAllDetails.exportCountries
            )}
            numberOfFutureInterestCountries={numberOfFutureInterestCountries(
              companyNoGlobalUltimateAllDetails.exportCountries
            )}
            maximumTenCurrentExportCountries={maximumTenCurrentExportCountries(
              companyNoGlobalUltimateAllDetails.exportCountries
            )}
            maximumTenFutureInterestCountries={maximumTenFutureInterestCountries(
              companyNoGlobalUltimateAllDetails.exportCountries
            )}
          />
        )
      })
      it('should render the right text', () => {
        assertSummaryTable({
          dataTest: 'export-status-container',
          content: {
            'Export potential': 'Unavailable',
            'Export sub-segment':
              SUBSEGMENT[companyNoGlobalUltimateAllDetails.exportSubSegment] +
              SUBSEGMENT[companyNoGlobalUltimateAllDetails.exportSubSegment],
            'Currently exporting to': convertCountriesListToString(
              maximumTenCurrentExportCountries(
                companyNoGlobalUltimateAllDetails.exportCountries
              )
            ),
            'Future countries of interest': convertCountriesListToString(
              maximumTenFutureInterestCountries(
                companyNoGlobalUltimateAllDetails.exportCountries
              )
            ),
            'Last export win': 'No export wins recorded',
            'Total exports won': '0',
          },
        })
      })
      it('should have links to any currently exporting to countries', () => {
        checkListOfCountriesLinks(
          maximumTenCurrentExportCountries(
            companyNoGlobalUltimateAllDetails.exportCountries
          ),
          companyNoGlobalUltimateAllDetails.id,
          'current'
        )
      })
      it('should have links to any future exporting to countries', () => {
        checkListOfCountriesLinks(
          maximumTenFutureInterestCountries(
            companyNoGlobalUltimateAllDetails.exportCountries
          ),
          companyNoGlobalUltimateAllDetails.id,
          'future'
        )
      })
      it('should render link to the full export page', () => {
        assertLink(
          'export-status-page-link',
          `/companies/${companyNoGlobalUltimateAllDetails.id}/exports`
        )
      })
    }
  )
})
