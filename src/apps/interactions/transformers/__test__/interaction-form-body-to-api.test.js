const faker = require('faker')

const { transformServicesOptions } = require('../')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data.json')

const transformInteractionFormBodyToApiRequest = require('../interaction-form-body-to-api')

const transformedServices = transformServicesOptions(serviceOptions)

function defaultTests (addCountries) {
  context('when all fields are populated', function () {
    before(function () {
      this.transformed = transformInteractionFormBodyToApiRequest(
        {
          date_year: '2018',
          date_month: '01',
          date_day: '02',
          grant_amount_offered: '1000',
          net_company_receipt: '500',
          policy_areas: '4444',
          policy_issue_types: '5555',
          service: 'sv1',
        },
        transformedServices,
        addCountries,
      )
    })

    it('should set the date', function () {
      expect(this.transformed.date).to.equal('2018-01-02')
    })

    it('should set the grant amount offered', function () {
      expect(this.transformed.grant_amount_offered).to.equal('1000')
    })

    it('should set the net company receipt', function () {
      expect(this.transformed.net_company_receipt).to.equal('500')
    })

    it('converts policy areas to an array', function () {
      expect(this.transformed.policy_areas).to.deep.equal(['4444'])
    })

    it('converts policy issue types to an array', function () {
      expect(this.transformed.policy_issue_types).to.deep.equal(['5555'])
    })

    if (addCountries) {
      it('should set countries discussed to null', function () {
        expect(this.transformed.were_countries_discussed).to.equal(null)
      })
    } else {
      it('should not include countries discussed', function () {
        expect(this.transformed.were_countries_discussed).to.be.undefined
      })
    }
  })

  context('when the optional fields have not been entered', function () {
    before(function () {
      this.transformed = transformInteractionFormBodyToApiRequest(
        {
          grant_amount_offered: '',
          net_company_receipt: '',
          service: 'sv1',
        },
        transformedServices,
        this.addCountries,
      )
    })

    it('should set the grant amount offered to null', function () {
      expect(this.transformed.grant_amount_offered).to.be.null
    })

    it('should set the net company receipt to null', function () {
      expect(this.transformed.net_company_receipt).to.be.null
    })
  })
}

describe('#transformInteractionFormBodyToApiRequest', function () {
  context('when addCountries is undefined', function () {
    defaultTests()

    context(
      'when selected service has no interaction questions or sub service',
      function () {
        before(function () {
          this.expectedServiceId = 'sv1'
          this.transformed = transformInteractionFormBodyToApiRequest(
            {
              service: this.expectedServiceId,
            },
            transformedServices
          )
        })

        it('should return service id & have no answer options', function () {
          expect(this.transformed.service).to.equal(this.expectedServiceId)
          expect(this.transformed.service_answers).to.deep.equal({})
        })
      }
    )

    context(
      'when selected service has interaction questions and sub service',
      function () {
        before(function () {
          this.subServiceValues = ['', 'sv2', '']
          this.expectedServiceLabel = 'Providing Export Advice & Information'
          this.transformed = transformInteractionFormBodyToApiRequest(
            {
              service: this.expectedServiceLabel,
              subService: this.subServiceValues,
              'sv2-q1': 'sv2-q1-a1',
            },
            transformedServices
          )
        })

        it('should return subServiceId as output service id', function () {
          expect(this.transformed.service).to.equal('sv2')
        })

        it('should return formated service answers', function () {
          expect(this.transformed.service_answers).to.deep.equal({
            'sv2-q1': { 'sv2-q1-a1': {} },
          })
        })
      }
    )

    context(
      'when selected service has interaction questions and no sub service',
      function () {
        before(function () {
          this.subServiceValues = ['', 'sv3', '']
          this.expectedServiceLabel = 'sv3'
          this.transformed = transformInteractionFormBodyToApiRequest(
            {
              service: this.expectedServiceLabel,
              subService: this.subServiceValues,
              'sv3-q1': 'sv3-q1-a1',
            },
            transformedServices
          )
        })

        it('should return subServiceId as output service id', function () {
          expect(this.transformed.service).to.equal('sv3')
        })

        it('should return formated service answers', function () {
          expect(this.transformed.service_answers).to.deep.equal({
            'sv3-q1': { 'sv3-q1-a1': {} },
          })
        })
      }
    )

    context(
      'when no selected service can be found',
      function () {
        before(function () {
          this.transformed = transformInteractionFormBodyToApiRequest(
            {
              service: undefined,
            },
            transformedServices
          )
        })

        it('should post a null as service value', function () {
          expect(this.transformed.service).to.equal(null)
        })

        it('should return service answers as an empty object', function () {
          expect(this.transformed.service_answers).to.deep.equal({})
        })
      }
    )
  })

  context('when addCountries is true', function () {
    before(function () {
      this.addCountries = true
    })
    defaultTests(true)

    context('when countries discussed is false', function () {
      it('should not add export_countries', function () {
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            were_countries_discussed: 'false',
          },
          transformedServices,
          this.addCountries,
        )

        expect(transformed.were_countries_discussed).to.equal('false')
        expect(transformed.export_countries).to.be.undefined
      })
    })

    context('when countries discussed is true', function () {
      it('should add export_countries', function () {
        const futureCountries = [ faker.random.uuid() ]
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            were_countries_discussed: 'true',
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: futureCountries,
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: '',
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: '',
          },
          transformedServices,
          this.addCountries,
        )

        expect(transformed.were_countries_discussed).to.equal('true')
        expect(transformed.export_countries).to.deep.equal([
          {
            country: { id: futureCountries[ 0 ] },
            status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
          },
        ])
      })
    })
  })
})
