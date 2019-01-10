module.exports = ({
  requestBody,
  requestQuery = {},
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
    },
    resMock: {
      breadcrumb: sinon.stub().returnsThis(),
      render: sinon.spy(),
      redirect: sinon.spy(),
      locals: {
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
