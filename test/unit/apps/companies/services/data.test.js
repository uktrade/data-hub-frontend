const companyService = require('~/src/apps/companies/services/data')

describe('Company data service', () => {
  describe('buildCompanyUrl', () => {
    it('should return expected url for non uk based company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: false,
        id: 'mockId',
      })

      expect(urlPath).to.equal('/companies/mockId')
    })
    it('should return expected url for private ltd company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'private limited company',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/companies/mockId')
    })
    it('should return expected url for public ltd company', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'public limited company',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/companies/mockId')
    })
    it('should return expected url for public ltd company with caps case', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'PUBLIC LIMITED COMPANY',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/companies/mockId')
    })
    it('should return expected url uk non public, private ltd', () => {
      const urlPath = companyService.buildCompanyUrl({
        uk_based: true,
        business_type: {
          name: 'a different company type',
        },
        id: 'mockId',
      })

      expect(urlPath).to.equal('/companies/mockId')
    })
  })
})
