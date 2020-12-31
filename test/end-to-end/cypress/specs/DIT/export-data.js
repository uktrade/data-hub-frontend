const urls = require('../../../../../src/lib/urls')

const queueDataExportTest = ({ name, url }) => {
  it(`exports ${name} data`, () => {
    cy.request({
      url: url || urls[name].export(),
      query: {
        sortby: 'name:asc',
      },
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.headers['content-type']).to.equal(
        'text/csv; charset=utf-8'
      )
    })
  })
}

describe('exporting data', () => {
  queueDataExportTest({ name: 'companies' })
  queueDataExportTest({ name: 'contacts' })
  queueDataExportTest({ name: 'interactions' })
  queueDataExportTest({
    name: 'investment projects',
    url: urls.investments.projects.export(),
  })
  queueDataExportTest({ name: 'omis' })
})
