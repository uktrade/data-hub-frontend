const proxyquire = require('proxyquire')
const config = require('../../../config')
const urls = require('../../../lib/urls')
const buildMiddlewareParameters = require('../../../../test/unit/helpers/middleware-parameters-builder')
const {
  handleAddRemoveCompanyToList,
  renderAddRemoveForm,
} = require('../../../../src/apps/company-lists/controllers/add-remove')

describe('Adding and removing a company to a list', () => {
  let middlewareParameters
  beforeEach(() => {
    middlewareParameters = buildMiddlewareParameters()
  })
  describe('#handleAddRemoveCompanyToList', () => {
    context('when adding a company to a list', () => {
      beforeEach(async () => {
        middlewareParameters.reqMock.body = { list: { 1: 'yes' } }
        middlewareParameters.resMock.locals = {
          csrfToken: 'token',
          company: {
            name: 'Company',
            id: '1',
          },
        }
        middlewareParameters.resMock.send = sinon.stub()

        nock(config.apiRoot).put('/v4/company-list/1/item/1').reply(204)

        await handleAddRemoveCompanyToList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
      it('should send a success message', () => {
        expect(middlewareParameters.reqMock.flash).to.have.been.calledWith(
          'success',
          'Lists changes for this company have been saved.'
        )
      })

      it('should then send the response', () => {
        expect(middlewareParameters.resMock.send).to.have.been.called
      })
    })
    context('when removing a company from a list', () => {
      beforeEach(async () => {
        middlewareParameters.reqMock.body = { list: { 1: 'no' } }
        middlewareParameters.resMock.locals = {
          csrfToken: 'token',
          company: {
            name: 'Company',
            id: '1',
          },
        }
        middlewareParameters.resMock.send = sinon.stub()

        nock(config.apiRoot).delete('/v4/company-list/1/item/1').reply(204)

        await handleAddRemoveCompanyToList(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
      it('should send a success message', () => {
        expect(middlewareParameters.reqMock.flash).to.have.been.calledWith(
          'success',
          'Lists changes for this company have been saved.'
        )
      })

      it('should then send the response', () => {
        expect(middlewareParameters.resMock.send).to.have.been.called
      })
    })
    context(
      'when there is an error adding or removing a company from a list',
      () => {
        beforeEach(async () => {
          middlewareParameters.reqMock.body = { list: { 1: 'no' } }
          middlewareParameters.resMock.locals = {
            csrfToken: 'token',
            company: {
              name: 'Company',
              id: '1',
            },
          }
          middlewareParameters.resMock.send = sinon.stub()

          nock(config.apiRoot).delete('/v4/company-list/1/item/1').reply(404)

          await handleAddRemoveCompanyToList(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })
        it('should send a error message', () => {
          expect(middlewareParameters.reqMock.flash).to.have.been.calledWith(
            'error',
            'Could not add or remove to list'
          )
        })

        it('should then send the response', () => {
          expect(middlewareParameters.nextSpy).to.have.been.called
        })
      }
    )
  })
  describe('#fetchListsCompanyIsOn', () => {
    context('when you fetch all lists company is on', () => {
      beforeEach(async () => {
        middlewareParameters.resMock.locals = {
          csrfToken: 'token',
          company: {
            name: 'Company',
            id: '1',
          },
        }
        const getAllCompanyListsStub = sinon.stub().resolves()
        const getListsCompanyIsInStub = sinon.stub().resolves()
        const transformCompaniesInListsStub = sinon.stub().resolves({
          companyLists: [
            {
              listName: 'name',
              listId: '1',
              isAdded: 'yes',
            },
          ],
        })
        const middleware = proxyquire('../controllers/add-remove', {
          '../repos': {
            getAllCompanyLists: getAllCompanyListsStub,
            getListsCompanyIsIn: getListsCompanyIsInStub,
          },
          '../transformers': {
            transformCompaniesInLists: transformCompaniesInListsStub,
          },
        })

        await middleware.fetchListsCompanyIsOn(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
      it('should fetch the lists a company is on', () => {
        expect(middlewareParameters.resMock.locals).to.have.deep.property(
          'listsCompanyIsIn',
          {
            companyLists: [
              {
                listName: 'name',
                listId: '1',
                isAdded: 'yes',
              },
            ],
          }
        )
        expect(middlewareParameters.nextSpy).to.be.called
      })
    })
    context('when you get an error fetching all lists company is on', () => {
      beforeEach(async () => {
        middlewareParameters.resMock.locals = {
          csrfToken: 'token',
          company: {
            name: 'Company',
            id: '1',
          },
        }
        const getAllCompanyListsStub = sinon.stub().rejects()
        const getListsCompanyIsInStub = sinon.stub().resolves()
        const transformCompaniesInListsStub = sinon.stub().resolves()
        const middleware = proxyquire('../controllers/add-remove', {
          '../repos': {
            getAllCompanyLists: getAllCompanyListsStub,
            getListsCompanyIsIn: getListsCompanyIsInStub,
          },
          '../transformers': {
            transformCompaniesInLists: transformCompaniesInListsStub,
          },
        })
        await middleware.fetchListsCompanyIsOn(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })
      it('should pass an error to the next callback', () => {
        expect(middlewareParameters.nextSpy).to.be.called
        expect(middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(
          Error
        )
      })
    })
  })
  describe('#renderAddRemoveForm', () => {
    beforeEach(async () => {
      middlewareParameters.resMock.locals = {
        csrfToken: 'token',
        company: {
          name: 'Company',
          id: '1',
        },
        listsCompanyIsIn: {
          companyLists: [
            {
              listName: 'listName',
              listId: '1',
              isAdded: 'yes',
            },
          ],
        },
      }

      nock(config.apiRoot).put('/v4/company-list/1/item/1').reply(204)

      await renderAddRemoveForm(
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })
    it('should render a breadcrumb', () => {
      expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledWith(
        'Company'
      )
      expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledWith(
        'Add and remove from lists'
      )
    })
    it('should call the render with props', () => {
      expect(middlewareParameters.resMock.render).to.have.been.calledWith(
        'company-lists/views/add-remove-list-container',
        {
          heading: `Add and remove Company from lists`,
          props: {
            list: {
              companyLists: [
                {
                  listName: 'listName',
                  listId: '1',
                  isAdded: 'yes',
                },
              ],
            },
            companyId: '1',
            token: 'token',
            createNewListUrl: `/companies/1/lists/create`,
            cancelLinkUrl: urls.dashboard(),
          },
        }
      )
    })
    context('when there is an error in the render', () => {
      beforeEach(async () => {
        middlewareParameters.resMock.render.throws()

        await renderAddRemoveForm(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should call next with errors', () => {
        expect(middlewareParameters.nextSpy).to.be.called
        expect(middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(
          Error
        )
      })
    })
  })
})
