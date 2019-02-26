const paths = require('~/src/apps/investment-projects/paths')

module.exports = ({
  requestBody,
  requestQuery = {},
  breadcrumb = sinon.stub().returnsThis(),
  company,
  contact,
  interaction,
  investment,
  order,
  features = {},
}) => {
  return {
    reqMock: {
      session: {
        token: '1234',
      },
      body: requestBody,
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
        features,
      },
    },
    nextSpy: sinon.spy(),
  }
}
