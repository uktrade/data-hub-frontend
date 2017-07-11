const { get } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const { updateInvestment } = require('../../repos')
const { valueLabels } = require('../../labels')

function populateForm (req, res, next) {
  res.locals.form = get(res, 'locals.form', {})
  res.locals.form.labels = valueLabels.edit
  res.locals.form.state = Object.assign({}, res.locals.investmentData, {
    average_salary: get(res.locals.investmentData, 'average_salary.id'),
  })
  res.locals.form.options = {
    averageSalaryRange: metadataRepo.salaryRangeOptions,
  }

  next()
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.id

  const formattedBody = Object.assign({}, req.body, {
    average_salary: {
      id: req.body.average_salary,
    },
    client_cannot_provide_total_investment: req.body.client_cannot_provide_total_investment === 'on',
    client_cannot_provide_foreign_investment: req.body.client_cannot_provide_foreign_investment === 'on',
  })

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

module.exports = {
  populateForm,
  handleFormPost,
}
