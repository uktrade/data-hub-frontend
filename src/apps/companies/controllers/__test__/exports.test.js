const proxyquire = require('proxyquire')
const faker = require('faker')
const urls = require('../../../../lib/urls')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const {
  NEW_COUNTRIES_FEATURE,
  EXPORT_INTEREST_STATUS,
} = require('../../../constants')

const companyMock = require('../../../../../test/unit/data/companies/company-v4.json')

describe('Company export controller', () => {
  beforeEach(() => {
    this.saveCompany = sinon.stub()
    this.transformerSpy = sinon.spy()

    this.controller = proxyquire('../exports', {
      '../repos': {
        saveCompany: this.saveCompany,
      },
      '../../../lib/metadata': {
        countryOptions: [
          {
            id: '1234',
            name: 'France',
          },
        ],
        exportExperienceCategory: [
          {
            id: '73023b55-9568-4e3f-a134-53ec58451d3f',
            name: 'Export growth',
          },
        ],
      },
      '../transformers': {
        transformCompanyToExportDetailsView: this.transformerSpy,
      },
    })
  })

  describe('#renderExports', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      this.controller.renderExports(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock
      )
    })

    it('should set correct breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(
        'Exports'
      )
    })

    it('should call the transformer to get the deails', () => {
      expect(this.transformerSpy).to.be.calledWith(companyMock)
    })

    it('should render the correct view', () => {
      expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(
        'companies/views/exports-view'
      )
      expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('should exports to view', () => {
      expect(
        this.middlewareParameters.resMock.render.args[0][1]
      ).to.have.property('exportDetails')
    })
  })

  describe('#populateExportForm', () => {
    context('without any feature flags', () => {
      context('when no request body exists', () => {
        beforeEach(() => {
          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
          })

          this.controller.populateExportForm(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(
            this.middlewareParameters.resMock.locals.formData
          ).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            export_to_countries: [
              '35afd8d0-5d95-e211-a939-e4115bead28a',
              '36afd8d0-5d95-e211-a939-e4115bead28a',
            ],
            future_interest_countries: ['37afd8d0-5d95-e211-a939-e4115bead28a'],
          })
        })

        it('should call next with no arguments', () => {
          expect(this.middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })

      context('when request body exists', () => {
        beforeEach(() => {
          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              export_to_countries: ['09876'],
              future_interest_countries: ['67890'],
            },
            company: companyMock,
          })

          this.controller.populateExportForm(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(
            this.middlewareParameters.resMock.locals.formData
          ).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            export_to_countries: ['09876'],
            future_interest_countries: ['67890'],
          })
        })

        it('should call next with no arguments', () => {
          expect(this.middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })
    })
    context('when the new countries feature flag is true', () => {
      context('when no request body exists', () => {
        beforeEach(() => {
          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            features: { [NEW_COUNTRIES_FEATURE]: true },
          })

          this.controller.populateExportForm(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(
            this.middlewareParameters.resMock.locals.formData
          ).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: [],
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: [],
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: [],
          })
        })

        it('should call next with no arguments', () => {
          expect(this.middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })

      context('when request body exists', () => {
        let countries

        beforeEach(() => {
          countries = {
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: faker.random.uuid(),
          }
          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: countries,
            company: companyMock,
            features: { [NEW_COUNTRIES_FEATURE]: true },
          })

          this.controller.populateExportForm(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should populate formData on locals', () => {
          expect(
            this.middlewareParameters.resMock.locals.formData
          ).to.deep.equal({
            export_experience_category: {
              id: '8b05e8c7-1812-46bf-bab7-a0096ab5689f',
              name: 'Increasing export markets',
            },
            ...countries,
          })
        })

        it('should call next with no arguments', () => {
          expect(this.middlewareParameters.nextSpy).to.have.been.calledWith()
          expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        })
      })
    })
  })

  describe('#renderExportEdit', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        company: companyMock,
      })

      this.controller.renderExportEdit(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy
      )
    })

    it('should set correct breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been
        .calledThrice
    })

    it('should render the correct view', () => {
      expect(this.middlewareParameters.resMock.render.args[0][0]).to.equal(
        'companies/views/exports-edit'
      )
      expect(this.middlewareParameters.resMock.render).to.have.been.calledOnce
    })

    it('send labels to view', () => {
      expect(
        this.middlewareParameters.resMock.render.args[0][1]
      ).to.have.property('exportDetailsLabels')
    })

    it('send export experience categories options to view', () => {
      expect(
        this.middlewareParameters.resMock.render.args[0][1]
      ).to.have.property('exportExperienceCategories')
      expect(
        this.middlewareParameters.resMock.render.args[0][1]
          .exportExperienceCategories
      ).to.deep.equal([
        {
          value: '73023b55-9568-4e3f-a134-53ec58451d3f',
          label: 'Export growth',
        },
      ])
    })

    it('send country options to view', () => {
      expect(
        this.middlewareParameters.resMock.render.args[0][1]
      ).to.have.property('countryOptions')
      expect(
        this.middlewareParameters.resMock.render.args[0][1].countryOptions
      ).to.deep.equal([
        {
          value: '1234',
          label: 'France',
        },
      ])
    })
  })

  describe('#handleEditFormPost', () => {
    context('when save is successful', () => {
      context('when the new countries feature flag is true', () => {
        context('With countries specified', () => {
          const countries = {
            [EXPORT_INTEREST_STATUS.FUTURE_INTEREST]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.EXPORTING_TO]: faker.random.uuid(),
            [EXPORT_INTEREST_STATUS.NOT_INTERESTED]: faker.random.uuid(),
          }
          beforeEach(async () => {
            this.saveCompany.resolves(companyMock)

            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                export_experience_category: '111',
                ...countries,
              },
              company: companyMock,
              features: { [NEW_COUNTRIES_FEATURE]: true },
            })

            await this.controller.handleEditFormPost(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
          })

          it('should call save method with token', () => {
            expect(this.saveCompany.args[0][0]).to.equal('1234')
          })

          it('should call save method with flattened body data', () => {
            const actualData = this.saveCompany.args[0][1]
            expect(actualData.export_experience_category).to.equal('111')
            expect(actualData.export_countries).to.deep.equal(
              Object.entries(countries).map(([status, id]) => ({
                country: { id },
                status,
              }))
            )
          })

          it('should redirect to exports routes', () => {
            expect(
              this.middlewareParameters.resMock.redirect
            ).to.have.been.calledWith(
              urls.companies.exports.index(companyMock.id)
            )
            expect(this.middlewareParameters.resMock.redirect).to.have.been
              .calledOnce
          })

          it('next should not have been called', () => {
            expect(this.middlewareParameters.nextSpy).not.to.have.been.called
          })
        })
        context('Without any countries', () => {
          it('should call save method with flattened body data', async () => {
            this.saveCompany.resolves(companyMock)

            this.middlewareParameters = buildMiddlewareParameters({
              requestBody: {
                export_experience_category: '111',
              },
              company: companyMock,
              features: { [NEW_COUNTRIES_FEATURE]: true },
            })

            await this.controller.handleEditFormPost(
              this.middlewareParameters.reqMock,
              this.middlewareParameters.resMock,
              this.middlewareParameters.nextSpy
            )
            const actualData = this.saveCompany.args[0][1]
            expect(actualData.export_experience_category).to.equal('111')
            expect(Array.isArray(actualData.export_countries)).to.equal(true)
            expect(actualData.export_countries.length).to.equal(0)
          })
        })
      })

      context('without any feature flags', () => {
        beforeEach(async () => {
          this.saveCompany.resolves(companyMock)

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              export_experience_category: '111',
              export_to_countries: '222',
              future_interest_countries: ['333', '444'],
            },
            company: companyMock,
          })

          await this.controller.handleEditFormPost(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should call save method with token', () => {
          expect(this.saveCompany.args[0][0]).to.equal('1234')
        })

        it('should call save method with flattened body data', () => {
          const actualData = this.saveCompany.args[0][1]
          expect(actualData.export_experience_category).to.equal('111')
          expect(actualData.export_to_countries).to.deep.equal(['222'])
          expect(actualData.future_interest_countries).to.deep.equal([
            '333',
            '444',
          ])
        })

        it('should redirect to exports routes', () => {
          expect(
            this.middlewareParameters.resMock.redirect
          ).to.have.been.calledWith(
            urls.companies.exports.index(companyMock.id)
          )
          expect(this.middlewareParameters.resMock.redirect).to.have.been
            .calledOnce
        })

        it('should redirect to exports routes', () => {
          expect(
            this.middlewareParameters.resMock.redirect
          ).to.have.been.calledWith(
            urls.companies.exports.index(companyMock.id)
          )
          expect(this.middlewareParameters.resMock.redirect).to.have.been
            .calledOnce
        })

        it('next should not have been called', () => {
          expect(this.middlewareParameters.nextSpy).not.to.have.been.called
        })
      })
    })

    context('when save rejects with error', () => {
      beforeEach(async () => {
        this.errorMock = {
          statusCode: 500,
        }
        this.saveCompany.rejects(this.errorMock)

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            export_experience_category: '111',
            export_to_countries: '222',
            future_interest_countries: ['333', '444'],
          },
          company: companyMock,
        })

        await this.controller.handleEditFormPost(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should call next with error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledWith(
          this.errorMock
        )
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
      })
    })
  })
})
