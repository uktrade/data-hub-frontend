const moment = require('moment')
const { find, pick } = require('lodash')
const { format } = require('date-fns')

const config = require('../../../../config')
const controller = require('../edit')
const mockMetadata = require('../../../../../test/unit/helpers/mock-metadata')
const interactionData = require('../../../../../test/unit/data/interactions/interaction.json')
const serviceOptionData = require('../../../../../test/unit/data/interactions/service-options-data.json')

const currentUserTeam = '99887766553'

describe('Interaction edit controller (Interactions)', () => {
  let req
  let res
  let nextStub
  let metadataMock
  let activeInactiveAdviserData
  let contactsData
  let revertMetadataCountries

  afterEach(() => {
    revertMetadataCountries()
  })

  beforeEach(() => {
    revertMetadataCountries = mockMetadata.setCountries(3)
    req = {
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

    res = {
      breadcrumb: sinon.stub().returnsThis(),
      title: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {},
    }

    nextStub = sinon.stub()

    const yesterday = moment()
      .subtract(1, 'days')
      .toISOString()

    metadataMock = {
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

    activeInactiveAdviserData = [
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

    contactsData = [
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
      req.params = {
        ...req.params,
        theme: 'other',
        kind: 'interaction',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interactions: {
          returnLink: '/return',
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=other_interaction')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)

      await controller.renderEditPage(req, res, nextStub)
    })

    it('should render the interaction page', async () => {
      expect(res.render).to.be.calledWith('interactions/views/edit')
      expect(res.render).to.have.been.calledOnce
    })
  })

  context('When adding an investment interaction', () => {
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'investment',
        kind: 'interaction',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interaction: {
          ...interactionData,
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=investment_interaction')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)
      await controller.renderEditPage(req, res, nextStub)
    })

    it('should render the interaction page', async () => {
      expect(res.render).to.be.calledWith('interactions/views/edit')
      expect(res.render).to.have.been.calledOnce
    })
  })

  context('When adding an export interaction from company contact', () => {
    let interactionForm
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'export',
        kind: 'interaction',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        interactions: {
          returnLink: '/return',
        },
        entityName: 'Fred Bloggs',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=export_interaction')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)

      await controller.renderEditPage(req, res, nextStub)

      interactionForm = res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(res.render).to.be.calledWith('interactions/views/edit')
      expect(res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(res.breadcrumb.firstCall).to.be.calledWith('Add interaction')
    })

    it('should add a title', () => {
      expect(res.title.firstCall).to.be.calledWith(
        'Add interaction for Fred Bloggs'
      )
    })

    it('should include an interaction form', async () => {
      const actual = res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields', () => {
      const fieldNames = interactionForm.children.map((field) =>
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
        {
          macroName: 'MultipleChoiceField',
          type: 'radio',
          name: 'were_countries_discussed',
          label: 'Were any countries discussed?',
        },
        {
          label: 'Countries currently exporting to',
          macroName: 'Typeahead',
          name: 'currently_exporting',
        },
        {
          label: 'Future countries of interest',
          macroName: 'Typeahead',
          name: 'future_interest',
        },
        {
          label: 'Countries not interested in',
          macroName: 'Typeahead',
          name: 'not_interested',
        },
      ])
    })

    it('should provide a list of contacts', () => {
      const contactField = find(
        interactionForm.children,
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
        interactionForm.children,
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
        interactionForm.children,
        ({ name }) => name === 'subService'
      )

      expect(subServiceField.options).to.deep.equal([
        { value: 'sv2', label: 'Advice & information' },
      ])
    })

    it('should provide a list of communication channels', () => {
      const communicationChannelField = find(
        interactionForm.children,
        ({ name }) => name === 'communication_channel'
      )

      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '3', label: 'c3' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = interactionForm.hiddenFields.company

      expect(companyField).to.equal('1')
    })

    it('should set the default contact to the current contact', () => {
      const contactField = find(
        interactionForm.children,
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
        interactionForm.children,
        ({ name }) => name === 'dit_participants'
      )

      expect(adviserField.value).to.deep.equal(['user1'])
    })

    it('should set the interaction date to the current date', () => {
      const dateField = find(
        interactionForm.children,
        ({ name }) => name === 'date'
      )
      const today = new Date()

      expect(dateField.value).to.have.property('year', format(today, 'YYYY'))
      expect(dateField.value).to.have.property('month', format(today, 'MM'))
      expect(dateField.value).to.have.property('day', format(today, 'DD'))
    })

    it('should not include policy feedback as a service option', () => {
      const serviceField = find(
        interactionForm.children,
        ({ name }) => name === 'service'
      )
      const policyFeedbackOption = find(
        serviceField.options,
        ({ label }) => label === 'Policy feedback'
      )

      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link source of the add action', () => {
      expect(interactionForm.returnLink).to.equal('/return')
    })

    it('should set the appropriate return text', () => {
      expect(interactionForm.returnText).to.equal('Cancel')
    })

    it('should set the appropriate save button text', () => {
      expect(interactionForm.buttonText).to.equal('Add interaction')
    })
  })

  context('When adding an export interaction from a company', () => {
    let interactionForm
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'export',
        kind: 'interaction',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
        },
        entityName: 'Fred ltd.',
      }

      nock(config.apiRoot)
        .get('/v3/contact?company_id=1&limit=500')
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=export_interaction')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)

      await controller.renderEditPage(req, res, nextStub)

      interactionForm = res.render.getCall(0).args[1].interactionForm
    })

    it('should set the company id as a hidden field', () => {
      const companyField = interactionForm.hiddenFields.company
      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(
        interactionForm.children,
        ({ name }) => name === 'contacts'
      )
      expect(contactField.value).to.be.null
    })
  })

  context('when editing an export interaction from a company', () => {
    let interactionForm
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'export',
        kind: 'interaction',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      res.locals = {
        ...res.locals,
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
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=export_interaction')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)

      await controller.renderEditPage(req, res, nextStub)

      interactionForm = res.render.getCall(0).args[1].interactionForm
    })

    it('should render the interaction page', async () => {
      expect(res.render).to.be.calledWith('interactions/views/edit')
      expect(res.render).to.have.been.calledOnce
    })

    it('should add a breadcrumb', () => {
      expect(res.breadcrumb.firstCall).to.be.calledWith('Edit interaction')
    })

    it('should add a title', () => {
      expect(res.title.firstCall).to.be.calledWith('Edit interaction')
    })

    it('should include an interaction form', async () => {
      const actual = res.render.firstCall.args[1].interactionForm.children
      expect(actual).to.be.an('array')
    })

    it('should generate a form with the required fields and values populated', () => {
      const fields = interactionForm.children.map((field) =>
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
        interactionForm.children,
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
        interactionForm.children,
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
        interactionForm.children,
        ({ name }) => name === 'subService'
      )

      expect(subSrviceField.options).to.deep.equal([
        { value: 'sv2', label: 'Advice & information' },
      ])
    })

    it('should provide a list of communication channels at creation time', () => {
      const communicationChannelField = find(
        interactionForm.children,
        ({ name }) => name === 'communication_channel'
      )

      expect(communicationChannelField.options).to.deep.equal([
        { value: '1', label: 'c1' },
        { value: '2', label: 'c2' },
        { value: '3', label: 'c3' },
      ])
    })

    it('should set the company id as a hidden field', () => {
      const companyField = interactionForm.hiddenFields.company

      expect(companyField).to.equal('1')
    })

    it('should set the id in a hidden field', () => {
      const idField = interactionForm.hiddenFields.id

      expect(idField).to.equal('af4aac84-4d6a-47df-a733-5a54e3008c32')
    })

    it('should not include policy feedback as a service option', () => {
      const serviceField = find(
        interactionForm.children,
        ({ name }) => name === 'service'
      )
      const policyFeedbackOption = find(
        serviceField.options,
        ({ label }) => label === 'Policy feedback'
      )

      expect(policyFeedbackOption).to.be.undefined
    })

    it('should set the return link to the detail view', () => {
      expect(interactionForm.returnLink).to.equal(
        '/interactions/af4aac84-4d6a-47df-a733-5a54e3008c32'
      )
    })

    it('should set the appropriate return text', () => {
      expect(interactionForm.returnText).to.equal('Return without saving')
    })

    it('should set the appropriate save button text', () => {
      expect(interactionForm.buttonText).to.equal('Save and return')
    })
  })

  context('When adding an interaction from an investment project', () => {
    let interactionForm
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'investment',
        kind: 'interaction',
      }

      res.locals = {
        ...res.locals,
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
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get(
          '/v4/metadata/service?contexts__has_any=investment_project_interaction'
        )
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)
      await controller.renderEditPage(req, res, nextStub)
      interactionForm = res.render.getCall(0).args[1].interactionForm
    })

    it('should set the investment project id as a hidden field', () => {
      const investmentField = interactionForm.hiddenFields.investment_project

      expect(investmentField).to.equal('3')
    })

    it('should set the company id as a hidden field', () => {
      const companyField = interactionForm.hiddenFields.company

      expect(companyField).to.equal('1')
    })

    it('should include a contact dropdown with no preselected value', () => {
      const contactField = find(
        interactionForm.children,
        ({ name }) => name === 'contacts'
      )

      expect(contactField.value).to.be.null
    })
  })

  context('when editing an interaction from an investment project', () => {
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'investment',
        kind: 'interaction',
        interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
      }

      res.locals = {
        ...res.locals,
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
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get(
          '/v4/metadata/service?contexts__has_any=investment_project_interaction'
        )
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)
      await controller.renderEditPage(req, res, nextStub)
    })

    it('should set the interaction id in a hidden field', () => {
      const interactionForm = res.render.getCall(0).args[1].interactionForm
      const idField = interactionForm.hiddenFields.investment_project

      expect(idField).to.equal('3')
    })
  })

  context(
    'when displaying an edit of an export interaction that failed to save',
    () => {
      let interactionForm
      beforeEach(async () => {
        req.params = {
          ...req.params,
          theme: 'export',
          kind: 'interaction',
          interactionId: 'af4aac84-4d6a-47df-a733-5a54e3008c32',
        }

        res.locals = {
          ...res.locals,
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
          .reply(200, { results: contactsData })
          .get('/v4/metadata/team')
          .reply(200, metadataMock.teamOptions)
          .get('/v4/metadata/service?contexts__has_any=export_interaction')
          .reply(200, metadataMock.serviceOptions)
          .get('/adviser/?limit=100000&offset=0')
          .reply(200, { results: activeInactiveAdviserData })
          .get('/v4/metadata/communication-channel')
          .reply(200, metadataMock.channelOptions)
          .get('/v4/metadata/service-delivery-status')
          .reply(200, metadataMock.serviceDeliveryStatus)
          .get('/v4/metadata/policy-area')
          .reply(200, metadataMock.policyAreaOptions)
          .get('/v4/metadata/policy-issue-type')
          .reply(200, metadataMock.policyIssueType)

        await controller.renderEditPage(req, res, nextStub)

        interactionForm = res.render.getCall(0).args[1].interactionForm
      })

      it('should merge the changes on top of the original record', () => {
        const fields = interactionForm.children.map((field) =>
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
          interactionForm.children,
          ({ name }) => name === 'subject'
        )

        expect(subjectField.error).to.deep.equal(['Error message'])
      })
    }
  )

  context('when a new interaction has no kind', () => {
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'export',
        kind: '',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
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
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=export_service_delivery')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)
      await controller.renderEditPage(req, res, nextStub)
    })

    it('should throw an error', () => {
      expect(nextStub).to.have.been.called
      expect(nextStub.firstCall.args[0]).to.be.instanceof(Error)
      expect(nextStub.firstCall.args[0].message).to.equal('Invalid kind')
    })
  })

  context(
    'when a new interaction has a kind that does not match service-delivery or interaction',
    () => {
      beforeEach(async () => {
        req.params = {
          ...req.params,
          theme: 'export',
          kind: 'not-really-an-interaction',
        }

        res.locals = {
          ...res.locals,
          company: {
            id: '1',
            name: 'Fred ltd.',
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
          .reply(200, { results: contactsData })
          .get('/v4/metadata/team')
          .reply(200, metadataMock.teamOptions)
          .get('/v4/metadata/service?contexts__has_any=export_service_delivery')
          .reply(200, metadataMock.serviceOptions)
          .get('/adviser/?limit=100000&offset=0')
          .reply(200, { results: activeInactiveAdviserData })
          .get('/v4/metadata/communication-channel')
          .reply(200, metadataMock.channelOptions)
          .get('/v4/metadata/service-delivery-status')
          .reply(200, metadataMock.serviceDeliveryStatus)
          .get('/v4/metadata/policy-area')
          .reply(200, metadataMock.policyAreaOptions)
          .get('/v4/metadata/policy-issue-type')
          .reply(200, metadataMock.policyIssueType)

        await controller.renderEditPage(req, res, nextStub)
      })

      it('should throw an error', () => {
        expect(nextStub).to.have.been.called
        expect(nextStub.firstCall.args[0]).to.be.instanceof(Error)
        expect(nextStub.firstCall.args[0].message).to.equal('Invalid kind')
      })
    }
  )

  context('when a new interaction has a theme that does not match', () => {
    beforeEach(async () => {
      req.params = {
        ...req.params,
        theme: 'foo',
        kind: 'not-really-an-interaction',
      }

      res.locals = {
        ...res.locals,
        company: {
          id: '1',
          name: 'Fred ltd.',
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
        .reply(200, { results: contactsData })
        .get('/v4/metadata/team')
        .reply(200, metadataMock.teamOptions)
        .get('/v4/metadata/service?contexts__has_any=export_service_delivery')
        .reply(200, metadataMock.serviceOptions)
        .get('/adviser/?limit=100000&offset=0')
        .reply(200, { results: activeInactiveAdviserData })
        .get('/v4/metadata/communication-channel')
        .reply(200, metadataMock.channelOptions)
        .get('/v4/metadata/service-delivery-status')
        .reply(200, metadataMock.serviceDeliveryStatus)
        .get('/v4/metadata/policy-area')
        .reply(200, metadataMock.policyAreaOptions)
        .get('/v4/metadata/policy-issue-type')
        .reply(200, metadataMock.policyIssueType)
      await controller.renderEditPage(req, res, nextStub)
    })

    it('should throw an error', () => {
      expect(nextStub).to.have.been.called
      expect(nextStub.firstCall.args[0]).to.be.instanceof(Error)
      expect(nextStub.firstCall.args[0].message).to.equal('Invalid theme')
    })
  })
})
