const paths = require('~/src/apps/investments/paths')

module.exports = ({
  requestBody,
  requestParams = {},
  requestQuery = {},
  breadcrumb = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  order,
  investment,
  companiesHouseRecord,
  features = {},
}) => {
  return {
    reqMock: {
      session: {
        token: '1234',
      },
      body: requestBody,
      params: requestParams,
      query: requestQuery,
      flash: sinon.spy(),
    },
    resMock: {
      breadcrumb,
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        paths,
        company,
        contact,
        interaction,
        order,
        investment,
        companiesHouseRecord,
        features,
      },
    },
    nextSpy: sinon.spy(),
  }
}
