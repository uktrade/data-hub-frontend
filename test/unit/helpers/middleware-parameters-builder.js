const paths = require('~/src/apps/investments/paths')

module.exports = ({
  reqMock = {},
  resMock = {},
  requestBody,
  requestParams = {},
  requestQuery = {},
  CURRENT_PATH = '',
  breadcrumb = sinon.stub().returnsThis(),
  title = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  order,
  investment,
  companiesHouseRecord,
  features = {},
  user,
}) => {
  return {
    reqMock: {
      ...reqMock,
      session: {
        token: '1234',
      },
      body: requestBody,
      params: requestParams,
      query: requestQuery,
      flash: sinon.spy(),
    },
    resMock: {
      ...resMock,
      breadcrumb,
      title,
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
        CURRENT_PATH,
        paths,
        company,
        contact,
        interaction,
        order,
        investment,
        companiesHouseRecord,
        features,
        user,
      },
    },
    nextSpy: sinon.spy(),
  }
}
