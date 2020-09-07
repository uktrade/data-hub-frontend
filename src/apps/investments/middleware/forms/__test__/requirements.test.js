const { v4: uuid } = require('uuid')
const moment = require('moment')
const { assign } = require('lodash')

const config = require('../../../../../config')
const paths = require('../../../paths')
const investmentData = require('../../../../../../test/unit/data/investment/investment-data.json')
const { handleFormPost, populateForm } = require('../requirements')

const yesterday = moment().subtract(1, 'days').toISOString()

const metadataMock = {
  strategicDriversOptions: [
    { id: '1', name: 'ehq', disabled_on: null },
    { id: '2', name: 'ghq', disabled_on: yesterday },
    { id: '3', name: 'ukhq', disabled_on: null },
  ],
  regionOptions: [
    { id: '1', name: 'r1', disabled_on: null },
    { id: '2', name: 'r2', disabled_on: yesterday },
    { id: '3', name: 'r3', disabled_on: null },
  ],
  countryOptions: [
    { id: '9999', name: 'United Kingdom', disabled_on: null },
    { id: '8888', name: 'Test', disabled_on: yesterday },
  ],
  deliveryPartnerOptions: [
    { id: '1', name: 'dp1', disabled_on: null },
    { id: '2', name: 'dp2', disabled_on: yesterday },
    { id: '3', name: 'dp3', disabled_on: null },
  ],
}

function getFieldValue(form, name) {
  const fields = form.children || []

  const field = fields.find((item) => item.name === name)

  if (field) {
    return field.value
  }

  return null
}

function getFieldError(form, name) {
  const fields = form.children || []

  const field = fields.find((item) => item.name === name)

  if (field) {
    return field.error
  }

  return null
}

