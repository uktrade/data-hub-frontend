const { handlePolicyPermissions } = require('~/src/apps/interactions/middleware/policy-permissions')

const interactionData = require('~/test/unit/data/interactions/interaction.json')
const serviceDeliveryData = require('~/test/unit/data/interactions/service-delivery.json')
const policyFeedbackData = require('~/test/unit/data/interactions/policy-feedback.json')

const VIEW_POLICY_FEEDBACK = 'interaction.view_policy_feedback_interaction'
const EDIT_POLICY_FEEDBACK = 'interaction.change_policy_feedback_interaction'
const CREATE_POLICY_FEEDBACK = 'interaction.add_policy_feedback_interaction'

describe('#handlePolicyPermissions', () => {
  beforeEach(() => {
    this.req = {
      session: {
        user: {
          permissions: [],
        },
      },
      params: {},
    }

    this.res = {
      locals: {},
    }

    this.next = sinon.stub()
  })

  context('The user tries to view an interaction', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('view')
      this.res.locals.interaction = interactionData
    })

    context('and the user has permission to view a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [VIEW_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to view a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to view a service delivery', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('view')
      this.res.locals.interaction = serviceDeliveryData
    })

    context('and the user has permission to view a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [VIEW_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to view a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = []
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to view a policy feedback', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('view')
      this.res.locals.interaction = policyFeedbackData
    })

    context('and the user has permission to view a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [VIEW_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to view a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = []
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with a 403', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly({ statusCode: 403 })
      })
    })
  })

  context('The user tries to edit an interaction', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('edit')
      this.res.locals.interaction = interactionData
    })

    context('and the user has permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [EDIT_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to edit a service delivery', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('edit')
      this.res.locals.interaction = serviceDeliveryData
    })

    context('and the user has permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [EDIT_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to edit a policy feedback', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('edit')
      this.res.locals.interaction = policyFeedbackData
    })

    context('and the user has permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [EDIT_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to create an interaction', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('create')
      this.req.params.kind = 'interaction'
    })

    context('and the user has permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [CREATE_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to edit a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to create a service delivery', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('create')
      this.req.params.kind = 'service_delivery'
    })

    context('and the user has permission to create a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [CREATE_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to create a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })

  context('The user tries to create a policy feedback', () => {
    beforeEach(() => {
      this.handler = handlePolicyPermissions('create')
      this.req.params.kind = 'policy_feedback'
    })

    context('and the user has permission to create a policy feedback', () => {
      beforeEach(() => {
        this.req.session.user.permissions = [CREATE_POLICY_FEEDBACK]
        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })

    context('and the user does not have permission to create a policy feedback', () => {
      beforeEach(() => {
        this.res.locals.interaction = interactionData
        this.req.session.user.permissions = []

        this.handler(this.req, this.res, this.next)
      })

      it('should call next with no errors', () => {
        expect(this.next).to.be.calledOnce
        expect(this.next).to.be.calledWithExactly()
      })
    })
  })
})
