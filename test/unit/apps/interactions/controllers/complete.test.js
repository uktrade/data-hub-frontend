const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')
const draftPastMeeting = require('~/test/unit/data/interactions/draft-past-meeting.json')

const { completeController } = require('~/src/apps/interactions/controllers')

describe('Interaction details controller', () => {
  describe('#renderCompletePage', () => {
    beforeEach(() => {
      this.middlewareParameters = buildMiddlewareParameters({
        interaction: draftPastMeeting,
        interactions: {
          breadcrumbs: [
            {
              text: 'breadcrumb',
              href: 'href',
            },
          ],
        },
      })

      completeController.renderCompletePage(
        this.middlewareParameters.reqMock,
        this.middlewareParameters.resMock,
        this.middlewareParameters.nextSpy,
      )
    })

    it('should set the breadcrumbs', () => {
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('breadcrumb', 'href')
      expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly('Interaction')
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
    })

    it('should set the title', () => {
      expect(this.middlewareParameters.resMock.title).to.be.calledWith('Did the meeting take place?')
    })

    it('should render the interaction complete template', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledWith('interactions/views/complete')
    })

    it('should render the template with a form', () => {
      expect(this.middlewareParameters.resMock.render.firstCall.args[1].meetingHappenForm).to.exist
    })
  })
})
