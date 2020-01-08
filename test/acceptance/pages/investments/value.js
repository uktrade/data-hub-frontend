const { keys, endsWith, filter, forEach } = require('lodash')

const { getButtonWithText } = require('../../helpers/selectors')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    totalInvestmentRadioYes:
      '[for="field-client_cannot_provide_total_investment-1"]',
    totalInvestmentRadioNo:
      '[for="field-client_cannot_provide_total_investment-2"]',
    totalInvestment: '#field-total_investment',
    foreignEquityInvestmentRadioYes:
      '[for="field-client_cannot_provide_foreign_investment-1"]',
    foreignEquityInvestmentRadioNo:
      '[for="field-client_cannot_provide_foreign_investment-2"]',
    foreignEquityInvestment: '#field-foreign_equity_investment',
    newJobs: '#field-number_new_jobs',
    safeguardedJobs: '#field-number_safeguarded_jobs',
    governmentAssistanceRadioYes: '[for="field-government_assistance-1"]',
    governmentAssistanceRadioNo: '[for="field-government_assistance-2"]',
    rDBudgetRadioYes: '[for="field-r_and_d_budget-1"]',
    rDBudgetRadioNo: '[for="field-r_and_d_budget-2"]',
    nonFdiRDProjectRadioYes: '[for="field-non_fdi_r_and_d_budget-1"]',
    nonFdiRDProjectRadioNo: '[for="field-non_fdi_r_and_d_budget-2"]',
    newToWorldTechRadioYes: '[for="field-new_tech_to_uk-1"]',
    newToWorldTechRadioNo: '[for="field-new_tech_to_uk-2"]',
    exportRevenueRadioYes: '[for="field-export_revenue-1"]',
    exportRevenueRadioNo: '[for="field-export_revenue-2"]',
    saveButton: getButtonWithText('Save'),
  },
  commands: [
    {
      add(details = {}, callback) {
        this.waitForElementPresent('@saveButton')

        const radioOptions = filter(keys(details), (key) =>
          endsWith(key, 'Radio')
        )
        forEach(radioOptions, (key) => {
          this.click(`@${key + details[key]}`)
        })

        const randomlySetRadioOptions = {}

        return this.api
          .perform((done) => {
            this.getRadioOption({ name: 'average_salary' }, (result) => {
              this.api.useCss().click(result.labelSelector)
              randomlySetRadioOptions.averageSalary = result
              done()
            })
          })
          .perform(() => {
            const textFields = filter(
              keys(details),
              (key) => !endsWith(key, 'Radio')
            )
            forEach(textFields, (key) => {
              this.replaceValue(`@${key}`, details[key])
            })
            forEach(keys(randomlySetRadioOptions), (key) => {
              this.api
                .useCss()
                .click(randomlySetRadioOptions[key].labelSelector)
              details[key] = randomlySetRadioOptions[key].text
            })
          })
          .perform(() => {
            this.waitForElementPresent('@saveButton').click('@saveButton')

            callback(details)
          })
      },
    },
  ],
}
