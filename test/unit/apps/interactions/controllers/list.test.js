const moment = require('moment')
const { omit } = require('lodash')

const config = require('~/config')
const {
  renderInteractionList,
  renderInteractionsForEntity,
  getInteractionOptions,
} = require('~/src/apps/interactions/controllers/list')
const serviceOptionData = require('~/test/unit/data/interactions/service-options-data.json')

describe('interaction list', () => {
  beforeEach(() => {
    this.error = new Error('error')

    this.token = ''
    this.req = {
      session: {
        save: cb => cb(null),
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        xhr: false,
        interactions: {
          options: {
            option1: 'option1',
            option2: 'option2',
          },
        },
      },
      query: {
        sortby: 'date:desc',
      },
    }

    this.res = {
      render: sinon.stub(),
      breadcrumb: sinon.stub().returnsThis(),
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    }

    this.next = sinon.stub()

    const yesterday = moment()
      .subtract(1, 'days')
      .toISOString()

    this.metadataMock = {
      teamOptions: [
        { id: 'te1', name: 'te1', disabled_on: null },
        { id: 'te2', name: 'te2', disabled_on: null },
        { id: 'te', name: 'te3', disabled_on: null },
      ],
      serviceOptions: serviceOptionData,
      sectorOptions: [
        { id: 's1', name: 's1', disabled_on: null },
        { id: 's2', name: 's2', disabled_on: null },
        { id: 's3', name: 's3', disabled_on: null },
      ],
      adviserOptions: {
        results: [
          {
            id: 'ad1',
            name: 'ad1',
            is_active: true,
            dit_team: { name: 'ad1' },
          },
        ],
      },
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
      oneListTierOptions: [
        { id: '1', name: 'tier1', disabled_on: null },
        { id: '2', name: 'tier2', disabled_on: yesterday },
        { id: '3', name: 'tier3', disabled_on: null },
      ],
    }

    nock(config.apiRoot)
      .get('/metadata/service/')
      .reply(200, this.metadataMock.serviceOptions)
      .get('/metadata/team/')
      .reply(200, this.metadataMock.teamOptions)
      .get('/metadata/sector/?level__lte=0')
      .reply(200, this.metadataMock.sectorOptions)
      .get('/adviser/?limit=100000&offset=0')
      .reply(200, this.metadataMock.adviserOptions)
      .get('/metadata/policy-area/')
      .reply(200, this.metadataMock.policyAreaOptions)
      .get('/metadata/policy-issue-type/')
      .reply(200, this.metadataMock.policyIssueType)
      .get('/metadata/one-list-tier/')
      .reply(200, this.metadataMock.oneListTierOptions)
  })

  context('#renderInteractionList', () => {
    beforeEach(async () => {
      await renderInteractionList(this.req, this.res, this.next)
    })

    it('displays the kind filters', () => {
      const options = this.res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const kindField = filterFields.find(field => field.name === 'kind')
      expect(kindField.options).to.deep.equal([
        { value: 'interaction', label: 'Interaction' },
        { value: 'service_delivery', label: 'Service delivery' },
      ])
    })

    it('displays the one list group tier filters', () => {
      const options = this.res.render.firstCall.args[1]
      const filterFields = options.filtersFields

      const oneListGroupTierField = filterFields.find(field => field.name === 'company_one_list_group_tier')
      expect(oneListGroupTierField.options).to.deep.equal([
        { value: '1', label: 'tier1' },
        { value: '3', label: 'tier3' },
      ])
    })
  })

  context('#renderInteractionsForEntity', () => {
    context('when everything is okay', () => {
      const commonTests = () => {
        it('should render breadcrumbs', () => {
          expect(this.res.breadcrumb).to.have.been.calledWith('Interactions')
          expect(this.res.breadcrumb).to.have.been.calledOnce
        })

        it('should render the view', () => {
          expect(this.res.render).to.be.calledWith('entity/interactions')
          expect(this.res.render).to.have.been.calledOnce
        })
      }

      context('when interactions can be added to the entity', () => {
        beforeEach(async () => {
          this.res = {
            ...this.res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions/',
                createKind: 'interaction',
                theme: 'export',
                canAdd: true,
                isIE: false,
              },
            },
          }

          await renderInteractionsForEntity(this.req, this.res, this.next)
        })

        commonTests()

        it('should render action buttons', () => {
          const actual = this.res.render.firstCall.args[1].actionButtons[0]
          expect(actual).to.deep.equal({
            label: 'Add interaction',
            url: 'entity/interactions/create/export/interaction',
          })
        })
      })

      context('when interactions cannot be added to the entity', () => {
        beforeEach(async () => {
          this.res = {
            ...this.res,
            locals: {
              interactions: {
                view: 'entity/interactions',
                returnLink: 'entity/interactions/',
                createKind: 'interaction',
                canAdd: false,
              },
            },
          }

          await renderInteractionsForEntity(this.req, this.res, this.next)
        })

        commonTests()

        it('should not render action buttons', () => {
          const actual = this.res.render.firstCall.args[1].actionButtons
          expect(actual).to.be.undefined
        })
      })
    })

    context('when there is an error', () => {
      beforeEach(async () => {
        this.res = {
          breadcrumb: sinon.stub().throws(this.error),
          render: this.res.render,
          locals: {
            interactions: {
              view: 'entity/interactions',
              returnLink: 'entity/interactions/',
              createKind: 'interaction',
            },
          },
        }

        await renderInteractionsForEntity(this.req, this.res, this.next)
      })

      it('should not render the view', () => {
        expect(this.res.render).to.have.not.been.called
      })

      it('should call next with error', () => {
        expect(this.next).to.have.been.calledWith(this.error)
        expect(this.next).to.have.been.calledOnce
      })
    })
  })

  context('#getInteractionOptions', () => {
    const expected = { areas: [ { value: '1', label: 'pa1' }, { value: '3', label: 'pa3' } ],
      sectorOptions:
   [ { value: 's1', label: 's1' },
     { value: 's2', label: 's2' },
     { value: 's3', label: 's3' } ],
      serviceOptions:
   [ { value: 'sv1', label: 'Account Management' },
     { value: 'sv3', label: 'Making Introductions (Export)' },
     { value: 'sv2',
       label: 'Providing Export Advice & Information : Advice & information' } ],
      teamOptions:
   [ { value: 'te1', label: 'te1' },
     { value: 'te2', label: 'te2' },
     { value: 'te', label: 'te3' } ],
      oneListTierOptions:
   [ { value: '1', label: 'tier1' },
     { value: '3', label: 'tier3' } ],
      adviserOptions: [ { value: 'ad1', label: 'ad1', subLabel: 'ad1' } ],
      types: [ { value: '1', label: 'pt1' }, { value: '3', label: 'pt3' } ] }

    context('when the request is not XHR', () => {
      it(`should return all interaction options`, async () => {
        expect(
          await getInteractionOptions(this.token, this.req, this.res)
        ).to.deep.equal(expected)
      })
    })

    context('when there are no interaction options in session', () => {
      beforeEach(async () => {
        this.reqMock = { ...omit(this.req, 'session.interactions'), xhr: true }
      })

      it(`should return all interaction options`, async () => {
        expect(
          await getInteractionOptions(this.token, this.reqMock, this.res)
        ).to.deep.equal(expected)
      })
    })

    context(
      'when request is XHR & interaction options exist in session',
      () => {
        beforeEach(async () => {
          this.req = {
            ...this.req,
            xhr: true,
          }
        })

        it(`should return interaction options from session key`, async () => {
          expect(
            await getInteractionOptions(this.token, this.req, this.res)
          ).to.equal(this.req.session.interactions.options)
        })
      }
    )
  })
})
