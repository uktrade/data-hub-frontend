const transformInteractionFormBodyToApiRequest = require('src/apps/interactions/transformers/interaction-form-body-to-api')
const serviceOptions = require('test/unit/data/interactions/service-options-data.json')
const {
  transformServicesOptions,
} = require('src/apps/interactions/transformers')

const transformedServices = transformServicesOptions(serviceOptions)

describe('#transformInteractionFormBodyToApiRequest', () => {
  context('when all fields are populated', () => {
    beforeEach(() => {
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
        transformedServices
      )
    })

    it('should set the date', () => {
      expect(this.transformed.date).to.equal('2018-01-02')
    })

    it('should set the grant amount offered', () => {
      expect(this.transformed.grant_amount_offered).to.equal('1000')
    })

    it('should set the net company receipt', () => {
      expect(this.transformed.net_company_receipt).to.equal('500')
    })

    it('converts policy areas to an array', () => {
      expect(this.transformed.policy_areas).to.deep.equal(['4444'])
    })

    it('converts policy issue types to an array', () => {
      expect(this.transformed.policy_issue_types).to.deep.equal(['5555'])
    })
  })

  context('when the optional fields have not been entered', () => {
    beforeEach(() => {
      this.transformed = transformInteractionFormBodyToApiRequest(
        {
          grant_amount_offered: '',
          net_company_receipt: '',
          service: 'sv1',
        },
        transformedServices
      )
    })

    it('should set the grant amount offered to null', () => {
      expect(this.transformed.grant_amount_offered).to.be.null
    })

    it('should set the net company receipt to null', () => {
      expect(this.transformed.net_company_receipt).to.be.null
    })
  })

  context(
    'when selected service has no interaction questions or sub service',
    () => {
      beforeEach(() => {
        this.expectedServiceId = 'sv1'
        this.transformed = transformInteractionFormBodyToApiRequest(
          {
            service: this.expectedServiceId,
          },
          transformedServices
        )
      })

      it('should return service id & have no answer options', () => {
        expect(this.transformed.service).to.equal(this.expectedServiceId)
        expect(this.transformed.service_answers).to.deep.equal({})
      })
    }
  )

  context(
    'when selected service has interaction questions and sub service',
    () => {
      beforeEach(() => {
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

      it('should return subServiceId as output service id', () => {
        expect(this.transformed.service).to.equal('sv2')
      })

      it('should return formated service answers', () => {
        expect(this.transformed.service_answers).to.deep.equal({
          'sv2-q1': { 'sv2-q1-a1': {} },
        })
      })
    }
  )

  context(
    'when selected service has interaction questions and no sub service',
    () => {
      beforeEach(() => {
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

      it('should return subServiceId as output service id', () => {
        expect(this.transformed.service).to.equal('sv3')
      })

      it('should return formated service answers', () => {
        expect(this.transformed.service_answers).to.deep.equal({
          'sv3-q1': { 'sv3-q1-a1': {} },
        })
      })
    }
  )

  context(
    'when no selected service can be found',
    () => {
      beforeEach(() => {
        this.transformed = transformInteractionFormBodyToApiRequest(
          {
            service: undefined,
          },
          transformedServices
        )
      })

      it('should post a null as service value', () => {
        expect(this.transformed.service).to.equal(null)
      })

      it('should return service answers as an empty object', () => {
        expect(this.transformed.service_answers).to.deep.equal({})
      })
    }
  )
})
