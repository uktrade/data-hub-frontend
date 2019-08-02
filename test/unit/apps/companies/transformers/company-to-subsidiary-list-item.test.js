const transformCompanyToSubsidiaryListItem = require('src/apps/companies/transformers/company-to-subsidiary-list-item')

const companyMock = require('test/unit/data/companies/company-v4.json')

describe('#transformCompanyToSubsidiaryListItem', () => {
  context('when the global headquarters is not archived', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSubsidiaryListItem({
        archived: false,
      })(companyMock)
    })

    it('should add the "Remove subsidiary" link', () => {
      expect(this.actual.meta).to.containSubset([
        {
          value: 'Remove subsidiary',
          url: `/companies/${companyMock.id}/hierarchies/ghq/remove`,
        },
      ])
    })
  })

  context('when the global headquarters is archived', () => {
    beforeEach(() => {
      this.actual = transformCompanyToSubsidiaryListItem({
        archived: true,
      })(companyMock)
    })

    it('should not add the "Remove subsidiary" link', () => {
      expect(this.actual.meta).to.not.containSubset([
        {
          value: 'Remove subsidiary',
          url: `/companies/${companyMock.id}/hierarchies/ghq/remove`,
        },
      ])
    })
  })
})
