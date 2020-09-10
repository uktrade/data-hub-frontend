const {
  transformInvestmentValueFormBodyToApiRequest,
} = require('../../transformers/value')
const { grossValueAddedMessage } = require('./gross-value-added-message')
const { getOptions } = require('../../../../lib/options')
const { updateInvestment } = require('../../repos')
const { assign, get, merge } = require('lodash')
const { valueLabels } = require('../../labels')

async function populateForm(req, res, next) {
  const investment = get(res, 'locals.investment', {})
  const createdOn = investment.created_on

  const form = get(res, 'locals.form')
  const defaults = {
    labels: valueLabels.edit,
    state: assign({}, investment, {
      average_salary: get(investment, 'average_salary.id'),
      gross_value_added_message: grossValueAddedMessage(investment),
    }),
    options: {
      averageSalaryRange: await getOptions(req, 'salary-range', {
        createdOn,
      }),
      fdiValue: await getOptions(req, 'fdi-value', {
        createdOn,
        sorted: false,
      }),
      likelihoodToLand: await getOptions(req, 'likelihood-to-land', {
        createdOn,
        sorted: false,
      }),
    },
  }

  const combined = merge({}, defaults, form)
  res.locals.form = combined

  next()
}

async function handleFormPost(req, res, next) {
  const { projects } = res.locals.paths
  const { investmentId } = req.params
  const formattedBody = transformInvestmentValueFormBodyToApiRequest(req.body)

  try {
    await updateInvestment(req, investmentId, formattedBody)
    req.flash('success', 'Investment value updated')
    res.redirect(`${projects}/${investmentId}/details`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form.state = req.body
      res.locals.errors = {
        messages: err.error,
      }
      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
}
