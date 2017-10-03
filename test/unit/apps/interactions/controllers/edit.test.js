describe('Interaction edit controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.createBlankInteractionForCompanyStub = this.sandbox.stub()
    this.createBlankInteractionForContactStub = this.sandbox.stub()
    this.transformInteractionResponseToFormStub = this.sandbox.stub()
    this.getContactsForCompanyStub = this.sandbox.stub()
    this.getAllAdvisersStub = this.sandbox.stub()
    this.buildFormWithStateAndErrorsStub = this.sandbox.stub().returns({
      buttonText: 'Save',
      children: [
        { macroName: 'TextField', name: 'subject' },
      ],
    })
    this.interactionEditFormConfigStub = this.sandbox.stub().returns({
    })
    this.getServicesSpy = this.sandbox.spy()

    this.edit = proxyquire('~/src/apps/interactions/controllers/edit', {
      '../services/data': {
        createBlankInteractionForCompany: this.createBlankInteractionForCompanyStub,
        createBlankInteractionForContact: this.createBlankInteractionForContactStub,
      },
      '../transformers': {
        transformInteractionResponseToForm: this.transformInteractionResponseToFormStub,
      },
      '../../contacts/repos': {
        getContactsForCompany: this.getContactsForCompanyStub,
      },
      '../../adviser/repos': {
        getAllAdvisers: this.getAllAdvisersStub,
      },
      '../../../lib/metadata': {
        getServices: this.getServicesSpy,
      },
      '../../builders': {
        buildFormWithStateAndErrors: this.buildFormWithStateAndErrorsStub,
      },
      '../macros': {
        interactionEditFormConfig: this.interactionEditFormConfigStub,
      },
    })

    this.req = {
      session: { token: 'abcd' },
      query: {},
      body: {},
      flash: this.sandbox.spy(),
    }

    this.res = {
      breadcrumb: this.sandbox.stub().returnsThis(),
      render: this.sandbox.spy(),
      redirect: this.sandbox.spy(),
      locals: {},
    }

    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#renderEditPage', () => {
    beforeEach(() => {
      this.req.query.interaction_type = 'tel'
      this.req.session.user = {
        name: 'Spencer',
      }
      this.res.locals.interaction = {
        id: 1,
        interaction_type: {
          name: 'telephone',
          id: 'tel',
        },
        company: {
          name: 'Hooli Inc',
        },
      }
      this.createBlankInteractionForCompanyStub.resolves(this.res.locals.interaction)
      this.createBlankInteractionForContactStub.resolves(this.res.locals.interaction)
      this.transformInteractionResponseToFormStub.returns({
        interaction_type: 'lunch',
        company: 'Hooli',
        subject: 'Introduction',
      })
    })

    context('when errors', () => {
      it('should call next with error', async () => {
        const error = new Error('ouch')
        this.transformInteractionResponseToFormStub.throws(error)

        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.nextSpy).have.been.calledWith(error)
      })
    })

    context('when success', () => {
      it('should call createBlankInteractionForCompany for company', async () => {
        this.req.query.company = 'Hooli Inc'
        const expectedArgs = ['abcd', { name: 'Spencer' }, 'tel', 'Hooli Inc']

        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.createBlankInteractionForCompanyStub).have.been.calledWith(...expectedArgs)
        expect(this.res.breadcrumb).have.been.calledWith('Edit interaction for Hooli Inc')
        expect(this.res.render).have.been.calledWith(sinon.match.string)
      })

      it('should call createBlankInteractionForContact for contact', async () => {
        this.req.query.contact = 'Bob'
        const expectedArgs = ['abcd', { name: 'Spencer' }, 'tel', 'Bob']

        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.createBlankInteractionForContactStub).have.been.calledWith(...expectedArgs)
        expect(this.res.breadcrumb).have.been.calledWith(sinon.match(/Edit interaction/))
        expect(this.res.render).have.been.calledWith(sinon.match.string)
      })

      it('should call functions to populate form options', async () => {
        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.buildFormWithStateAndErrorsStub).have.been.calledWith(sinon.match.object, sinon.match.object, undefined)
        expect(this.interactionEditFormConfigStub).have.been.calledWith(sinon.match.object)
        expect(this.getContactsForCompanyStub).have.been.calledWith('abcd', sinon.match.string)
        expect(this.getAllAdvisersStub).have.been.calledWith('abcd')
        expect(this.getServicesSpy).have.been.calledWith('abcd')
        expect(this.interactionEditFormConfigStub).have.been.calledWith(sinon.match.object)
      })

      it('should create formObject in locals', async () => {
        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.nextSpy).to.not.be.called
        expect(this.res.render).to.be.calledWith(
          sinon.match.string,
          {
            editInteractionForm: {
              buttonText: 'Save',
              children: [
                { macroName: 'TextField', name: 'subject' },
              ],
            },
            interactionTypeLabel: 'telephone',
          },
        )
      })

      it('should render edit view', async () => {
        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.render).have.been.calledWith(sinon.match.string)
      })

      it('should change page title for new interaction', async () => {
        this.res.locals.interaction.id = null
        await this.edit.renderEditPage(this.req, this.res, this.nextSpy)

        expect(this.res.breadcrumb).have.been.calledWith(sinon.match(/Add interaction/))
      })
    })
  })
})
