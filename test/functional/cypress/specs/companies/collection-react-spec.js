import {
  getCollectionList,
  assertCollectionBreadcrumbs,
  assertAddItemButton,
  assertTag,
  assertRole,
  assertMetadataItem,
  assertListLength,
} from '../../support/collection-list-assertions'
import { collectionListRequest } from '../../support/actions'
import { companies } from '../../../../../src/lib/urls'

import { companyFaker, companyListFaker } from '../../fakers/companies'
import { UK_REGIONS } from '../../../../../src/common/constants'

describe('Company Collections - React', () => {
  const company1 = companyFaker({
    address: {
      line_1: 'Level 6, Avenue K Tower',
      line_2: '156 Jalan Ampang',
      town: 'Kuala Lumpur',
      postcode: '50450',
      country: {
        id: 'malaysia-123',
        name: 'Malaysia',
      },
    },
    sector: {
      id: 'b1959812-6095-e211-a939-e4115bead28a',
      name: 'Energy',
    },
    uk_region: null,
  })
  const company2 = companyFaker({
    trading_names: ['Company Corp', 'Company Ltd'],
    headquarter_type: {
      id: 'ukhq-id',
      name: 'ukhq',
    },
    is_global_headquarters: false,
    uk_region: {
      id: UK_REGIONS.LONDON,
      name: 'London',
    },
  })
  const company3 = companyFaker({
    address: {
      line_1: '123 Fake Street',
      line_2: 'Fake Borough',
      town: 'New York',
      postcode: '12345',
    },
    headquarter_type: {
      id: 'ghq-id',
      name: 'ghq',
    },
    is_global_headquarters: true,
    global_headquarters: {
      id: 'company-id',
      name: 'Company Ltd, New York',
    },
    uk_region: null,
  })
  const otherCompanies = companyListFaker(7)
  const companyList = [company1, company2, company3, ...otherCompanies]

  beforeEach(() => {
    collectionListRequest('v4/search/company', companyList, companies.index())
    getCollectionList()
    cy.get('@collectionItems').eq(1).as('secondListItem')
    cy.get('@collectionItems').eq(2).as('thirdListItem')
  })

  assertCollectionBreadcrumbs('Companies')

  it('should contain a status role', () => {
    assertRole('status')
  })

  it('should have a link to add company', () => {
    assertAddItemButton('Add company', '/companies/create')
  })

  it('should display a list of companies', () => {
    assertListLength(companyList)
  })

  it('should contain country tag', () => {
    assertTag('@firstListItem', 'Malaysia')
  })

  it('should contain company sector and primary address', () => {
    assertMetadataItem('@firstListItem', 'Energy')
    assertMetadataItem(
      '@firstListItem',
      'Level 6, Avenue K Tower, 156 Jalan Ampang, Kuala Lumpur, 50450, Malaysia'
    )
  })

  it('should contain trading names', () => {
    assertMetadataItem('@secondListItem', 'Company Corp, Company Ltd')
  })

  it('should contain UK HQ tag', () => {
    assertTag('@secondListItem', 'UK HQ')
  })

  it('should contain UK Region tag', () => {
    assertTag('@secondListItem', 'London, UK')
  })

  it('should contain Global HQ tag', () => {
    assertTag('@thirdListItem', 'Global HQ')
    assertMetadataItem('@thirdListItem', company3.global_headquarters.name)
  })
})
