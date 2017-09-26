const investmentData = require('~/test/unit/data/investment/investment-data.json')
const investmentDataUkCompany = require('~/test/unit/data/investment/investment-data-uk-company.json')

const mockMetadataRepository = {
  investmentTypeOptions: [
    { name: 'Mickey' },
    { name: 'Tom' },
    { name: 'Jerry' },
  ],
}

describe('Investment evaluation controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.breadcrumbStub = function () {
      return this
    }

    this.controller = proxyquire('~/src/apps/investment-projects/controllers/evaluation', {
      '../services/formatting': proxyquire('~/src/apps/investment-projects/services/formatting', {
        '../../../lib/metadata': mockMetadataRepository,
      }),
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEvaluationPage', () => {
    it('should return evaluation details', (done) => {
      this.controller.renderEvaluationPage({
        session: {
          token: 'abcd',
        },
      }, {
        locals: {
          investmentData,
        },
        breadcrumb: this.breadcrumbStub,
        render: (template, data) => {
          try {
            expect(template).to.equal('investment-projects/views/evaluation')
            done()
          } catch (error) {
            done(error)
          }
        },
      }, this.next)
    })
  })

  it('should return evaluation details with correct investment data', (done) => {
    const expectedValue = {
      'Primary sector': 'Aerospace : Manufacturing and Assembly : Space Technology',
      'Total investment': '£100,000',
      'New jobs': '10 new jobs',
      'Average salary of new jobs': undefined,
      'R&D budget': 'Has R&D budget',
      'Non-FDI R&D project': 'Has linked non-FDI R&D projects',
      'New-to-world tech': 'Has new-to-world tech, business model or IP',
      'Account tier': undefined,
      'New GHQ/EHQ': 'No',
      'Export revenue': 'Yes, will create significant export revenue',
    }
    const expectFDI = {
      'Type of investment': 'Does not apply',
      'Foreign investor': {
        name: 'Omnicorp SDS',
        url: '/companies/6c388e5b-a098-e211-a939-e4115bead28a',
      },
      'Foreign country': 'Korea (South)',
      'UK company': null,
      'Foreign equity investment': '£50,000',
      'Investor retains 10% voting power': 'No',
      'New jobs': '10 new jobs',
      'Safeguarded jobs': '5 safeguarded jobs',
    }
    const expectedLanding = {
      'UK company': null,
      'Companies House Number': undefined,
      'Registered Address': null,
      'Land date': null,
    }

    this.controller.renderEvaluationPage({
      session: {
        token: 'abcd',
      },
    }, {
      locals: {
        investmentData,
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(template).to.equal('investment-projects/views/evaluation')
          expect(data.value).to.deep.equal(expectedValue)
          expect(data.fdi).to.deep.equal(expectFDI)
          expect(data.landing).to.deep.equal(expectedLanding)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })

  it('should return evaluation details with correct investment data with UK company', (done) => {
    const expectedValue = {
      'Primary sector': 'Automotive : Motorsport',
      'Total investment': '£40,000,000,000',
      'New jobs': '456 new jobs',
      'Average salary of new jobs': '£25,000 – £29,000',
      'R&D budget': 'Has R&D budget',
      'Non-FDI R&D project': 'Has linked non-FDI R&D projects',
      'New-to-world tech': 'Has new-to-world tech, business model or IP',
      'Account tier': 'Tier A - Strategic Account',
      'New GHQ/EHQ': 'Yes',
      'Export revenue': 'Yes, will create significant export revenue',
    }
    const expectFDI = {
      'Type of investment': 'Tom',
      'Foreign investor': {
        name: 'amazing tables Ltd.',
        url: '/companies/6c997f91-a098-e211-a939-e4115bead28a',
      },
      'Foreign country': 'Nigeria',
      'UK company': {
        name: 'AITCH (Bananas are us) LIMITED',
        url: '/companies/f91c0685-e2ac-41e7-8500-cdd0ad747a97',
      },
      'Foreign equity investment': '£400,000',
      'Investor retains 10% voting power': 'Yes',
      'New jobs': '456 new jobs',
      'Safeguarded jobs': '10 safeguarded jobs',
    }
    const expectedLanding = {
      'UK company': {
        name: 'AITCH (Bananas are us) LIMITED',
        url: '/companies/f91c0685-e2ac-41e7-8500-cdd0ad747a97',
      },
      'Companies House Number': '08311441',
      'Registered Address': [
        'FIRST FLOOR ACHME HOUSE',
        'KIRKDALE ROAD',
        'LEYTONSTONE',
        'United Kingdom',
        'LONDON',
        'E134 1HP',
      ],
      'Land date': '21st July 2018',
    }

    this.controller.renderEvaluationPage({
      session: {
        token: 'abcd',
      },
    }, {
      locals: {
        investmentData: investmentDataUkCompany,
      },
      breadcrumb: this.breadcrumbStub,
      render: (template, data) => {
        try {
          expect(template).to.equal('investment-projects/views/evaluation')
          expect(data.value).to.deep.equal(expectedValue)
          expect(data.fdi).to.deep.equal(expectFDI)
          expect(data.landing).to.deep.equal(expectedLanding)
          done()
        } catch (error) {
          done(error)
        }
      },
    }, this.next)
  })
})
