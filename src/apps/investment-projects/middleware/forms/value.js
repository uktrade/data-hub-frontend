const { get } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const { updateInvestment } = require('../../repos')
const { valueLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')

function populateForm (req, res, next) {
  res.locals.form = get(res, 'locals.form', {})
  res.locals.form.labels = valueLabels.edit
  res.locals.form.state = Object.assign({}, res.locals.investmentData, {
    average_salary: get(res.locals.investmentData, 'average_salary.id'),
  })
  res.locals.form.options = {
    averageSalaryRange: metadataRepo.salaryRangeOptions.map(transformObjectToOption),
    fdiValue: metadataRepo.fdiValueOptions.map(transformObjectToOption),
  }

  next()
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.investmentId

  const formattedBody = Object.assign({}, req.body, {
    average_salary: {
      id: req.body.average_salary,
    },
    total_investment: req.body.client_cannot_provide_total_investment === 'true' ? null : req.body.total_investment,
    foreign_equity_investment: req.body.client_cannot_provide_foreign_investment === 'true' ? null : req.body.foreign_equity_investment,
  })

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = Object.assign(
          {},
          get(res, 'locals.form', {}),
          {
            state: req.body,
            errors: {
              messages: err.error,
            },
          },
        )

        if (!req.body.client_cannot_provide_total_investment) {
          delete res.locals.form.errors.messages.total_investment
          res.locals.form.errors.messages.client_cannot_provide_total_investment = ['This field is required']
        }
        if (!req.body.client_cannot_provide_foreign_investment) {
          delete res.locals.form.errors.messages.foreign_equity_investment
          res.locals.form.errors.messages.client_cannot_provide_foreign_investment = ['This field is required']
        }

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
