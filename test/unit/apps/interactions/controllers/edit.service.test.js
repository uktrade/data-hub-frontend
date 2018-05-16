const moment = require('moment')
const { find, pick } = require('lodash')

const config = require('~/config')
const serviceDeliveryData = require('~/test/unit/data/interactions/service-delivery.json')
const controller = require('~/src/apps/interactions/controllers/edit')

const currentUserTeam = '99887766553'

describe('Interaction edit controller (Service delivery)', () => {
  beforeEach(() => {
    this.req = {
      session: {
        token: 'abcd',
        user: {
          id: 'user1',
          dit_team: {
            id: currentUserTeam,
          },
        },
      },
      body: {},
      params: {},
    }

    this.res = {
      breadcrumb: sandbox.stub().returnsThis(),
      title: sandbox.stub().returnsThis(),
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      locals: {},
    }

    this.nextStub = sandbox.stub()

    const yesterday = moment().subtract(1, 'days').toISOString()

    this.metadataMock = {
      teamOptions: [
        { id: '1', name: 'te1', disabled_on: null },
        { id: '2', name: 'te2', disabled_on: yesterday },
        { id: '3', name: 'te3', disabled_on: null },
      ],
      serviceOptions: [
        {
          id: 's1',
          name: 'sv1',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's2',
          name: 'sv2',
          disabled_on: yesterday,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's3',
          name: 'sv3',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
        {
          id: 's4',
          name: 'sv4 (TAP)',
          disabled_on: null,
          contexts: [
            'service_delivery',
            'investment_project_interaction',
            'interaction',
            'event',
          ],
        },
      ],
      channelOptions: [
        { id: '1', name: 'c1', disabled_on: null },
        { id: '2', name: 'c2', disabled_on: yesterday },
        { id: '3', name: 'c3', disabled_on: null },
      ],
      serviceDeliveryOptions: [
        { id: '1', name: 'sds1', disabled_on: null },
        { id: '2', name: 'sds2', disabled_on: yesterday },
        { id: '3', name: 'sds3', disabled_on: null },
      ],
      serviceDeliveryStatus: [
        { id: '1', name: 'ss1', disabled_on: null },
        { id: '2', name: 'ss2', disabled_on: null },
      ],
    }

    this.activeInactiveAdviserData = [{
      id: '1',
      name: 'Jeff Smith',
      is_active: true,
    }, {
      id: '2',
      name: 'John Smith',
      is_active: true,
    }, {
      id: '3',
      name: 'Zac Smith',
      is_active: true,
    }, {
      id: '4',
      name: 'Fred Smith',
      is_active: false,
    }, {
      id: '5',
      name: 'Jim Smith',
      is_active: false,
    }]

    this.contactsData = [
      { id: '999', first_name: 'Fred', last_name: 'Smith', job_title: 'Manager' },
      { id: '998', first_name: 'Emily', last_name: 'Brown', job_title: 'Director' },
    ]

    this.eventsData = [
      { id: '888', name: 'event 1' },
      { id: '889', name: 'event 2' },
    ]
  })

  context('When adding a service delivery from company contact', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'service-delivery',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        contact: {
          id: '2',
          name: 'Fred Bloggs',
        },
        returnLink: '/',
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=service_delivery')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .post('/v3/search/event')
        .reply(200, { results: this.eventsData })
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add service delivery')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith('Add service delivery for Fred Bloggs')
    })

    it('should include a service delivery form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields', () => {
      const fields = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type']))
      expect(fields).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField' },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField' },
        { name: 'is_event', label: 'Is this an event?', macroName: 'MultipleChoiceField', type: 'radio' },
        { name: 'event', label: 'Event', macroName: 'MultipleChoiceField' },
        { name: 'service', label: 'Service', macroName: 'MultipleChoiceField' },
        { name: 'service_delivery_status', label: 'Service status', macroName: 'MultipleChoiceField' },
        { name: 'grant_amount_offered', label: 'Grant offered', macroName: 'TextField' },
        { name: 'net_company_receipt', label: 'Net receipt', macroName: 'TextField' },
        { name: 'subject', label: 'Subject', macroName: 'TextField' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea' },
        { name: 'date', label: 'Date of service delivery', macroName: 'DateFieldset' },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.options).to.deep.equal([
        { value: '999', label: 'Fred Smith, Manager' },
        { value: '998', label: 'Emily Brown, Director' },
      ])
    })

    it('should provide a list of service providers', () => {
      const serviceProviderField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(serviceProviderField.options).to.deep.equal([
        { value: '1', label: 'te1' },
        { value: '3', label: 'te3' },
      ])
    })

    it('should provide a list of services', () => {
      const serviceField = find(this.interactionForm.children, ({ name }) => name === 'service')
      expect(serviceField.options).to.deep.equal([
        { value: 's1', label: 'sv1' },
        { value: 's3', label: 'sv3' },
        { value: 's4', label: 'sv4 (TAP)' },
      ])
    })

    it('should provide a list of advisers', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.options).to.deep.equal([
        { value: '1', label: 'Jeff Smith' },
        { value: '2', label: 'John Smith' },
        { value: '3', label: 'Zac Smith' },
      ])
    })

    it('should provide a list of events', () => {
      const eventField = find(this.interactionForm.children, ({ name }) => name === 'event')
      expect(eventField.options).to.deep.equal([
        { value: '888', label: 'event 1' },
        { value: '889', label: 'event 2' },
      ])
    })

    it('should provide a list of delivery status options', () => {
      const deliveryStatusField = find(this.interactionForm.children, ({ name }) => name === 'service_delivery_status')
      expect(deliveryStatusField.options).to.deep.equal([
        { value: '1', label: 'ss1' },
        { value: '2', label: 'ss2' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should set the default contact to the current contact', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.value).to.equal('2')
    })

    it('should set the default for the service provider to the users team', () => {
      const teamField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(teamField.value).to.equal(currentUserTeam)
    })

    it('should set the default for the adviser to the current user', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.value).to.equal('user1')
    })

    it('should set the interaction date to the current date', () => {
      const dateField = find(this.interactionForm.children, ({ name }) => name === 'date')

      const now = moment()

      expect(dateField.value).to.have.property('year', now.format('YYYY'))
      expect(dateField.value).to.have.property('month', now.format('MM'))
      expect(dateField.value).to.have.property('day', now.format('DD'))
    })

    it('should not include policy feedback as a service option', () => {
      const serviceField = find(this.interactionForm.children, ({ name }) => name === 'service')
      const policyFeedbackOption = find(serviceField.options, ({ label }) => label === 'Policy feedback')
      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link source of the add action', () => {
      expect(this.interactionForm.returnLink).to.equal('/')
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Cancel')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Add service delivery')
    })
  })

  context('When adding a service delivery from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'service-delivery',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        returnLink: '/',
        entityName: 'Fred ltd.',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=service_delivery')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .post('/v3/search/event')
        .reply(200, { results: this.eventsData })
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.value).to.be.undefined
    })
  })

  context('when editing a service delivery from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'service-delivery',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: serviceDeliveryData,
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=service_delivery')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .post('/v3/search/event')
        .reply(200, { results: this.eventsData })
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit service delivery')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith('Edit service delivery')
    })

    it('should include a service delivery form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields and values populated', () => {
      const fields = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type', 'value']))
      expect(fields).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField', value: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField', value: '222' },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField', value: '8036f207-ae3e-e611-8d53-e4115bed50dc' },
        { name: 'is_event', label: 'Is this an event?', macroName: 'MultipleChoiceField', type: 'radio', value: 'true' },
        { name: 'event', label: 'Event', macroName: 'MultipleChoiceField', value: 'bac18331-ca4d-4501-960e-a1bd68b5d46e' },
        { name: 'service', label: 'Service', macroName: 'MultipleChoiceField', value: '1231231231312' },
        { name: 'service_delivery_status', label: 'Service status', macroName: 'MultipleChoiceField', value: undefined },
        { name: 'grant_amount_offered', label: 'Grant offered', macroName: 'TextField', value: undefined },
        { name: 'net_company_receipt', label: 'Net receipt', macroName: 'TextField', value: undefined },
        { name: 'subject', label: 'Subject', macroName: 'TextField', value: 'Test interactions' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea', value: 'lorem ipsum' },
        { name: 'date',
          label: 'Date of service delivery',
          macroName: 'DateFieldset',
          value: {
            day: '31',
            month: '05',
            year: '2017',
          },
        },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(this.interactionForm.children, ({ name }) => name === 'contact')
      expect(contactField.options).to.deep.equal([
        { value: '999', label: 'Fred Smith, Manager' },
        { value: '998', label: 'Emily Brown, Director' },
      ])
    })

    it('should provide a list of service providers at creation time', () => {
      const serviceProviderField = find(this.interactionForm.children, ({ name }) => name === 'dit_team')
      expect(serviceProviderField.options).to.deep.equal([
        { value: '1', label: 'te1' },
        { value: '2', label: 'te2' },
        { value: '3', label: 'te3' },
      ])
    })

    it('should provide a list of services at creation time', () => {
      const serviceField = find(this.interactionForm.children, ({ name }) => name === 'service')
      expect(serviceField.options).to.deep.equal([
        { value: 's1', label: 'sv1' },
        { value: 's2', label: 'sv2' },
        { value: 's3', label: 'sv3' },
        { value: 's4', label: 'sv4 (TAP)' },
      ])
    })

    it('should provide a list of advisers', () => {
      const adviserField = find(this.interactionForm.children, ({ name }) => name === 'dit_adviser')
      expect(adviserField.options).to.deep.equal([
        { value: '1', label: 'Jeff Smith' },
        { value: '2', label: 'John Smith' },
        { value: '3', label: 'Zac Smith' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should set the id in a hidden field', () => {
      const idField = this.interactionForm.hiddenFields.id
      expect(idField).to.equal('af4aac84-4d6a-47df-a733-5a54e3008c32')
    })

    it('should not include policy feedback as a service option', () => {
      const serviceField = find(this.interactionForm.children, ({ name }) => name === 'service')
      const policyFeedbackOption = find(serviceField.options, ({ label }) => label === 'Policy feedback')
      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link to the detail view', () => {
      expect(this.interactionForm.returnLink).to.equal('/interactions/af4aac84-4d6a-47df-a733-5a54e3008c32')
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Return without saving')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Save and return')
    })
  })

  context('when displaying a service delivery that failed to save', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        kind: 'service-delivery',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: serviceDeliveryData,
        form: {
          errors: {
            messages: {
              subject: ['Error message'],
            },
          },
        },
        requestBody: {
          subject: 'a',
        },
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=service_delivery')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .post('/v3/search/event')
        .reply(200, { results: this.eventsData })
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should merge the changes on top of the original record', () => {
      const fields = this.interactionForm.children.map(field => pick(field, ['name', 'label', 'macroName', 'type', 'value']))
      expect(fields).to.deep.equal([
        { name: 'contact', label: 'Contact', macroName: 'MultipleChoiceField', value: 'b4919d5d-8cfb-49d1-a3f8-e4eb4b61e306' },
        { name: 'dit_team', label: 'Service provider', macroName: 'MultipleChoiceField', value: '222' },
        { name: 'dit_adviser', label: 'DIT adviser', macroName: 'MultipleChoiceField', value: '8036f207-ae3e-e611-8d53-e4115bed50dc' },
        { name: 'is_event', label: 'Is this an event?', macroName: 'MultipleChoiceField', type: 'radio', value: 'true' },
        { name: 'event', label: 'Event', macroName: 'MultipleChoiceField', value: 'bac18331-ca4d-4501-960e-a1bd68b5d46e' },
        { name: 'service', label: 'Service', macroName: 'MultipleChoiceField', value: '1231231231312' },
        { name: 'service_delivery_status', label: 'Service status', macroName: 'MultipleChoiceField', value: undefined },
        { name: 'grant_amount_offered', label: 'Grant offered', macroName: 'TextField', value: undefined },
        { name: 'net_company_receipt', label: 'Net receipt', macroName: 'TextField', value: undefined },
        { name: 'subject', label: 'Subject', macroName: 'TextField', value: 'a' },
        { name: 'notes', label: 'Notes', macroName: 'TextField', type: 'textarea', value: 'lorem ipsum' },
        { name: 'date',
          label: 'Date of service delivery',
          macroName: 'DateFieldset',
          value: {
            day: '31',
            month: '05',
            year: '2017',
          },
        },
      ])
    })

    it('should include the error in the form', () => {
      const subjectField = find(this.interactionForm.children, ({ name }) => name === 'subject')
      expect(subjectField.error).to.deep.equal(['Error message'])
    })
  })
})
