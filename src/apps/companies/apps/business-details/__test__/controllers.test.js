const nock = require('nock')

const urls = require('../../../../../lib/urls')
const { renderBusinessDetails } = require('../controllers')
const config = require('../../../../../config')

const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')

const companyMock = {
  id: '1',
  name: 'Test company',
  archived_documents_url_path: 'some/path',
  company_number: '222',
}

describe('Company business details', () => {
  describe('#renderBusinessDetails', () => {
    context('when it successfully renders', async () => {
      let middlewareParams

      before(async () => {
        nock(config.apiRoot)
          .get('/v4/company?limit=10&offset=0&sortby=name&global_headquarters_id=1')
          .reply(200, { count: 999 })

        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          locals: {
            ARCHIVED_DOCUMENT_BASE_URL: '/',
          },
        })

        await renderBusinessDetails(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy,
        )
      })

      it('should render', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnce
      })

      it('should render the activity feed template', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/business-details/views/client-container', {
            'heading': 'Business details',
            'props': {
              'businessDetails': {
                'id': '1',
                'name': 'Test company',
                'company_number': '222',
              },
              'subsidiariesCount': 999,
              'urls': {
                'archivedDocument': '/some/path',
                'companiesHouse': urls.external.companiesHouse(companyMock.company_number),
                'companyBusinessDetails': urls.companies.businessDetails2(companyMock.id),
                'companyEdit': urls.companies.edit(companyMock.id),
                'companyArchive': `${urls.companies.archive(companyMock.id)}?_csrf=csrf`,
                'companyUnarchive': `${urls.companies.unarchive(companyMock.id)}?_csrf=csrf`,
                'companyAdvisers': urls.companies.advisers.index(companyMock.id),
                'companyAudit': urls.companies.audit(companyMock.id),
                'support': urls.support(),
                'subsidiaries': urls.companies.subsidiaries.index(companyMock.id),
                'linkSubsidiary': urls.companies.subsidiaries.link(companyMock.id),
                'linkGlobalHQ': urls.companies.hierarchies.ghq.link(companyMock.id),
                'removeGlobalHQ': urls.companies.hierarchies.ghq.remove(companyMock.id),
              },
            },
          })
      })

      it('should add a breadcrumb', () => {
        expect(middlewareParams.resMock.breadcrumb.args).to.deep.equal([
          ['Test company', urls.companies.detail(companyMock.id)],
          ['Business details'],
        ])
      })

      it('should not call "next" with an error', () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })
  })
})
