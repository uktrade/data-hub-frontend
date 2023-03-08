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
  global_ultimate_duns_number: '2',
  global_headquarters: {
    id: '2233',
  },
}

describe('Company business details', () => {
  describe('#renderBusinessDetails', () => {
    context('when it successfully renders', async () => {
      let middlewareParams

      before(async () => {
        nock(config.apiRoot)
          .get(
            `/v4/company?limit=10&offset=0&sortby=name&global_headquarters_id=${companyMock.id}`
          )
          .reply(200, { count: 999 })

        const getMessages = () => {
          return []
        }

        middlewareParams = buildMiddlewareParameters({
          company: companyMock,
          locals: {
            globalUltimate: {
              id: '222',
              name: 'Test Global Ultimate',
              url: '/test/222',
            },
            dnbRelatedCompaniesCount: 111,
            ARCHIVED_DOCUMENT_BASE_URL: '/',
            user: {
              permissions: [],
            },
            localNavItems: [
              {
                path: 'business-details',
                label: 'Business details',
                url: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/business-details',
                isActive: true,
              },
              {
                path: 'advisers',
                label: 'Core team',
                url: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/advisers',
                isActive: false,
              },
            ],
            getMessages,
          },
        })

        await renderBusinessDetails(
          middlewareParams.reqMock,
          middlewareParams.resMock,
          middlewareParams.nextSpy
        )
      })

      it('should render', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnce
      })

      it('should render the template', () => {
        expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(
          'companies/apps/business-details/views/client-container',
          {
            props: {
              breadcrumbs: [
                { link: urls.dashboard(), text: 'Home' },
                {
                  link: urls.companies.index(),
                  text: 'Companies',
                },
                {
                  link: urls.companies.detail(companyMock.id),
                  text: companyMock.name,
                },
                { text: 'Business details' },
              ],
              businessDetails: {
                id: '1',
                name: 'Test company',
                company_number: '222',
              },
              company: companyMock,
              globalUltimate: {
                name: 'Test Global Ultimate',
                url: '/test/222',
              },
              dnbRelatedCompaniesCount: 111,
              subsidiariesCount: 999,
              canEditOneList: false,
              urls: {
                archivedDocument: '/some/path',
                companiesHouse: urls.external.companiesHouse(
                  companyMock.company_number
                ),
                companyBusinessDetails: urls.companies.businessDetails(
                  companyMock.id
                ),
                companyEdit: urls.companies.edit(companyMock.id),
                companyArchive: `${urls.companies.archive(
                  companyMock.id
                )}?_csrf=csrf`,
                companyUnarchive: `${urls.companies.unarchive(
                  companyMock.id
                )}?_csrf=csrf`,
                companyAdvisers: urls.companies.advisers.index(companyMock.id),
                companyEditHistory: urls.companies.editHistory.index(
                  companyMock.id
                ),
                support: urls.support.index(),
                subsidiaries: urls.companies.subsidiaries.index(companyMock.id),
                linkSubsidiary: urls.companies.subsidiaries.link(
                  companyMock.id
                ),
                linkGlobalHQ: urls.companies.hierarchies.ghq.link(
                  companyMock.id
                ),
                removeGlobalHQ: urls.companies.hierarchies.ghq.remove(
                  companyMock.id
                ),
                globalHQ: urls.companies.detail(
                  companyMock.global_headquarters.id
                ),
                dnbHierarchy: urls.companies.dnbHierarchy.index(companyMock.id),
                editOneList: urls.companies.editOneList(companyMock.id),
              },
              localNavItems: [
                {
                  path: 'business-details',
                  label: 'Business details',
                  url: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/business-details',
                  isActive: true,
                },
                {
                  path: 'advisers',
                  label: 'Core team',
                  url: '/companies/375094ac-f79a-43e5-9c88-059a7caa17f0/advisers',
                  isActive: false,
                },
              ],
              flashMessages: [],
            },
          }
        )
      })

      it('should not call "next" with an error', () => {
        expect(middlewareParams.nextSpy).to.not.have.been.called
      })
    })
  })
})
