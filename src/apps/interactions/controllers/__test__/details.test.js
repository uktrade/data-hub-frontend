const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const draftFutureMeeting = require('../../../../../test/unit/data/interactions/draft-future-meeting.json')
const draftPastMeeting = require('../../../../../test/unit/data/interactions/draft-past-meeting.json')
const interaction = require('../../../../../test/unit/data/interactions/interaction.json')
const serviceDelivery = require('../../../../../test/unit/data/interactions/service-delivery.json')

const { detailsController } = require('../index')

describe('Interaction details controller', () => {
  describe('#renderDetailsPage', () => {
    let middlewareParameters
    context('when rendering a complete interaction', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          interaction,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should set the breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
          'Interaction'
        )
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(middlewareParameters.resMock.title).to.be.calledWith('ad')
      })

      it('should render the interaction details template', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith(
          'interactions/views/details'
        )
      })

      it('should render the template with interaction data', () => {
        expect(
          middlewareParameters.resMock.render.firstCall.args[1]
            .interactionViewRecord
        ).to.exist
      })

      it('should render the template with canComplete as false', () => {
        expect(
          middlewareParameters.resMock.render.firstCall.args[1].canComplete
        ).to.be.false
      })

      it('should render the template with canEdit as true', () => {
        expect(middlewareParameters.resMock.render.firstCall.args[1].canEdit).to
          .be.true
      })
    })

    context('when rendering a complete service delivery', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          interaction: serviceDelivery,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should set the breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
          'Service delivery'
        )
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(middlewareParameters.resMock.title).to.be.calledWith(
          'Test interactions'
        )
      })

      it('should render the interaction details template', () => {
        expect(middlewareParameters.resMock.render).to.be.calledWith(
          'interactions/views/details'
        )
      })

      it('should render the template with interaction data', () => {
        expect(
          middlewareParameters.resMock.render.firstCall.args[1]
            .interactionViewRecord
        ).to.exist
      })

      it('should render the template with canComplete as false', () => {
        expect(
          middlewareParameters.resMock.render.firstCall.args[1].canComplete
        ).to.be.false
      })

      it('should render the template with canEdit as true', () => {
        expect(middlewareParameters.resMock.render.firstCall.args[1].canEdit).to
          .be.true
      })
    })

    context('when rendering a draft future meeting', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          interaction: draftFutureMeeting,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should set the breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
          'Interaction'
        )
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(middlewareParameters.resMock.title).to.be.calledWith(
          'Future meeting between Brendan and Theodore'
        )
      })

      it('should render the interaction details template with the correct data', () => {
        const render = middlewareParameters.resMock.render
        const data = render.firstCall.args[1]

        expect(render).to.be.calledWith('interactions/views/details')

        expect(data.interactionViewRecord.Documents).to.not.exist
        expect(data.interactionViewRecord).to.exist
        expect(data.canComplete).to.be.false
        expect(data.canEdit).to.be.false
      })
    })

    context('when rendering a draft past meeting', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          interaction: draftPastMeeting,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should set the breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
          'Interaction'
        )
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(middlewareParameters.resMock.title).to.be.calledWith(
          'Past meeting between Brendan and Theodore'
        )
      })

      it('should render the interaction details template with the correct data', () => {
        const render = middlewareParameters.resMock.render
        const data = render.firstCall.args[1]

        expect(render).to.be.calledWith('interactions/views/details')

        expect(data.interactionViewRecord.Documents).to.not.exist
        expect(data.interactionViewRecord).to.exist
        expect(data.canComplete).to.be.true
        expect(data.canEdit).to.be.false
      })
    })

    context('when rendering a draft archived meeting', () => {
      beforeEach(() => {
        middlewareParameters = buildMiddlewareParameters({
          interaction: {
            ...draftPastMeeting,
            archived: true,
          },
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should set the breadcrumb', () => {
        expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
          'Interaction'
        )
        expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(middlewareParameters.resMock.title).to.be.calledWith(
          'Past meeting between Brendan and Theodore'
        )
      })

      it('should render the interaction details template with the correct data', () => {
        const render = middlewareParameters.resMock.render
        const data = render.firstCall.args[1]

        expect(render).to.be.calledWith('interactions/views/details')

        expect(data.interactionViewRecord.Documents).to.not.exist
        expect(data.interactionViewRecord).to.exist
        expect(data.canComplete).to.be.false
        expect(data.canEdit).to.be.false
      })
    })
  })
})
