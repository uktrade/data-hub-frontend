const { assign, get, merge } = require('lodash')

const { updateInvestment } = require('../../repos')
const { valueLabels } = require('../../labels')
const { getOptions } = require('../../../../lib/options')

async function populateForm (req, res, next) {
  const token = req.session.token
  const investmentData = get(res, 'locals.investmentData', {})
  const createdOn = investmentData.created_on

  const form = get(res, 'locals.form')
  const defaults = {
    labels: valueLabels.edit,
    state: assign({}, investmentData, {
      average_salary: get(investmentData, 'average_salary.id'),
    }),
    options: {
      averageSalaryRange: await getOptions(token, 'salary-range', { createdOn }),
      fdiValue: await getOptions(token, 'fdi-value', { createdOn }),
    },
  }

  const combined = merge({}, defaults, form)
  res.locals.form = combined

  next()
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.investmentId

  const formattedBody = assign({}, req.body, {
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
        res.locals.form = assign(
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
