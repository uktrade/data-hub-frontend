const buildMiddlewareParameters = require('test/unit/helpers/middleware-parameters-builder.js')
const draftFutureMeeting = require('test/unit/data/interactions/draft-future-meeting.json')
const draftPastMeeting = require('test/unit/data/interactions/draft-past-meeting.json')
const interaction = require('test/unit/data/interactions/interaction.json')
const serviceDelivery = require('test/unit/data/interactions/service-delivery.json')

const { detailsController } = require('src/apps/interactions/controllers')

describe('Interaction details controller', () => {
  describe('#renderDetailsPage', () => {
    context('when rendering a complete interaction', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          interaction,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should set the breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Interaction')
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(this.middlewareParameters.resMock.title).to.be.calledWith('ad')
      })

      it('should render the interaction details template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/details')
      })

      it('should render the template with interaction data', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord).to.exist
      })

      it('should render the template with Document details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord.Documents).to.exist
      })

      it('should render the template with canComplete as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canComplete).to.be.false
      })

      it('should render the template with canEdit as true', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canEdit).to.be.true
      })
    })

    context('when rendering a complete service delivery', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          interaction: serviceDelivery,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should set the breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Service delivery')
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(this.middlewareParameters.resMock.title).to.be.calledWith('Test interactions')
      })

      it('should render the interaction details template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/details')
      })

      it('should render the template with interaction data', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord).to.exist
      })

      it('should render the template with Document details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord.Documents).to.exist
      })

      it('should render the template with canComplete as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canComplete).to.be.false
      })

      it('should render the template with canEdit as true', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canEdit).to.be.true
      })
    })

    context('when rendering a draft future meeting', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          interaction: draftFutureMeeting,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should set the breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Interaction')
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(this.middlewareParameters.resMock.title).to.be.calledWith('Future meeting between Brendan and Theodore')
      })

      it('should render the interaction details template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/details')
      })

      it('should render the template without Document details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord.Documents).to.not.exist
      })

      it('should render the template with interaction data', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord).to.exist
      })

      it('should render the template with canComplete as true', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canComplete).to.be.false
      })

      it('should render the template with canEdit as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canEdit).to.be.false
      })
    })

    context('when rendering a draft past meeting', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          interaction: draftPastMeeting,
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should set the breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Interaction')
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(this.middlewareParameters.resMock.title).to.be.calledWith('Past meeting between Brendan and Theodore')
      })

      it('should render the interaction details template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/details')
      })

      it('should render the template without Document details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord.Documents).to.not.exist
      })

      it('should render the template with interaction data', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord).to.exist
      })

      it('should render the template with canComplete as true', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canComplete).to.be.true
      })

      it('should render the template with canEdit as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canEdit).to.be.false
      })
    })

    context('when rendering a draft archived meeting', () => {
      beforeEach(() => {
        this.middlewareParameters = buildMiddlewareParameters({
          interaction: {
            ...draftPastMeeting,
            archived: true,
          },
          requestParams: {
            id: '1234',
          },
        })

        detailsController.renderDetailsPage(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should set the breadcrumb', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Interaction')
        expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledOnce
      })

      it('should set the title', () => {
        expect(this.middlewareParameters.resMock.title).to.be.calledWith('Past meeting between Brendan and Theodore')
      })

      it('should render the interaction details template', () => {
        expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/details')
      })

      it('should render the template without Document details', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord.Documents).to.not.exist
      })

      it('should render the template with interaction data', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].interactionViewRecord).to.exist
      })

      it('should render the template with canComplete as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canComplete).to.be.false
      })

      it('should render the template with canEdit as false', () => {
        expect(this.middlewareParameters.resMock.render.firstCall.args[1].canEdit).to.be.false
      })
    })
  })
})
