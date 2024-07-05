import {
  getCollectionList,
  assertBadge,
  assertMetadataItem,
  assertListLength,
} from '../../support/collection-list-assertions'
import { assertCompanyBreadcrumbs } from '../../support/assertions'
import { collectionListRequest } from '../../support/actions'
import urls from '../../../../../src/lib/urls'

import { companyFaker, companyListFaker } from '../../fakers/companies'
import { company } from '../../fixtures'
import { UK_REGIONS } from '../../../../../src/common/constants'

const testCompany = company.minimallyMinimalLtd
const companyWithGlobalHQ = company.ukCompany

describe('Link Global HQ', () => {
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
    headquarter_type: {
      id: 'ghq-id',
      name: 'ghq',
    },
    is_global_headquarters: true,
    sector: {
      id: 'b1959812-6095-e211-a939-e4115bead28a',
      name: 'Energy',
    },
    company_number: '12345678',
    name: 'Global HQ Test Company',
  })
  const company2 = companyFaker({
    trading_names: ['Company Corp', 'Company Ltd'],
    headquarter_type: {
      id: 'ghq-id',
      name: 'ghq',
    },
    is_global_headquarters: true,
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

  context('should render the Global HQ list', () => {
    beforeEach(() => {
      collectionListRequest(
        'v4/search/company',
        companyList,
        urls.companies.hierarchies.ghq.link(testCompany.id)
      )
      getCollectionList()
      cy.get('@collectionItems').eq(1).as('secondListItem')
      cy.get('@collectionItems').eq(2).as('thirdListItem')
    })

    assertCompanyBreadcrumbs(
      testCompany.name,
      urls.companies.detail(testCompany.id),
      'Link Global HQ'
    )

    it('should display a list of companies', () => {
      assertListLength(companyList)
    })

    it('should contain country badge', () => {
      assertBadge('@firstListItem', 'Malaysia')
    })

    it('should contain company sector and primary address', () => {
      assertMetadataItem('@firstListItem', 'Energy')
      assertMetadataItem(
        '@firstListItem',
        'Level 6, Avenue K Tower, 156 Jalan Ampang, Kuala Lumpur, 50450, Malaysia'
      )
    })

    it('should contain company number', () => {
      assertMetadataItem('@firstListItem', '12345678')
    })

    it('should contain trading names', () => {
      assertMetadataItem('@secondListItem', 'Company Corp, Company Ltd')
    })

    it('should render the correct URL', () => {
      cy.contains('Global HQ Test Company').should(
        'have.attr',
        'href',
        urls.companies.hierarchies.ghq.add(testCompany.id, company1.id)
      )
    })
  })

  context('When a company has a Global HQ', () => {
    before(() => {
      cy.visit(urls.companies.businessDetails(companyWithGlobalHQ.id))
    })
    it('should render the removal link', () => {
      cy.contains('Remove link').should(
        'have.attr',
        'href',
        urls.companies.hierarchies.ghq.remove(companyWithGlobalHQ.id)
      )
    })
  })
})
