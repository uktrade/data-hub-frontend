const { getButtonWithText } = require('../../../helpers/selectors')

module.exports = {
  url: process.env.QA_HOST,
  elements: {
    totalInvestmentYes: '[for="field-client_cannot_provide_total_investment-1"]',
    totalInvestmentNo: '[for="field-client_cannot_provide_total_investment-2"]',
    totalInvestment: '#field-total_investment',
    foreignEquityInvestmentYes: '[for="field-client_cannot_provide_foreign_investment-1"]',
    foreignEquityInvestmentNo: '[for="field-client_cannot_provide_foreign_investment-2"]',
    foreignEquityInvestment: '#field-foreign_equity_investment',
    numberOfNewJobs: '#field-number_new_jobs',
    numberOfSafeguardedJobs: '#field-number_safeguarded_jobs',
    governmentAssistanceYes: '[for="field-government_assistance-1"]',
    governmentAssistanceNo: '[for="field-government_assistance-2"]',
    rAndDBudgetYes: '[for="field-r_and_d_budget-1"]',
    rAndDBudgetNo: '[for="field-r_and_d_budget-2"]',
    nonFdiRAndDBudgetYes: '[for="field-non_fdi_r_and_d_budget-1"]',
    nonFdiRAndDBudgetNo: '[for="field-non_fdi_r_and_d_budget-2"]',
    newTechToUkYes: '[for="field-new_tech_to_uk-1"]',
    newTechToUkNo: '[for="field-new_tech_to_uk-2"]',
    exportRevenueYes: '[for="field-export_revenue-1"]',
    exportRevenueNo: '[for="field-export_revenue-2"]',
    saveButton: getButtonWithText('Save'),
  },
  commands: [
    {
      add (investmentValue = {}, answer, callback) {
        const investmentValueRadioOptions = {}

        this
          .waitForElementPresent('@saveButton')
          .click(`@totalInvestment${answer}`)
          .click(`@foreignEquityInvestment${answer}`)
          .click(`@governmentAssistance${answer}`)
          .click(`@rAndDBudget${answer}`)
          .click(`@nonFdiRAndDBudget${answer}`)
          .click(`@newTechToUk${answer}`)
          .click(`@exportRevenue${answer}`)

        this
          .api.perform((done) => {
            this.getRadioOption('average_salary', (result) => {
              this.api.useCss().click(result.labelSelector)
              investmentValueRadioOptions.averageSalary = result
              done()
            })
          })
          .perform(() => {
            for (const key in investmentValue) {
              if (investmentValue[key]) {
                this.replaceValue(`@${key}`, investmentValue[key])
              }
            }
            for (const key in investmentValueRadioOptions) {
              this.api.useCss().click(investmentValueRadioOptions[key].labelSelector)
              investmentValue[key] = investmentValueRadioOptions[key].text
            }
          })
          .perform(() => {
            this
              .waitForElementPresent('@saveButton')
              .click('@saveButton')

            callback(investmentValue)
          })

        callback(investmentValue)
      },
    },
  ],
}
