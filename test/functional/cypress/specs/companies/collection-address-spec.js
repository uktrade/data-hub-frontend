import {
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertMetadataItem,
} from '../../support/collection-list-assertions'
import { collectionListRequest } from '../../support/actions'
import { companies } from '../../../../../src/lib/urls'

import { companyFaker, companyListFaker } from '../../fakers/companies'

describe('Company Collection Address', () => {
  const usCompany = companyFaker({
    address: {
      line_1: '3525 Eastham Drive',
      line_2: '',
      town: 'Culver City',
      county: 'CA',
      postcode: '90232',
      area: {
        id: '81756b9a-5d95-e211-a939-e4115bead28b',
        name: 'California',
      },
      country: {
        id: '81756b9a-5d95-e211-a939-e4115bead28a',
        name: 'United States',
      },
    },
  })

  const otherCompanies = companyListFaker(9)
  const companyList = [usCompany, ...otherCompanies]

  beforeEach(() => {
    collectionListRequest('v4/search/company', companyList, companies.index())
    getCollectionList()
  })

  assertCollectionBreadcrumbs('Companies')

  it('should contain california displaying area for an US address', () => {
    assertMetadataItem(
      '@firstListItem',
      '3525 Eastham Drive, Culver City, CA, 90232, California, United States'
    )
  })
})
