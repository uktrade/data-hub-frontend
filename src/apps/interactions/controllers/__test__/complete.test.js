const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const draftPastMeeting = require('../../../../../test/unit/data/interactions/draft-past-meeting.json')
const { completeController } = require('../index')
const { ERROR } = require('../../../constants')
const urls = require('../../../../lib/urls')

describe('Interaction details controller', () => {
  let middlewareParameters

  describe('#renderCompletePage', () => {
    beforeEach(() => {
      middlewareParameters = buildMiddlewareParameters({
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
        middlewareParameters.reqMock,
        middlewareParameters.resMock,
        middlewareParameters.nextSpy
      )
    })

    it('should set the breadcrumbs', () => {
      expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
        'breadcrumb',
        'href'
      )
      expect(middlewareParameters.resMock.breadcrumb).to.be.calledWithExactly(
        'Interaction'
      )
      expect(middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
    })

    it('should set the title', () => {
      expect(middlewareParameters.resMock.title).to.be.calledWith(
        'Did the meeting take place?'
      )
    })

    it('should render the interaction complete template', () => {
      expect(middlewareParameters.resMock.render).to.be.calledWith(
        'interactions/views/complete'
      )
    })

    it('should render the template with a form', () => {
      expect(
        middlewareParameters.resMock.render.firstCall.args[1].meetingHappenForm
      ).to.exist
    })
  })

  describe('#postComplete', () => {
    let saveInteractionStub
    let archiveInteractionStub

    context('when the user does not select a meeting happen option', () => {
      beforeEach(() => {
        saveInteractionStub = sinon.stub()
        archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: saveInteractionStub,
            archiveInteraction: archiveInteractionStub,
          },
        })

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {},
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(saveInteractionStub).to.not.have.been.called
      })

      it('should not archive the interaction', () => {
        expect(archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not redirect to the entity', () => {
        expect(middlewareParameters.resMock.redirect).to.not.have.been.called
      })

      it('should set the errors', () => {
        expect(middlewareParameters.resMock.locals.errors).to.deep.equal({
          meeting_happen: [ERROR.SELECT_AN_OPTION],
        })
      })

      it('should call next once', () => {
        expect(middlewareParameters.nextSpy).calledOnceWithExactly()
      })
    })

    context('when the user selects "No" and a valid archived reason', () => {
      beforeEach(() => {
        saveInteractionStub = sinon.stub()
        archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: saveInteractionStub,
            archiveInteraction: archiveInteractionStub,
          },
        })

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'false',
            archived_reason: 'reason',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(saveInteractionStub).to.not.have.been.called
      })

      it('should archive the interaction', () => {
        expect(archiveInteractionStub).calledOnceWithExactly(
          middlewareParameters.reqMock,
          draftPastMeeting.id,
          'reason'
        )
      })

      it('should call flash message', () => {
        expect(middlewareParameters.reqMock.flash).calledOnceWithExactly(
          'success',
          'The interaction has been updated'
        )
      })

      it('should redirect to the interactions', () => {
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          urls.companies.interactions.index(draftPastMeeting.company.id)
        )
      })

      it('should not set the errors', () => {
        expect(middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should not call next', () => {
        expect(middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context(
      'when the user selects "No" and does not select an archived reason option',
      () => {
        beforeEach(() => {
          saveInteractionStub = sinon.stub()
          archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: saveInteractionStub,
              archiveInteraction: archiveInteractionStub,
            },
          })

          middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should not save the interaction', () => {
          expect(saveInteractionStub).to.not.have.been.called
        })

        it('should not archive the interaction', () => {
          expect(archiveInteractionStub).to.not.have.been.called
        })

        it('should not call flash message', () => {
          expect(middlewareParameters.reqMock.flash).to.not.have.been.called
        })

        it('should not redirect to the entity', () => {
          expect(middlewareParameters.resMock.redirect).to.not.have.been.called
        })

        it('should set the errors', () => {
          expect(middlewareParameters.resMock.locals.errors).to.deep.equal({
            archived_reason: [ERROR.SELECT_AN_OPTION],
          })
        })

        it('should call next once', () => {
          expect(middlewareParameters.nextSpy).calledOnceWithExactly()
        })
      }
    )

    context(
      'when the user selects "No" and "Rescheduled" and does not enter a date',
      () => {
        beforeEach(() => {
          saveInteractionStub = sinon.stub()
          archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: saveInteractionStub,
              archiveInteraction: archiveInteractionStub,
            },
          })

          middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
              archived_reason: 'Rescheduled',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should not save the interaction', () => {
          expect(saveInteractionStub).to.not.have.been.called
        })

        it('should not archive the interaction', () => {
          expect(archiveInteractionStub).to.not.have.been.called
        })

        it('should not call flash message', () => {
          expect(middlewareParameters.reqMock.flash).to.not.have.been.called
        })

        it('should not redirect to the entity', () => {
          expect(middlewareParameters.resMock.redirect).to.not.have.been.called
        })

        it('should set the errors', () => {
          expect(middlewareParameters.resMock.locals.errors).to.deep.equal({
            date: [ERROR.ENTER_A_DATE],
          })
        })

        it('should call next once', () => {
          expect(middlewareParameters.nextSpy).calledOnceWithExactly()
        })
      }
    )

    context(
      'when the user selects "No" and "Rescheduled" and does enter a date',
      () => {
        beforeEach(() => {
          saveInteractionStub = sinon.stub()
          archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: saveInteractionStub,
              archiveInteraction: archiveInteractionStub,
            },
          })

          middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
              archived_reason: 'Rescheduled',
              date: 'date',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            middlewareParameters.reqMock,
            middlewareParameters.resMock,
            middlewareParameters.nextSpy
          )
        })

        it('should save the interaction', () => {
          expect(saveInteractionStub).calledOnceWithExactly(
            middlewareParameters.reqMock,
            {
              date: 'date',
              id: '888c12ee-91db-4964-908e-0f18ce823096',
            }
          )
        })

        it('should not archive the interaction', () => {
          expect(archiveInteractionStub).to.not.have.been.called
        })

        it('should call flash message', () => {
          expect(middlewareParameters.reqMock.flash).calledOnceWithExactly(
            'success',
            'The interaction has been updated'
          )
        })

        it('should redirect to the interactions', () => {
          expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
            urls.companies.interactions.index(draftPastMeeting.company.id)
          )
        })

        it('should not set the errors', () => {
          expect(middlewareParameters.resMock.locals.errors).to.not.exist
        })

        it('should not call next', () => {
          expect(middlewareParameters.nextSpy).to.not.have.been.called
        })
      }
    )

    context('when saving responds with an error', () => {
      beforeEach(() => {
        saveInteractionStub = sinon.stub()
        saveInteractionStub.rejects({ statusCode: 500, error: 'error' })
        archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: saveInteractionStub,
            archiveInteraction: archiveInteractionStub,
          },
        })

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'false',
            archived_reason: 'Rescheduled',
            date: 'date',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should attempt to save the interaction', () => {
        expect(saveInteractionStub).to.be.calledOnce
      })

      it('should not archive the interaction', () => {
        expect(archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not redirect to the entity', () => {
        expect(middlewareParameters.resMock.redirect).to.not.have.been.called
      })

      it('should not set the errors', () => {
        expect(middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should call next once', () => {
        expect(middlewareParameters.nextSpy).have.been.calledOnceWithExactly({
          statusCode: 500,
          error: 'error',
        })
      })
    })

    context('when the user selects "Yes"', () => {
      beforeEach(() => {
        saveInteractionStub = sinon.stub()
        archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: saveInteractionStub,
            archiveInteraction: archiveInteractionStub,
          },
        })

        middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'true',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          middlewareParameters.reqMock,
          middlewareParameters.resMock,
          middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(saveInteractionStub).to.not.have.been.called
      })

      it('should not archive the interaction', () => {
        expect(archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should redirect to the interaction create journey', () => {
        const expectedPath = urls.companies.interactions.edit(
          draftPastMeeting.company.id,
          draftPastMeeting.id
        )
        expect(middlewareParameters.resMock.redirect).calledOnceWithExactly(
          expectedPath
        )
      })

      it('should not set the errors', () => {
        expect(middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should not call next', () => {
        expect(middlewareParameters.nextSpy).to.not.have.been.called
      })
    })
  })
})
