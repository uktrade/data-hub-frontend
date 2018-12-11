module.exports = ({
  requestBody,
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
        investmentData: investment, // todo: rename
        features,
      },
    },
    nextSpy: sinon.spy(),
  }
}
