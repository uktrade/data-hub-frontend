const contactsListData = require('~/test/unit/data/contacts/contact.json')
const { transformContactToListItem } = require('~/src/apps/contacts/transformers')
const config = require('~/src/config')

describe('Contact list controller', () => {
  let next
  let req
  let res
  let getContactsStub
  let transformApiResponseToCollectionStub
  let buildSelectedFiltersSummaryStub
  let controller

  beforeEach(() => {
    next = sinon.spy()
    req = {
      session: {
        token: 'abcd',
      },
      query: {},
    }
    res = {
      render: sinon.spy(),
      query: {},
    }

    getContactsStub = sinon.stub().resolves(contactsListData)
    transformApiResponseToCollectionStub = sinon.stub().returns(transformContactToListItem)

    buildSelectedFiltersSummaryStub = sinon.spy()

    controller = proxyquire('~/src/apps/contacts/controllers/list', {
      '../../builders': {
        buildSelectedFiltersSummary: buildSelectedFiltersSummaryStub,
      },
    })

    next = sinon.spy()
  })

  describe('#renderContactList', () => {
    context('when there are investments to render', () => {
      beforeEach(() => {
        const metaMock = [
          { id: '1', name: 'm1', disabled_on: null },
          { id: '2', name: 'm2', disabled_on: null },
          { id: '3', name: 'm3', disabled_on: null },
        ]

        nock(config.apiRoot)
          .get('/v4/metadata/sector?level__lte=0')
          .reply(200, metaMock)
      })

      it('should render collection page with locals', async () => {
        await controller.renderContactList(req, res, next)

        it('should get interactions from the repository', () => {
          expect(getContactsStub).to.be.calledWith('abcd')
        })

        it('should call the transformer to convert investment project for display', () => {
          expect(transformApiResponseToCollectionStub).to.be.calledWith({ entityType: 'interaction' }, transformContactToListItem)
        })

        it('should return investment projects', () => {
          const renderOptions = res.render.firstCall.args[1]
          expect(renderOptions).to.have.property('contacts')
        })
      })
    })
  })
})
