const config = require('../../../../config')
const { renderProjectsView } = require('../../controllers/projects')

const fixture = (statusCode) => {
  const metadataMock = {
    sectorOptions: [{ id: 's1', name: 's1', disabled_on: null }],
    adviserOptions: {
      results: [
        { id: 'ad1', name: 'ad1', is_active: true, dit_team: { name: 'ad1' } },
      ],
    },
    countryOptions: [
      { id: '9999', name: 'United Kingdom' },
      { id: '8888', name: 'Test' },
    ],
  }

  nock(config.apiRoot)
    .get('/v4/metadata/sector?level__lte=0')
    .reply(statusCode, metadataMock.sectorOptions)
    .get('/v4/metadata/country')
    .reply(statusCode, metadataMock.countryOptions)
    .get('/adviser/?limit=100000&offset=0')
    .reply(statusCode, metadataMock.adviserOptions)

  return {
    req: {
      session: {
        user: {
          id: '1234',
          name: 'Fred Smith',
          permissions: [],
        },
        token: 'abcd',
      },
      query: {
        sortby: 'estimated_land_date:asc',
      },
    },
    res: {
      render: sinon.spy(),
      breadcrumb: sinon.stub().returnsThis(),
      query: {},
      locals: {
        userAgent: {
          isIE: false,
        },
      },
    },
    next: sinon.spy(),
  }
}

describe('#renderProjectsView', () => {
  it('should render the page if there are no errors', async () => {
    const { req, res, next } = fixture(200)

    await renderProjectsView(req, res, next)

    expect(res.render, 'should render').to.be.calledOnce

    expect(res.breadcrumb, 'should render the breadcrumsb').to.be.calledWith(
      'Projects'
    )

    expect(
      res.render.firstCall.args[0],
      'should render the collection template'
    ).to.equal('investments/views/projects')

    expect(
      res.render.firstCall.args[1].title,
      'should render the view with a title'
    ).to.equal('Investment Projects')

    expect(
      res.render.firstCall.args[1].countLabel,
      'should render the view with a count label'
    ).to.equal('project')

    expect(
      res.render.firstCall.args[1].sortForm,
      'should render the view with a sort form'
    ).to.exist

    expect(
      res.render.firstCall.args[1].selectedFilters,
      'should render the view with selected filters'
    ).to.exist

    expect(
      res.render.firstCall.args[1].exportAction,
      'should render the view with an export action'
    ).to.deep.equal({
      enabled: false,
    })

    expect(
      res.render.firstCall.args[1].filtersFields,
      'should render the view with filter fields'
    ).to.exist

    it('should call an error if there is an error', async () => {
      const { req, res, next } = fixture(500)

      await renderProjectsView(req, res, next)

      expect(res.render, 'should not render the view').to.be.thrown

      expect(next, 'should call next').to.have.been.calledOnce
    })
  })
})