describe('Investment requirements form middleware', () => {
  beforeEach(() => {
    this.reqMock = {
      body: {},
      session: {
        token: uuid(),
        user: {
          id: '4321',
          name: 'Julie Brown',
        },
      },
      params: {
        investmentId: '1234',
      },
      query: {},
      flash: sinon.stub(),
    }

    this.resMock = {
      locals: {
        paths,
      },
      redirect: sinon.stub(),
    }

    this.nextStub = sinon.stub()
  })

  describe('#populateForm', () => {
    beforeEach(() => {
      this.resMock.locals.investment = investmentData

      nock(config.apiRoot)
        .get('/v4/metadata/uk-region')
        .reply(200, metadataMock.regionOptions)
        .get('/v4/metadata/country')
        .reply(200, metadataMock.countryOptions)
        .get('/v4/metadata/investment-strategic-driver')
        .reply(200, metadataMock.strategicDriversOptions)
        .get('/v4/metadata/investment-delivery-partner')
        .reply(200, metadataMock.deliveryPartnerOptions)
    })

    context('when called without posted data', () => {
      beforeEach(async () => {
        await populateForm(this.reqMock, this.resMock, this.nextStub)
      })

      it('should build the form with the investment data', () => {
        const clientRequirments = getFieldValue(
          this.resMock.locals.requirementsForm,
          'client_requirements'
        )
        expect(clientRequirments).to.eq('Some interesting requirements here')
      })

      it('should set the return link', () => {
        expect(this.resMock.locals.requirementsForm.returnLink).to.equal(
          '/investments/projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7'
        )
      })
    })

    context('when called with posted data', () => {
      beforeEach(async () => {
        this.resMock.locals = assign({}, this.resMock.locals, {
          formattedBody: {
            strategic_drivers: ['844cd12a-6095-e211-a939-e4115bead28a'],
            client_requirements: 'some requirements',
          },
        })

        await populateForm(this.reqMock, this.resMock, this.nextStub)
      })

      it('should build the form with the posted data', () => {
        const clientRequirments = getFieldValue(
          this.resMock.locals.requirementsForm,
          'client_requirements'
        )
        expect(clientRequirments).to.eq('some requirements')
      })

      it('should set the return link', () => {
        expect(this.resMock.locals.requirementsForm.returnLink).to.equal(
          '/investments/projects/f22ae6ac-b269-4fe5-aeba-d6a605b9a7a7'
        )
      })
    })

    context('when called with called with errors', () => {
      beforeEach(async () => {
        this.resMock.locals = assign({}, this.resMock.locals, {
          errors: {
            client_requirements: ['required'],
          },
        })

        await populateForm(this.reqMock, this.resMock, this.nextStub)
      })

      it('should build the form with the errors', () => {
        const error = getFieldError(
          this.resMock.locals.requirementsForm,
          'client_requirements'
        )
        expect(error).to.deep.eq(['required'])
      })
    })
  })

  describe('#handleFormPost', () => {
    context('when called with multiple strategic drivers', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            strategic_drivers: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
            actual_uk_regions: [],
            competitor_countries: [],
            uk_region_locations: [],
            delivery_partners: [],
          })
          .reply(200, {})

        const body = {
          strategic_drivers: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })
        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })

    context('when called with a single strategic driver', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            actual_uk_regions: [],
            competitor_countries: [],
            uk_region_locations: [],
            strategic_drivers: ['844cd12a-6095-e211-a939-e4115bead28a'],
            client_requirements: 'some requirements',
            delivery_partners: [],
          })
          .reply(200, {})

        const body = {
          strategic_drivers: '844cd12a-6095-e211-a939-e4115bead28a',
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })

        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })

    context('when client is considering competitor countries', () => {
      beforeEach(() => {
        this.reqMock.body = assign({}, this.reqMock.body, {
          client_considering_other_countries: 'true',
        })
      })

      context('when called with multiple competitor countries', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              client_considering_other_countries: 'true',
              competitor_countries: [
                '844cd12a-6095-e211-a939-e4115bead28a',
                '844cd12a-6095-e211-a939-e4115bead28b',
              ],
              client_requirements: 'some requirements',
              actual_uk_regions: [],
              strategic_drivers: [],
              uk_region_locations: [],
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            client_considering_other_countries: 'true',
            competitor_countries: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })
          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })

      context('when called with a single competitor country', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              client_considering_other_countries: 'true',
              actual_uk_regions: [],
              strategic_drivers: [],
              uk_region_locations: [],
              competitor_countries: ['844cd12a-6095-e211-a939-e4115bead28a'],
              client_requirements: 'some requirements',
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            competitor_countries: '844cd12a-6095-e211-a939-e4115bead28a',
            client_considering_other_countries: 'true',
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })

          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })
    })

    context('when client is not considering competitor countries', () => {
      beforeEach(() => {
        this.reqMock.body = assign({}, this.reqMock.body, {
          client_considering_other_countries: 'false',
        })
      })

      context('when called with multiple competitor countries', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              client_considering_other_countries: 'false',
              competitor_countries: [],
              client_requirements: 'some requirements',
              actual_uk_regions: [],
              strategic_drivers: [],
              uk_region_locations: [],
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            client_considering_other_countries: 'false',
            competitor_countries: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })
          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })

      context('when called with a single competitor country', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              client_considering_other_countries: 'false',
              actual_uk_regions: [],
              strategic_drivers: [],
              uk_region_locations: [],
              competitor_countries: [],
              client_requirements: 'some requirements',
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            competitor_countries: '844cd12a-6095-e211-a939-e4115bead28a',
            client_considering_other_countries: 'false',
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })

          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })
    })

    context('when called with multiple uk regions', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            uk_region_locations: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
            actual_uk_regions: [],
            strategic_drivers: [],
            competitor_countries: [],
            delivery_partners: [],
          })
          .reply(200, {})

        const body = {
          uk_region_locations: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })
        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })

    context('when called with a single uk region', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            actual_uk_regions: [],
            strategic_drivers: [],
            competitor_countries: [],
            uk_region_locations: ['844cd12a-6095-e211-a939-e4115bead28a'],
            client_requirements: 'some requirements',
            delivery_partners: [],
          })
          .reply(200, {})

        const body = {
          uk_region_locations: '844cd12a-6095-e211-a939-e4115bead28a',
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })

        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })

    context('when uk location has been decided', () => {
      context('when called with multiple actual landed regions', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              site_decided: 'true',
              actual_uk_regions: [
                '844cd12a-6095-e211-a939-e4115bead28a',
                '844cd12a-6095-e211-a939-e4115bead28b',
              ],
              client_requirements: 'some requirements',
              strategic_drivers: [],
              competitor_countries: [],
              uk_region_locations: [],
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            site_decided: 'true',
            actual_uk_regions: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })
          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })

      context('when called with a single actual landed region', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              site_decided: 'true',
              strategic_drivers: [],
              competitor_countries: [],
              uk_region_locations: [],
              actual_uk_regions: ['844cd12a-6095-e211-a939-e4115bead28a'],
              client_requirements: 'some requirements',
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            site_decided: 'true',
            actual_uk_regions: '844cd12a-6095-e211-a939-e4115bead28a',
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })

          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })
    })

    context('when uk location has not been decided', () => {
      context('when called with multiple actual landed regions', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              site_decided: 'false',
              actual_uk_regions: [],
              client_requirements: 'some requirements',
              strategic_drivers: [],
              competitor_countries: [],
              uk_region_locations: [],
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            site_decided: 'false',
            actual_uk_regions: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })
          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })

      context('when called with a single actual landed region', () => {
        beforeEach(async () => {
          nock(config.apiRoot)
            .patch('/v3/investment/1234', {
              site_decided: 'false',
              strategic_drivers: [],
              competitor_countries: [],
              uk_region_locations: [],
              actual_uk_regions: [],
              client_requirements: 'some requirements',
              delivery_partners: [],
            })
            .reply(200, {})

          const body = {
            site_decided: 'false',
            actual_uk_regions: '844cd12a-6095-e211-a939-e4115bead28a',
            client_requirements: 'some requirements',
          }

          this.reqMock = assign({}, this.reqMock, { body })

          await handleFormPost(this.reqMock, this.resMock, this.nextStub)
        })

        it('should redirect the user to the details screen', () => {
          expect(this.resMock.redirect).to.be.calledWith(
            '/investments/projects/1234/details'
          )
        })

        it('should send a flash message to inform the user of the change', () => {
          expect(this.reqMock.flash).to.be.calledWith(
            'success',
            'Investment requirements updated'
          )
        })
      })
    })

    context('when called with form errors', () => {
      beforeEach(async () => {
        this.error = [
          {},
          { client_requirements: ['This field may not be blank.'] },
        ]

        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            site_decided: 'true',
            strategic_drivers: [],
            competitor_countries: [],
            uk_region_locations: [],
            actual_uk_regions: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
            delivery_partners: [],
          })
          .reply(400, this.error)

        const body = {
          site_decided: 'true',
          client_requirements: 'some requirements',
          actual_uk_regions: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
        }

        this.reqMock = assign({}, this.reqMock, { body })

        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should pass the request to the next middleware', () => {
        expect(this.nextStub).to.be.called
      })

      it('should set the errors on the response object', () => {
        expect(this.resMock.locals.errors).to.deep.equal(this.error)
      })
    })

    context('when called to add another', async () => {
      beforeEach(async () => {
        this.error = [
          {},
          { client_requirements: ['This field may not be blank.'] },
        ]

        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            strategic_drivers: [],
            competitor_countries: [],
            uk_region_locations: [],
            actual_uk_regions: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
            client_requirements: 'some requirements',
            delivery_partners: [],
          })
          .reply(400, this.error)

        const body = {
          site_decided: 'true',
          actual_uk_regions: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
          add_item: 'true',
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })

        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should pass the request to the next middleware', () => {
        expect(this.nextStub).to.be.called
      })

      it('should set the transformed form body on the response', () => {
        expect(this.resMock.locals.formattedBody).to.deep.equal({
          site_decided: 'true',
          add_item: 'true',
          strategic_drivers: [],
          competitor_countries: [],
          uk_region_locations: [],
          actual_uk_regions: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
          client_requirements: 'some requirements',
          delivery_partners: [],
        })
      })
    })

    context('when called with multiple partners', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            uk_region_locations: [],
            client_requirements: 'some requirements',
            actual_uk_regions: [],
            strategic_drivers: [],
            competitor_countries: [],
            delivery_partners: [
              '844cd12a-6095-e211-a939-e4115bead28a',
              '844cd12a-6095-e211-a939-e4115bead28b',
            ],
          })
          .reply(200, {})

        const body = {
          delivery_partners: [
            '844cd12a-6095-e211-a939-e4115bead28a',
            '844cd12a-6095-e211-a939-e4115bead28b',
          ],
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })
        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })

    context('when called with a single partner', () => {
      beforeEach(async () => {
        nock(config.apiRoot)
          .patch('/v3/investment/1234', {
            actual_uk_regions: [],
            strategic_drivers: [],
            competitor_countries: [],
            uk_region_locations: [],
            client_requirements: 'some requirements',
            delivery_partners: ['844cd12a-6095-e211-a939-e4115bead28a'],
          })
          .reply(200, {})

        const body = {
          delivery_partners: '844cd12a-6095-e211-a939-e4115bead28a',
          client_requirements: 'some requirements',
        }

        this.reqMock = assign({}, this.reqMock, { body })

        await handleFormPost(this.reqMock, this.resMock, this.nextStub)
      })

      it('should redirect the user to the details screen', () => {
        expect(this.resMock.redirect).to.be.calledWith(
          '/investments/projects/1234/details'
        )
      })

      it('should send a flash message to inform the user of the change', () => {
        expect(this.reqMock.flash).to.be.calledWith(
          'success',
          'Investment requirements updated'
        )
      })
    })
  })
})
