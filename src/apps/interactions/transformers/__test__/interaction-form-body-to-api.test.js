const faker = require('faker')

const { transformServicesOptions } = require('../')
const { EXPORT_INTEREST_STATUS } = require('../../../constants')

const serviceOptions = require('../../../../../test/unit/data/interactions/service-options-data.json')

const transformInteractionFormBodyToApiRequest = require('../interaction-form-body-to-api')

const transformedServices = transformServicesOptions(serviceOptions)

describe('#transformInteractionFormBodyToApiRequest', () => {
  function defaultTests(addCountries) {
    context('when all fields are populated', () => {
      it('transforms the data correctly', () => {
        const transformed = transformInteractionFormBodyToApiRequest(
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
          addCountries
        )

        expect(transformed.date).to.equal('2018-01-02')
        expect(transformed.grant_amount_offered).to.equal('1000')
        expect(transformed.net_company_receipt).to.equal('500')
        expect(transformed.policy_areas).to.deep.equal(['4444'])
        expect(transformed.policy_issue_types).to.deep.equal(['5555'])

        if (addCountries) {
          expect(transformed.were_countries_discussed).to.equal(null)
        } else {
          expect(transformed.were_countries_discussed).to.be.undefined
        }
      })
    })

    context('when the optional fields have not been entered', () => {
      it('transforms the data correctly', () => {
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            grant_amount_offered: '',
            net_company_receipt: '',
            service: 'sv1',
          },
          transformedServices,
          addCountries
        )
        expect(transformed.grant_amount_offered).to.be.null
        expect(transformed.net_company_receipt).to.be.null
      })
    })
  }
  context('when addCountries is undefined', () => {
    defaultTests()

    context(
      'when selected service has no interaction questions or sub service',
      () => {
        it('should return service id & have no answer options', () => {
          const expectedServiceId = 'sv1'
          const transformed = transformInteractionFormBodyToApiRequest(
            {
              service: expectedServiceId,
            },
            transformedServices
          )
          expect(transformed.service).to.equal(expectedServiceId)
          expect(transformed.service_answers).to.deep.equal({})
        })
      }
    )

    context(
      'when selected service has interaction questions and sub service',
      () => {
        it('should return subServiceId as output service id and format service answers', () => {
          const subServiceValues = ['', 'sv2', '']
          const expectedServiceLabel = 'Providing Export Advice & Information'
          const transformed = transformInteractionFormBodyToApiRequest(
            {
              service: expectedServiceLabel,
              subService: subServiceValues,
              'sv2-q1': 'sv2-q1-a1',
            },
            transformedServices
          )
          expect(transformed.service).to.equal('sv2')
          expect(transformed.service_answers).to.deep.equal({
            'sv2-q1': { 'sv2-q1-a1': {} },
          })
        })
      }
    )

    context(
      'when selected service has interaction questions and no sub service',
      () => {
        it('should return subServiceId as output service id and format service answers', () => {
          const subServiceValues = ['', 'sv3', '']
          const expectedServiceLabel = 'sv3'
          const transformed = transformInteractionFormBodyToApiRequest(
            {
              service: expectedServiceLabel,
              subService: subServiceValues,
              'sv3-q1': 'sv3-q1-a1',
            },
            transformedServices
          )
          expect(transformed.service).to.equal('sv3')
          expect(transformed.service_answers).to.deep.equal({
            'sv3-q1': { 'sv3-q1-a1': {} },
          })
        })
      }
    )

    context('when no selected service can be found', () => {
      it('should post service value as null and service answers as an empty object', () => {
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            service: undefined,
          },
          transformedServices
        )
        expect(transformed.service).to.equal(null)
        expect(transformed.service_answers).to.deep.equal({})
      })
    })
  })

  context('when addCountries is true', () => {
    const addCountries = true

    defaultTests(addCountries)

    context('when countries discussed is false', () => {
      it('should not add export_countries', () => {
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            were_countries_discussed: 'false',
          },
          transformedServices,
          addCountries
        )

        expect(transformed.were_countries_discussed).to.equal('false')
        expect(transformed.export_countries).to.be.undefined
      })
    })

    context('when countries discussed is true', () => {
      it('should add export_countries', () => {
        const futureCountries = [faker.random.uuid()]
        const transformed = transformInteractionFormBodyToApiRequest(
          {
            were_countries_discussed: 'true',
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: futureCountries,
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: '',
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: '',
          },
          transformedServices,
          addCountries
        )

        expect(transformed.were_countries_discussed).to.equal('true')
        expect(transformed.export_countries).to.deep.equal([
          {
            country: { id: futureCountries[0] },
            status: EXPORT_INTEREST_STATUS.FUTURE_INTEREST,
          },
        ])
      })
    })
  })
})
