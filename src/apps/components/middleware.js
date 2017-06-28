function handleFormPost (req, res, next) {
  res.locals.form = Object.assign({}, res.locals.form, {
    state: req.body,
    errors: {
      summary: 'Please correct the following errors:',
      messages: {
        name: ['The name is not valid'],
        country: ['Country is required'],
        averageSalary: ['Select an option'],
        foreignOtherCompany: ['Select a company type'],
      },
    },
  })

  next()
}

module.exports = {
  handleFormPost,
}
