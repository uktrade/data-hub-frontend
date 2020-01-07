const proxyquire = require('proxyquire')

const buildMiddlewareParameters = require('../../../../../test/unit/helpers/middleware-parameters-builder')
const draftPastMeeting = require('../../../../../test/unit/data/interactions/draft-past-meeting.json')
const { completeController } = require('../index')
const { ERROR } = require('../../../constants')

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
        this.middlewareParameters.nextSpy
      )
    })

    it('should set the breadcrumbs', () => {
      expect(
        this.middlewareParameters.resMock.breadcrumb
      ).to.be.calledWithExactly('breadcrumb', 'href')
      expect(
        this.middlewareParameters.resMock.breadcrumb
      ).to.be.calledWithExactly('Interaction')
      expect(this.middlewareParameters.resMock.breadcrumb).to.have.been
        .calledTwice
    })

    it('should set the title', () => {
      expect(this.middlewareParameters.resMock.title).to.be.calledWith(
        'Did the meeting take place?'
      )
    })

    it('should render the interaction complete template', () => {
      expect(this.middlewareParameters.resMock.render).to.be.calledWith(
        'interactions/views/complete'
      )
    })

    it('should render the template with a form', () => {
      expect(
        this.middlewareParameters.resMock.render.firstCall.args[1]
          .meetingHappenForm
      ).to.exist
    })
  })

  describe('#postComplete', () => {
    context('when the user does not select a meeting happen option', () => {
      beforeEach(() => {
        this.saveInteractionStub = sinon.stub()
        this.archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: this.saveInteractionStub,
            archiveInteraction: this.archiveInteractionStub,
          },
        })

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {},
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(this.saveInteractionStub).to.not.have.been.called
      })

      it('should not archive the interaction', () => {
        expect(this.archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not redirect to the entity', () => {
        expect(this.middlewareParameters.resMock.redirect).to.not.have.been
          .called
      })

      it('should set the errors', () => {
        expect(this.middlewareParameters.resMock.locals.errors).to.deep.equal({
          meeting_happen: [ERROR.SELECT_AN_OPTION],
        })
      })

      it('should call next once', () => {
        expect(this.middlewareParameters.nextSpy).calledOnceWithExactly()
      })
    })

    context('when the user selects "No" and a valid archived reason', () => {
      beforeEach(() => {
        this.saveInteractionStub = sinon.stub()
        this.archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: this.saveInteractionStub,
            archiveInteraction: this.archiveInteractionStub,
          },
        })

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'false',
            archived_reason: 'reason',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(this.saveInteractionStub).to.not.have.been.called
      })

      it('should archive the interaction', () => {
        expect(this.archiveInteractionStub).calledOnceWithExactly(
          '1234',
          draftPastMeeting.id,
          'reason'
        )
      })

      it('should call flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).calledOnceWithExactly(
          'success',
          'The interaction has been updated'
        )
      })

      it('should redirect to the interactions', () => {
        expect(
          this.middlewareParameters.resMock.redirect
        ).calledOnceWithExactly(
          `/companies/${draftPastMeeting.company.id}/interactions`
        )
      })

      it('should not set the errors', () => {
        expect(this.middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should not call next', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })

    context(
      'when the user selects "No" and does not select an archived reason option',
      () => {
        beforeEach(() => {
          this.saveInteractionStub = sinon.stub()
          this.archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: this.saveInteractionStub,
              archiveInteraction: this.archiveInteractionStub,
            },
          })

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should not save the interaction', () => {
          expect(this.saveInteractionStub).to.not.have.been.called
        })

        it('should not archive the interaction', () => {
          expect(this.archiveInteractionStub).to.not.have.been.called
        })

        it('should not call flash message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.not.have.been
            .called
        })

        it('should not redirect to the entity', () => {
          expect(this.middlewareParameters.resMock.redirect).to.not.have.been
            .called
        })

        it('should set the errors', () => {
          expect(this.middlewareParameters.resMock.locals.errors).to.deep.equal(
            {
              archived_reason: [ERROR.SELECT_AN_OPTION],
            }
          )
        })

        it('should call next once', () => {
          expect(this.middlewareParameters.nextSpy).calledOnceWithExactly()
        })
      }
    )

    context(
      'when the user selects "No" and "Rescheduled" and does not enter a date',
      () => {
        beforeEach(() => {
          this.saveInteractionStub = sinon.stub()
          this.archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: this.saveInteractionStub,
              archiveInteraction: this.archiveInteractionStub,
            },
          })

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
              archived_reason: 'Rescheduled',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should not save the interaction', () => {
          expect(this.saveInteractionStub).to.not.have.been.called
        })

        it('should not archive the interaction', () => {
          expect(this.archiveInteractionStub).to.not.have.been.called
        })

        it('should not call flash message', () => {
          expect(this.middlewareParameters.reqMock.flash).to.not.have.been
            .called
        })

        it('should not redirect to the entity', () => {
          expect(this.middlewareParameters.resMock.redirect).to.not.have.been
            .called
        })

        it('should set the errors', () => {
          expect(this.middlewareParameters.resMock.locals.errors).to.deep.equal(
            {
              date: [ERROR.ENTER_A_DATE],
            }
          )
        })

        it('should call next once', () => {
          expect(this.middlewareParameters.nextSpy).calledOnceWithExactly()
        })
      }
    )

    context(
      'when the user selects "No" and "Rescheduled" and does enter a date',
      () => {
        beforeEach(() => {
          this.saveInteractionStub = sinon.stub()
          this.archiveInteractionStub = sinon.stub()

          const controller = proxyquire('../complete', {
            '../repos': {
              saveInteraction: this.saveInteractionStub,
              archiveInteraction: this.archiveInteractionStub,
            },
          })

          this.middlewareParameters = buildMiddlewareParameters({
            requestBody: {
              meeting_happen: 'false',
              archived_reason: 'Rescheduled',
              date: 'date',
            },
            interaction: draftPastMeeting,
          })

          return controller.postComplete(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy
          )
        })

        it('should save the interaction', () => {
          expect(this.saveInteractionStub).calledOnceWithExactly('1234', {
            date: 'date',
            id: '888c12ee-91db-4964-908e-0f18ce823096',
          })
        })

        it('should not archive the interaction', () => {
          expect(this.archiveInteractionStub).to.not.have.been.called
        })

        it('should call flash message', () => {
          expect(this.middlewareParameters.reqMock.flash).calledOnceWithExactly(
            'success',
            'The interaction has been updated'
          )
        })

        it('should redirect to the interactions', () => {
          expect(
            this.middlewareParameters.resMock.redirect
          ).calledOnceWithExactly(
            `/companies/${draftPastMeeting.company.id}/interactions`
          )
        })

        it('should not set the errors', () => {
          expect(this.middlewareParameters.resMock.locals.errors).to.not.exist
        })

        it('should not call next', () => {
          expect(this.middlewareParameters.nextSpy).to.not.have.been.called
        })
      }
    )

    context('when saving responds with an error', () => {
      beforeEach(() => {
        this.saveInteractionStub = sinon.stub()
        this.saveInteractionStub.rejects({ statusCode: 500, error: 'error' })
        this.archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: this.saveInteractionStub,
            archiveInteraction: this.archiveInteractionStub,
          },
        })

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'false',
            archived_reason: 'Rescheduled',
            date: 'date',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should attempt to save the interaction', () => {
        expect(this.saveInteractionStub).to.be.calledOnce
      })

      it('should not archive the interaction', () => {
        expect(this.archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should not redirect to the entity', () => {
        expect(this.middlewareParameters.resMock.redirect).to.not.have.been
          .called
      })

      it('should not set the errors', () => {
        expect(this.middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should call next once', () => {
        expect(
          this.middlewareParameters.nextSpy
        ).have.been.calledOnceWithExactly({ statusCode: 500, error: 'error' })
      })
    })

    context('when the user selects "Yes"', () => {
      beforeEach(() => {
        this.saveInteractionStub = sinon.stub()
        this.archiveInteractionStub = sinon.stub()

        const controller = proxyquire('../complete', {
          '../repos': {
            saveInteraction: this.saveInteractionStub,
            archiveInteraction: this.archiveInteractionStub,
          },
        })

        this.middlewareParameters = buildMiddlewareParameters({
          requestBody: {
            meeting_happen: 'true',
          },
          interaction: draftPastMeeting,
        })

        return controller.postComplete(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy
        )
      })

      it('should not save the interaction', () => {
        expect(this.saveInteractionStub).to.not.have.been.called
      })

      it('should not archive the interaction', () => {
        expect(this.archiveInteractionStub).to.not.have.been.called
      })

      it('should not call flash message', () => {
        expect(this.middlewareParameters.reqMock.flash).to.not.have.been.called
      })

      it('should redirect to the interaction create journey', () => {
        const expectedPath = `/companies/${draftPastMeeting.company.id}/interactions/${draftPastMeeting.id}/create`
        expect(
          this.middlewareParameters.resMock.redirect
        ).calledOnceWithExactly(expectedPath)
      })

      it('should not set the errors', () => {
        expect(this.middlewareParameters.resMock.locals.errors).to.not.exist
      })

      it('should not call next', () => {
        expect(this.middlewareParameters.nextSpy).to.not.have.been.called
      })
    })
  })
})
