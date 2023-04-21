const { assign } = require('lodash')
const proxyquire = require('proxyquire')

const propositionData = require('../../../../../test/unit/data/propositions/proposition.json')

const transformed = {
  id: '1',
  data: 'transformed',
}

describe('Proposition details middleware', () => {
  beforeEach(() => {
    this.fetchPropositionStub = sinon.stub()
    this.transformPropositionFormBodyToApiRequestStub = sinon.stub()
    this.transformPropositionResponseToViewRecordStub = sinon.stub()

    this.middleware = proxyquire('../details', {
      '../repos': {
        fetchProposition: this.fetchPropositionStub.resolves(propositionData),
      },
      '../transformers': {
        transformPropositionFormBodyToApiRequest:
          this.transformPropositionFormBodyToApiRequestStub.returns(
            transformed
          ),
        transformPropositionResponseToViewRecord:
          this.transformPropositionResponseToViewRecordStub.returns(
            transformed
          ),
      },
    })

    this.req = {
      session: {
        token: 'abcd',
      },
      flash: sinon.spy(),
      body: assign({}, propositionData),
      query: {
        company: '299e7412-d9ee-4ab0-a4cb-a8cc00922c91',
      },
      params: {
        kind: 'proposition',
      },
    }

    this.res = {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        company: {
          id: '1',
        },
        returnLink: '/return/',
      },
    }

    this.nextSpy = sinon.spy()

    this.activeInactiveAdviserData = {
      count: 5,
      results: [
        { id: '1', name: 'Abraham Slende', is_active: true },
        { id: '2', name: 'The Mayor of St. Albans', is_active: true },
        { id: '3', name: 'Queen Katherine of Aragon', is_active: true },
        { id: '4', name: 'Antipholus of Ephesus', is_active: false },
        { id: '5', name: 'Tullus Aufidius', is_active: false },
      ],
    }
  })
})
