const proxyquire = require('proxyquire')

describe('Create interaction, step 1', () => {
  let kindFormStub
  let create
  let req, res, next

  beforeEach(() => {
    kindFormStub = sinon.spy()

    create = proxyquire('../create', {
      '../macros': {
        kindForm: kindFormStub,
      },
    })

    req = {
      query: {},
      session: {
        token: '4321',
        user: {
          permissions: ['interaction.add_policy_feedback_interaction'],
        },
      },
      body: {},
      params: {},
    }

    res = {
      breadcrumb: sinon.stub().returnsThis(),
      redirect: sinon.spy(),
      render: sinon.spy(),
      locals: {
        interactions: {
          returnLink: '/return/',
        },
      },
    }

    next = sinon.spy()
  })

  describe('#postcreate', () => {
    context(
      'when a request is made to add an interaction and the theme is "export" and the kind is "interaction"',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'interaction',
              kind_export: 'export_interaction',
            },
            query: {
              company: '1234',
              contact: '4321',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should forward the user to the create interaction page', () => {
          const redirectUrl = res.redirect.firstCall.args[0]
          expect(redirectUrl).to.equal('/return/create/export/interaction')
        })
      }
    )

    context(
      'when a request is made to add an interaction and the theme is "service_delivery" and the kind is "export_service_delivery"',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'service_delivery',
              kind_export: 'export_service_delivery',
            },
            query: {
              company: '1234',
              contact: '4321',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should forward the user to the create interaction page', () => {
          const redirectUrl = res.redirect.firstCall.args[0]
          expect(redirectUrl).to.equal('/return/create/export/service_delivery')
        })
      }
    )

    context(
      'when a request is made to add an interaction and the theme is "investment_interaction" and the kind is "interaction"',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'investment_interaction',
            },
            query: {
              company: '1234',
              contact: '4321',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should forward the user to the create interaction page', () => {
          const redirectUrl = res.redirect.firstCall.args[0]
          expect(redirectUrl).to.equal('/return/create/investment/interaction')
        })
      }
    )

    context(
      'when a request is made to add an interaction and the theme is "service_delivery" and the kind is "interaction"',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'service_delivery',
              kind_other: 'other_interaction',
            },
            query: {
              company: '1234',
              contact: '4321',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should forward the user to the create service delivery page', () => {
          const redirectUrl = res.redirect.firstCall.args[0]
          expect(redirectUrl).to.equal('/return/create/other/interaction')
        })
      }
    )

    context(
      'when a request is made to add an interaction and the theme is "service_delivery" and the kind is "other_service_delivery"',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'service_delivery',
              kind_other: 'other_service_delivery',
            },
            query: {
              company: '1234',
              contact: '4321',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should forward the user to the create service delivery page', () => {
          const redirectUrl = res.redirect.firstCall.args[0]
          expect(redirectUrl).to.equal('/return/create/other/service_delivery')
        })
      }
    )

    context('when a request is made with no theme selected', () => {
      beforeEach(() => {
        req = {
          ...req,
          query: {
            company: '1234',
          },
        }

        create.postCreate(req, res, next)
      })

      it('should add an error to the response', () => {
        expect(res.locals.errors.messages.kind).to.deep.equal([
          'You must select an interaction type',
        ])
      })

      it('should continue onto the render form controller', () => {
        expect(next).to.be.calledOnce
      })
    })

    context(
      'when a request is made with a theme selected but no kind export selected',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'a theme',
              kind_export: '',
            },
            query: {
              company: '1234',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should add an error to the response', () => {
          expect(res.locals.errors.messages.kind).to.deep.equal([
            'You must select what you would like to record',
          ])
        })

        it('should continue onto the render form controller', () => {
          expect(next).to.be.calledOnce
        })
      }
    )

    context(
      'when a request is made with a theme selected but no kind other selected',
      () => {
        beforeEach(() => {
          req = {
            ...req,
            body: {
              theme: 'a theme',
              kind_other: '',
            },
            query: {
              company: '1234',
            },
          }

          create.postCreate(req, res, next)
        })

        it('should add an error to the response', () => {
          expect(res.locals.errors.messages.kind).to.deep.equal([
            'You must select what you would like to record',
          ])
        })

        it('should continue onto the render form controller', () => {
          expect(next).to.be.calledOnce
        })
      }
    )

    context('when a request is made for an existing interaction', () => {
      beforeEach(() => {
        req = {
          ...req,
          body: {
            theme: 'interaction',
            kind_export: 'export_interaction',
          },
          query: {
            company: '1234',
            contact: '4321',
          },
          params: {
            interactionId: '1',
          },
        }

        create.postCreate(req, res, next)
      })

      it('should forward the user to the edit interaction page', () => {
        const redirectUrl = res.redirect.firstCall.args[0]
        expect(redirectUrl).to.equal('/return/1/edit/export/interaction')
      })
    })
  })

  describe('renderCreate', () => {
    context('when a request is made with no errors', () => {
      beforeEach(() => {
        create.renderCreate(req, res, next)
      })

      it('should generate a form with no errors', () => {
        expect(kindFormStub).to.be.calledWith({
          errors: [],
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
      })

      it('render the correct template', () => {
        expect(res.render).to.be.calledWith('interactions/views/create.njk')
      })
    })

    context('when a request is made with errors', () => {
      beforeEach(() => {
        res.locals.errors = {}
        create.renderCreate(req, res, next)
      })

      it('should generate a form with no errors', () => {
        expect(kindFormStub).to.be.calledWith({
          errors: res.locals.errors,
          permissions: ['interaction.add_policy_feedback_interaction'],
        })
      })
    })
  })
})
