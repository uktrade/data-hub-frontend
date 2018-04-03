const contactsListData = require('~/test/unit/data/contacts/contact.json')
const { transformContactToListItem } = require('~/src/apps/contacts/transformers')

describe('Contact list controller', () => {
  beforeEach(() => {
    this.transformedContacts = {}
    this.next = sandbox.spy()
    this.req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    this.res = {
      render: sandbox.spy(),
      query: {},
    }

    this.getContactsStub = sandbox.stub().resolves(contactsListData)
    this.transformApiResponseToCollectionStub = sandbox.stub().returns(this.transformContactToListItem)

    this.buildSelectedFiltersSummaryStub = sandbox.spy()

    this.controller = proxyquire('~/src/apps/contacts/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: this.buildSelectedFiltersSummaryStub,
      },
    })

    this.next = sandbox.spy()
  })

  describe('#renderContactList', () => {
    context('when there are investments to render', () => {
      beforeEach(async () => {
        await this.controller.renderContactList(this.req, this.res, this.next)
      })

      it('should render collection page with locals', () => {
        this.controller.renderContactList(this.req, this.res, this.next)

        it('should get interactions from the repository', () => {
          expect(this.getContactsStub).to.be.calledWith('abcd')
        })

        it('should call the transformer to convert investment project for display', () => {
          expect(this.transformApiResponseToCollectionStub).to.be.calledWith({ entityType: 'interaction' }, transformContactToListItem)
        })

        it('should return investment projects', () => {
          const renderOptions = this.res.render.firstCall.args[1]
          expect(renderOptions).to.have.property('contacts')
        })
      })
    })
  })
})
