const config = require('../../../../config')
const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const { createCompanyList, renderCreateListForm } = require('../create')

describe('Creating company lists', () => {
  describe('#createCompanyList', () => {
    context('when a company has been successfully added to a list', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters()
        global.middlewareParameters.reqMock.body = { id: '1', name: 'listName' }
        global.middlewareParameters.resMock.send = sinon.stub()

        nock(config.apiRoot)
          .post('/v4/company-list', {
            id: '1',
            name: 'listName',
          })
          .reply(200, { id: '1', name: 'listName', created_on: '2019' })

        await createCompanyList(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should send a success message', () => {
        expect(global.middlewareParameters.reqMock.flash).to.have.been.calledWith('success', 'Company list created')
      })

      it('should then send the response', () => {
        expect(global.middlewareParameters.resMock.send).to.have.been.called
      })
    })

    context('when a company has failed to be added to a list', () => {
      beforeEach(async () => {
        global.middlewareParameters = buildMiddlewareParameters()
        global.middlewareParameters.reqMock.body = { id: '1', name: 'listName' }
        global.middlewareParameters.resMock.send = sinon.stub()

        nock(config.apiRoot)
          .post('/v4/company-list', {
            id: '1',
            name: 'listName',
          })
          .reply(400)

        await createCompanyList(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should send a error message', () => {
        expect(global.middlewareParameters.reqMock.flash).to.have.been.calledWith('error', 'Could not create list')
      })

      it('should then send the response', () => {
        expect(global.middlewareParameters.nextSpy).to.have.been.called
      })
    })
  })

  describe('#renderCreateListForm', () => {
    beforeEach(async () => {
      global.middlewareParameters = buildMiddlewareParameters()
      global.middlewareParameters.resMock.locals = {
        csrfToken: 'token',
        company: {
          name: 'Company',
          id: '1',
        },
      }

      await renderCreateListForm(
        global.middlewareParameters.reqMock,
        global.middlewareParameters.resMock,
        global.middlewareParameters.nextSpy,
      )
    })

    it('should render a breadcrumb', () => {
      expect(global.middlewareParameters.resMock.breadcrumb).to.have.been.calledWith('Company')
      expect(global.middlewareParameters.resMock.breadcrumb).to.have.been.calledWith('Create a list')
    })

    it('should render to the view with props', () => {
      expect(global.middlewareParameters.resMock.render).to.have.been.calledWith('company-lists/views/create-list-container',
        {
          props: {
            id: '1',
            name: 'listName',
            label: 'List name',
            hint: 'This is a name only you see, and can be up to 30 characters',
            cancelUrl: `/companies/1/lists/add-remove`,
            maxLength: 30,
          },
        })
    })

    context('when there is an error in the render', () => {
      beforeEach(async () => {
        global.middlewareParameters.resMock.render.throws()

        await renderCreateListForm(
          global.middlewareParameters.reqMock,
          global.middlewareParameters.resMock,
          global.middlewareParameters.nextSpy,
        )
      })

      it('should call next with errors', () => {
        expect(global.middlewareParameters.nextSpy).to.be.called
        expect(global.middlewareParameters.nextSpy.firstCall.args[0]).to.be.instanceof(Error)
      })
    })
  })
})
