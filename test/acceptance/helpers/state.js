const faker = require('faker')
const { get, set, lowerCase, findKey } = require('lodash')

/**
 * Store input values that have been randomly chosen for a radio with sub field component
 * @param stateStore
 * @param subComponentName
 * @param componentSchema
 * @param pageSection
 * @returns {Promise}
 */
const storeRadioSubFieldValues = function (stateStore, subComponentName, componentSchema, pageSection) {
  const subComponentTag = `@${subComponentName}`
  const radioInputChoice = componentSchema.options[Math.floor((Math.random() * componentSchema.options.length))]

  return new Promise((resolve) => {
    pageSection
      .waitForElementVisible(`@${radioInputChoice}`)
      .click(`@${radioInputChoice}`, () => {
        const subField = get(componentSchema.values, radioInputChoice)

        if (subField) {
          if (subField.inputType === 'select') {
            pageSection
              .waitForElementPresent(subComponentTag)
              .getListOption(subComponentTag, (option) => {
                set(stateStore, subComponentName, option)
                resolve()
              })
          }
        } else {
          set(stateStore, subComponentName, null)
          resolve()
        }
      })
  })
}

/**
 * Store input values that have been randomly chosen for a select with sub field component
 * @param stateStore
 * @param subComponentName
 * @param componentSchema
 * @param pageSection
 * @returns {Promise}
 */
const storeSelectSubFieldValues = function (stateStore, subComponentName, componentSchema, pageSection) {
  const componentTag = `@${subComponentName}`

  return new Promise((resolve) => {
    pageSection
      .waitForElementVisible(componentTag)
      .getListOption(componentTag, (option) => {
        const subFieldInputTag = findKey(componentSchema.values, (item) => item.value === lowerCase(option))
        set(stateStore, subComponentName, option)

        if (subFieldInputTag) {
          const subFieldInputType = get(componentSchema.values, `${subFieldInputTag}.inputType`)

          if (subFieldInputType === 'text') {
            set(stateStore, subFieldInputTag, faker.commerce.department())
            resolve()
          }

          if (subFieldInputType === 'select') {
            pageSection
              .waitForElementPresent(`@${subFieldInputTag}`)
              .getListOption(`@${subFieldInputTag}`, (subOption) => {
                set(stateStore, subFieldInputTag, subOption)
                resolve()
              })
          }
        } else {
          resolve()
        }
      })
  })
}

/**
 * Store input values that have been randomly chosen for a select
 * @param stateStore
 * @param subComponentName
 * @param pageSection
 * @returns {Promise}
 */
const storeSelectValue = function (stateStore, subComponentName, pageSection) {
  const componentTag = `@${subComponentName}`

  return new Promise((resolve) => {
    pageSection
      .waitForElementVisible(componentTag)
      .getListOption(componentTag, (option) => {
        set(stateStore, subComponentName, option)
        resolve()
      })
  })
}

module.exports = {
  storeSelectValue,
  storeSelectSubFieldValues,
  storeRadioSubFieldValues,
}
