const { assign, merge } = require('lodash')

const interactionData = require('../../../data/interactions/new-interaction.json')

describe('Interaction edit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.controller = require('~/src/apps/interactions/controllers/edit')
    this.req = {
      session: {
        token: 'abcd',
        user: {
        },
      },
      query: {
        communication_channel: '1',
      },
      body: {},
    }
    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      title: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {
        company: {
          name: 'company',
        },
        returnLink: 'return',
        interactionType: {
          name: 'interaction type',
        },
      },
    }
    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEditPage', () => {
    it('should render the interaction page', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should render the interaction page with a return link', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

      const actual = this.res.render.getCall(0).args[1].interactionForm.returnLink

      expect(actual).to.equal('return')
    })

    it('should render the interaction page with an interaction form', async () => {
      await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

      const actual = this.res.render.getCall(0).args[1].interactionForm.children

      expect(actual).to.be.an('array')
    })

    context('when adding an interaction', () => {
      it('should add a breadcrumb', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add interaction')
      })

      it('should add a title', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.title.firstCall).to.be.calledWith('Add interaction for company')
      })
    })

    context('when editing an interaction', () => {
      beforeEach(() => {
        this.res.locals.interaction = assign({}, interactionData, { id: '1' })
      })

      it('should add a breadcrumb', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit interaction')
      })

      it('should add a title', async () => {
        await this.controller.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.title.firstCall).to.be.calledWith('Edit interaction for company')
      })
    })

    context('when there are validation errors', () => {
      it('should pre populate the errors', async () => {
        const messages = {
          subject: 'error 1',
          date: 'error 2',
        }

        const fieldLabels = {
          subject: 'Subject',
          date: 'Date of interaction',
        }

        const res = merge({}, this.res, {
          locals: {
            form: {
              errors: {
                messages,
              },
            },
          },
        })

        await this.controller.renderEditPage(this.req, res, this.nextSpy)

        const actualErrors = this.res.render.getCall(0).args[1].interactionForm.errors
        const expectedErrors = {
          summary: 'Please correct the following errors:',
          messages,
          fieldLabels,
        }

        expect(actualErrors).to.deep.equal(expectedErrors)
      })
    })
  })
})
