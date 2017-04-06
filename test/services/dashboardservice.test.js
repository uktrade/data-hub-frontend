const proxyquire = require('proxyquire')

describe('Dashboard service', () => {
  const mockHomepageData = {
    interactions: [{
      id: 'int-id',
      subject: 'int-subject',
      company: {
        'id': 'comp-id',
        'name': 'comp-name'
      }
    }],
    contacts: [{
      id: 'contact-id',
      first_name: 'first-name',
      last_name: 'last-name',
      company: {
        'id': 'comp-id',
        'name': 'comp-name'
      }
    }]
  }
  let dashboardService

  beforeEach(() => {
    dashboardService = proxyquire('../../src/services/dashboardservice', {
      '../lib/authorisedrequest': () => new Promise((resolve, reject) => {
        resolve(mockHomepageData)
      })
    })
  })

  it('returns correct homepage data', () => {
    return dashboardService.getHomepageData('token')
      .then((data) => {
        expect(data).to.eql({
          interactions: [{
            id: 'int-id',
            subject: 'int-subject',
            url: '/interaction/int-id/details',
            company: {
              'url': '/company/company_company/comp-id/details',
              'name': 'comp-name'
            }
          }],
          contacts: [{
            id: 'contact-id',
            name: 'first-name last-name',
            url: '/contact/contact-id/details',
            company: {
              'url': '/company/company_company/comp-id/details',
              'name': 'comp-name',
              'id': 'comp-id'
            }
          }]
        })
      })
  })
})
