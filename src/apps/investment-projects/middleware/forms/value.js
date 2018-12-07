const { assign, get, merge } = require('lodash')

const { updateInvestment } = require('../../repos')
const { valueLabels } = require('../../labels')
const { transformInvestmentValueFormBodyToApiRequest } = require('../../transformers/value')
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
      fdiValue: await getOptions(token, 'fdi-value', { createdOn, sorted: false }),
      likelihoodToLand: await getOptions(token, 'likelihood-to-land', { createdOn, sorted: false }),
    },
  }

  const combined = merge({}, defaults, form)
  res.locals.form = combined

  next()
}

async function handleFormPost (req, res, next) {
  const investmentId = req.params.investmentId
  const formattedBody = transformInvestmentValueFormBodyToApiRequest(req.body)

  try {
    await updateInvestment(req.session.token, investmentId, formattedBody)
    req.flash('success', 'Investment value updated')
    res.redirect(`/investment-projects/${investmentId}/details`)
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
