const moment = require('moment')
const { find, pick } = require('lodash')

const config = require('~/config')
const controller = require('~/src/apps/interactions/controllers/edit')
const interactionData = require('~/test/unit/data/interactions/interaction.json')
const serviceOptionData = require('~/test/unit/data/interactions/service-options-data.json')

const currentUserTeam = '99887766553'

describe('Interaction edit controller (Interactions)', () => {
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
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    this.nextStub = sinon.stub()

    const yesterday = moment()
      .subtract(1, 'days')
      .toISOString()

    this.metadataMock = {
      teamOptions: [
        { id: '1', name: 'te1', disabled_on: null },
        { id: '2', name: 'te2', disabled_on: yesterday },
        { id: '3', name: 'te3', disabled_on: null },
      ],
      channelOptions: [
        { id: '1', name: 'c1', disabled_on: null },
        { id: '2', name: 'c2', disabled_on: yesterday },
        { id: '3', name: 'c3', disabled_on: null },
      ],
      serviceOptions: serviceOptionData,
      serviceDeliveryOptions: [
        { id: '1', name: 'sds1', disabled_on: null },
        { id: '2', name: 'sds2', disabled_on: yesterday },
        { id: '3', name: 'sds3', disabled_on: null },
      ],
      serviceDeliveryStatus: [
        { id: '1', name: 'ss1', disabled_on: null },
        { id: '2', name: 'ss2', disabled_on: null },
        { id: '3', name: 'ss3', disabled_on: null },
      ],
      policyAreaOptions: [
        { id: '1', name: 'pa1', disabled_on: null },
        { id: '2', name: 'pa2', disabled_on: yesterday },
        { id: '3', name: 'pa3', disabled_on: null },
      ],
      policyIssueType: [
        { id: '1', name: 'pt1', disabled_on: null },
        { id: '2', name: 'pt2', disabled_on: yesterday },
        { id: '3', name: 'pt3', disabled_on: null },
      ],
    }

    this.activeInactiveAdviserData = [
      {
        id: '1',
        name: 'Jeff Smith',
        is_active: true,
      },
      {
        id: '2',
        name: 'John Smith',
        is_active: true,
      },
      {
        id: '3',
        name: 'Zac Smith',
        is_active: true,
      },
      {
        id: '4',
        name: 'Fred Smith',
        is_active: false,
      },
      {
        id: '5',
        name: 'Jim Smith',
        is_active: false,
      },
    ]

    this.contactsData = [
      {
        id: '999',
        first_name: 'Fred',
        last_name: 'Smith',
        job_title: 'Manager',
      },
      {
        id: '998',
        first_name: 'Emily',
        last_name: 'Brown',
        job_title: 'Director',
      },
    ]
  })

  context('When adding an other interaction', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'other',
        kind: 'interaction',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
        interactions: {
          returnLink: '/return',
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=other_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })
    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })
  })

  context('When adding an investment interaction', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'investment',
        kind: 'interaction',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
        interactions: {
          returnLink: '/return',
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=investment_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })
    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })
  })

  context('When adding an interaction from company contact', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'export',
        kind: 'interaction',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
        interactions: {
          returnLink: '/return',
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=export_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Add interaction')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith(
        'Add interaction for Fred Bloggs'
      )
    })

    it('should include an interaction form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields', () => {
      const fieldNames = this.interactionForm.children.map(field =>
        pick(field, [
          'name',
          'label',
          'macroName',
          'type',
          'heading',
          'secondaryHeading',
        ])
      )
      expect(fieldNames).to.deep.equal([
        {
          label: undefined,
          macroName: 'FormSubHeading',
          heading: 'Service',
        },
        {
          name: 'service',
          label: 'Service',
          macroName: 'MultipleChoiceField',
        },
        {
          name: 'subService',
          label: 'Sub service',
          macroName: 'MultipleChoiceField',
        },
        {
          name: 'sv2-q1',
          label: 'What did you give advice about?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
        },
        {
          name: 'sv2-q2',
          label: 'Another question?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
        },
        {
          name: 'sv3-q1',
          label: 'Who was the company introduced to?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          heading: 'Interaction Participants',
          secondaryHeading: 'Fred ltd.',
        },
        {
          name: 'contacts',
          label: 'Contact(s)',
          macroName: 'AddAnother',
        },
        {
          name: 'dit_participants',
          label: 'Adviser(s)',
          macroName: 'AddAnother',
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          heading: 'Details',
        },
        {
          name: 'date',
          label: 'Date of interaction',
          macroName: 'DateFieldset',
        },
        {
          name: 'communication_channel',
          label: 'Communication channel',
          macroName: 'MultipleChoiceField',
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          heading: 'Notes',
        },
        { name: 'subject', label: 'Subject', macroName: 'TextField' },
        {
          name: 'notes',
          label: 'Notes',
          macroName: 'TextField',
          type: 'textarea',
        },
        {
          name: 'was_policy_feedback_provided',
          label: 'Did the contact give any feedback on government policy?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
        },
        {
          name: 'policy_issue_types',
          label: 'Policy issue types',
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
        },
        {
          name: 'policy_areas',
          label: 'Policy area',
          macroName: 'AddAnother',
        },
        {
          name: 'policy_feedback_notes',
          label: 'Policy feedback notes',
          macroName: 'TextField',
          type: 'textarea',
        },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(
        this.interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      const contact = contactField.children[0].options
      expect(contact).to.deep.equal([
        { value: '998', label: 'Emily Brown, Director' },
        { value: '999', label: 'Fred Smith, Manager' },
      ])
    })

    it('should provide a list of services', () => {
      const serviceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'service'
      )
      expect(serviceField.options).to.deep.equal([
        {
          value: 'sv1',
          label: 'Account Management',
          isControlledBySecondary: false,
        },
        {
          value: 'Providing Export Advice & Information',
          label: 'Providing Export Advice & Information',
          isControlledBySecondary: false,
        },
        {
          value: 'sv3',
          label: 'Making Introductions (Export)',
          isControlledBySecondary: false,
        },
      ])
    })

    it('should provide a list of sub services', () => {
      const subServiceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'subService'
      )
      expect(subServiceField.options).to.deep.equal([
        { value: 'sv2', label: 'Advice & information' },
      ])
    })

    it('should provide a list of communication channels', () => {
      const communicationChannelField = find(
        this.interactionForm.children,
        ({ name }) => name === 'communication_channel'
      )
      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '2', label: 'c2' },
        { value: '3', label: 'c3' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should set the default contact to the current contact', () => {
      const contactField = find(
        this.interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      const contact = contactField.children[0].options
      expect(contact).to.deep.equal([
        { value: '998', label: 'Emily Brown, Director' },
        { value: '999', label: 'Fred Smith, Manager' },
      ])
    })

    it('should set the default for the adviser to the current user', () => {
      const adviserField = find(
        this.interactionForm.children,
        ({ name }) => name === 'dit_participants'
      )
      expect(adviserField.value).to.deep.equal([1])
    })

    it('should set the interaction date to the current date', () => {
      const dateField = find(
        this.interactionForm.children,
        ({ name }) => name === 'date'
      )
      expect(dateField.value).to.have.property('year', '2058')
      expect(dateField.value).to.have.property('month', '11')
      expect(dateField.value).to.have.property('day', '25')
    })

    it('should not include policy feedback as a service option', () => {
      const serviceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'service'
      )
      const policyFeedbackOption = find(
        serviceField.options,
        ({ label }) => label === 'Policy feedback'
      )
      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link source of the add action', () => {
      expect(this.interactionForm.returnLink).to.equal('/return')
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Cancel')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Add interaction')
    })
  })

  context('When adding an interaction from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'export',
        kind: 'interaction',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        entityName: 'Fred ltd.',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=export_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(
        this.interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      expect(contactField.value).to.be.null
    })
  })

  context('when editing an interaction from a company', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'export',
        kind: 'interaction',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get('/metadata/service/?contexts__has_any=export_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(this.res.render).to.be.calledWith('interactions/views/edit')
      expect(this.res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(this.res.breadcrumb.firstCall).to.be.calledWith('Edit interaction')
    })

    it('should add a title', () => {
      expect(this.res.title.firstCall).to.be.calledWith('Edit interaction')
    })

    it('should include an interaction form', async () => {
      const actual = this.res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields and values populated', () => {
      const fields = this.interactionForm.children.map(field =>
        pick(field, [
          'name',
          'label',
          'macroName',
          'type',
          'value',
          'heading',
          'secondaryHeading',
        ])
      )
      expect(fields).to.deep.equal([
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Service',
        },
        {
          name: 'service',
          label: 'Service',
          macroName: 'MultipleChoiceField',
          value: 'sv1',
        },
        {
          name: 'subService',
          label: 'Sub service',
          macroName: 'MultipleChoiceField',
          value: undefined,
        },
        {
          name: 'sv2-q1',
          label: 'What did you give advice about?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          name: 'sv2-q2',
          label: 'Another question?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          name: 'sv3-q1',
          label: 'Who was the company introduced to?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Interaction Participants',
          secondaryHeading: 'Fred ltd.',
        },
        {
          name: 'contacts',
          label: 'Contact(s)',
          macroName: 'AddAnother',
          value: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        },
        {
          name: 'dit_participants',
          label: 'Adviser(s)',
          macroName: 'AddAnother',
          value: [1],
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Details',
        },
        {
          name: 'date',
          label: 'Date of interaction',
          macroName: 'DateFieldset',
          value: { day: '25', month: '11', year: '2058' },
        },
        {
          name: 'communication_channel',
          label: 'Communication channel',
          macroName: 'MultipleChoiceField',
          value: '70c226d7-5d95-e211-a939-e4115bead28a',
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Notes',
        },
        {
          name: 'subject',
          label: 'Subject',
          macroName: 'TextField',
          value: 'ad',
        },
        {
          name: 'notes',
          label: 'Notes',
          macroName: 'TextField',
          type: 'textarea',
          value: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        },
        {
          name: 'was_policy_feedback_provided',
          label: 'Did the contact give any feedback on government policy?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: 'true',
        },
        {
          name: 'policy_issue_types',
          label: 'Policy issue types',
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
          value: ['c1f1e29b-17ba-402f-ac98-aa23f9dc9bcb'],
        },
        {
          name: 'policy_areas',
          label: 'Policy area',
          macroName: 'AddAnother',
          value: ['9feefd50-7f4c-4b73-a33e-779121d40419'],
        },
        {
          name: 'policy_feedback_notes',
          label: 'Policy feedback notes',
          macroName: 'TextField',
          type: 'textarea',
          value: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(
        this.interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      const contacts = contactField.children[0]
      expect(contacts.options).to.deep.equal([
        { value: '998', label: 'Emily Brown, Director' },
        { value: '999', label: 'Fred Smith, Manager' },
      ])
    })

    it('should provide a list of services at creation time', () => {
      const serviceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'service'
      )
      expect(serviceField.options).to.deep.equal([
        {
          value: 'sv1',
          label: 'Account Management',
          isControlledBySecondary: false,
        },
        {
          value: 'Providing Export Advice & Information',
          label: 'Providing Export Advice & Information',
          isControlledBySecondary: false,
        },
        {
          value: 'sv3',
          label: 'Making Introductions (Export)',
          isControlledBySecondary: false,
        },
      ])
    })

    it('should provide a list of sub services at creation time', () => {
      const subSrviceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'subService'
      )
      expect(subSrviceField.options).to.deep.equal([
        { value: 'sv2', label: 'Advice & information' },
      ])
    })

    it('should provide a list of communication channels at creation time', () => {
      const communicationChannelField = find(
        this.interactionForm.children,
        ({ name }) => name === 'communication_channel'
      )
      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '2', label: 'c2' },
        { value: '3', label: 'c3' },
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
      const serviceField = find(
        this.interactionForm.children,
        ({ name }) => name === 'service'
      )
      const policyFeedbackOption = find(
        serviceField.options,
        ({ label }) => label === 'Policy feedback'
      )
      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link to the detail view', () => {
      expect(this.interactionForm.returnLink).to.equal(
        '/interactions/af4aac84-4d6a-47df-a733-5a54e3008c32'
      )
    })

    it('should set the appropriate return text', () => {
      expect(this.interactionForm.returnText).to.equal('Return without saving')
    })

    it('should set the appropriate save button text', () => {
      expect(this.interactionForm.buttonText).to.equal('Save and return')
    })
  })

  context('When adding an interaction from an investment project', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'investment',
        kind: 'interaction',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        investment: {
          id: '3',
          name: 'Invest in things',
        },
        entityName: 'Invest in things',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get(
          '/metadata/service/?contexts__has_any=investment_project_interaction'
        )
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should set the investment project id as a hidden field', () => {
      const investmentField = this.interactionForm.hiddenFields
        .investment_project
      expect(investmentField).to.equal('3')
    })

    it('should set the company id as a hidden field', () => {
      const companyField = this.interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(
        this.interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      expect(contactField.value).to.be.null
    })
  })

  context('when editing an interaction from an investment project', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'investment',
        kind: 'interaction',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        investment: {
          id: '3',
        },
        interaction: {
          ...interactionData,
        },
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: this.contactsData })
        .get('/metadata/team/')
        .reply(200, this.metadataMock.teamOptions)
        .get(
          '/metadata/service/?contexts__has_any=investment_project_interaction'
        )
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should set the interaction id in a hidden field', () => {
      const idField = this.interactionForm.hiddenFields.investment_project
      expect(idField).to.equal('3')
    })
  })

  context('when displaying an interaction that failed to save', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'export',
        kind: 'interaction',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
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
        .get('/metadata/service/?contexts__has_any=export_interaction')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
      this.interactionForm = this.res.render.getCall(0).args[1].interactionForm
    })

    it('should merge the changes on top of the original record', () => {
      const fields = this.interactionForm.children.map(field =>
        pick(field, [
          'name',
          'label',
          'macroName',
          'type',
          'value',
          'heading',
          'secondaryHeading',
        ])
      )

      expect(fields).to.deep.equal([
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Service',
        },
        {
          name: 'service',
          label: 'Service',
          macroName: 'MultipleChoiceField',
          value: 'sv1',
        },
        {
          name: 'subService',
          label: 'Sub service',
          macroName: 'MultipleChoiceField',
          value: undefined,
        },
        {
          name: 'sv2-q1',
          label: 'What did you give advice about?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          name: 'sv2-q2',
          label: 'Another question?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          name: 'sv3-q1',
          label: 'Who was the company introduced to?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: undefined,
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Interaction Participants',
          secondaryHeading: 'Fred ltd.',
        },
        {
          name: 'contacts',
          label: 'Contact(s)',
          macroName: 'AddAnother',
          value: ['7701587b-e88f-4f39-874f-0bd06321f7df'],
        },
        {
          name: 'dit_participants',
          label: 'Adviser(s)',
          macroName: 'AddAnother',
          value: [1],
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Details',
        },
        {
          name: 'date',
          label: 'Date of interaction',
          macroName: 'DateFieldset',
          value: { day: '25', month: '11', year: '2058' },
        },
        {
          name: 'communication_channel',
          label: 'Communication channel',
          macroName: 'MultipleChoiceField',
          value: '70c226d7-5d95-e211-a939-e4115bead28a',
        },
        {
          label: undefined,
          macroName: 'FormSubHeading',
          value: undefined,
          heading: 'Notes',
        },
        {
          name: 'subject',
          label: 'Subject',
          macroName: 'TextField',
          value: 'a',
        },
        {
          name: 'notes',
          label: 'Notes',
          macroName: 'TextField',
          type: 'textarea',
          value: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        },
        {
          name: 'was_policy_feedback_provided',
          label: 'Did the contact give any feedback on government policy?',
          macroName: 'MultipleChoiceField',
          type: 'radio',
          value: 'true',
        },
        {
          name: 'policy_issue_types',
          label: 'Policy issue types',
          macroName: 'MultipleChoiceField',
          type: 'checkbox',
          value: ['c1f1e29b-17ba-402f-ac98-aa23f9dc9bcb'],
        },
        {
          name: 'policy_areas',
          label: 'Policy area',
          macroName: 'AddAnother',
          value: ['9feefd50-7f4c-4b73-a33e-779121d40419'],
        },
        {
          name: 'policy_feedback_notes',
          label: 'Policy feedback notes',
          macroName: 'TextField',
          type: 'textarea',
          value: 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.',
        },
      ])
    })

    it('should include the error in the form', () => {
      const subjectField = find(
        this.interactionForm.children,
        ({ name }) => name === 'subject'
      )
      expect(subjectField.error).to.deep.equal(['Error message'])
    })
  })

  context('when an interaction has no kind', () => {
    beforeEach(async () => {
      this.req.params = {
        ...this.req.parms,
        theme: 'export',
        kind: '',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      this.res.locals = {
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
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
        .get('/metadata/service/?contexts__has_any=export_service_delivery')
        .reply(200, this.metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: this.activeInactiveAdviserData })
        .get('/metadata/communication-channel/')
        .reply(200, this.metadataMock.channelOptions)
        .get('/metadata/service-delivery-status/')
        .reply(200, this.metadataMock.serviceDeliveryStatus)
        .get('/metadata/policy-area/')
        .reply(200, this.metadataMock.policyAreaOptions)
        .get('/metadata/policy-issue-type/')
        .reply(200, this.metadataMock.policyIssueType)

      await controller.renderEditPage(this.req, this.res, this.nextStub)
    })
    it('should redirect to a 404', () => {
      expect(this.res.redirect).to.have.been.called
      expect(this.res.redirect).to.have.been.calledWith('/404')
    })
  })
})
