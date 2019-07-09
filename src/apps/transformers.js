/* eslint-disable camelcase */
const {
  filter,
  keyBy,
  snakeCase,
  upperFirst,
  flatten,
  uniqBy,
} = require('lodash')
const { isValid, format, parse } = require('date-fns')

const { hqLabels } = require('./companies/labels')

function transformObjectToOption ({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformObjectToGovUKOption ({ id, name }) {
  return {
    value: id,
    text: name,
  }
}

function transformHQCodeToLabelledOption ({ id, name }) {
  switch (name) {
    case 'ehq':
      return {
        value: id,
        label: hqLabels.ehq,
      }
    case 'ghq':
      return {
        value: id,
        label: hqLabels.ghq,
      }
    case 'ukhq':
      return {
        value: id,
        label: hqLabels.ukhq,
      }
  }
}

function transformStringToOption (string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption ({ id, first_name, last_name, job_title }) {
  return {
    value: id,
    label: upperFirst(
      filter([`${first_name} ${last_name}`, job_title]).join(', ')
    ),
  }
}

function transformIdToObject (id) {
  return {
    id,
  }
}

function transformDateObjectToDateString (key) {
  if (!key) {
    throw Error('date object key is required to transform date')
  }
  return function transformDateObjectToStringWithKey (props = {}) {
    const dateString = ['year', 'month', 'day']
      .map(x => props[`${key}_${x}`])
      .join('-')

    return dateString === '--' ? null : dateString
  }
}

function transformDateStringToDateObject (dateString) {
  const isValidDate = dateString && isValid(parse(dateString))

  return {
    year: isValidDate ? format(dateString, 'YYYY') : '',
    month: isValidDate ? format(dateString, 'MM') : '',
    day: isValidDate ? format(dateString, 'DD') : '',
  }
}

function transformServicesOptions (services) {
  const deliminator = ' : '

  const mapInteractionQuestions = service => {
    return service.interaction_questions && service.interaction_questions.length
      ? service.interaction_questions.map(q => {
        return {
          value: q.id,
          label: q.name,
          options:
              q.answer_options &&
              q.answer_options.map(o => ({
                label: o.name,
                value: o.id,
              })),
        }
      })
      : []
  }

  const serviceList = uniqBy(
    services.map(s => {
      const splitName = s.name.split(deliminator)
      return {
        label: splitName[0],
        value: !splitName[1] ? s.id : splitName[0],
        interactionQuestions: mapInteractionQuestions(s),
      }
    }),
    'label'
  )

  const subServiceList = services
    .map(s => {
      const splitName = s.name.split(deliminator)
      if (!splitName[1]) return
      return {
        label: splitName[1],
        value: s.id,
        parent: splitName[0],
        interactionQuestions: mapInteractionQuestions(s),
      }
    })
    .filter(s => s !== undefined)

  const nestedServiceList = serviceList.map(service => {
    const isControlledBySecondary = service.label === service.value

    const interactionQuestions = isControlledBySecondary
      ? []
      : service.interactionQuestions.map(question => ({
        ...question,
        serviceId: service.value,
      }))

    const secondaryOptions = isControlledBySecondary
      ? subServiceList
        .map(option => {
          // loops through sub service list to and matches it to its parent service
          if (option.parent === service.label) {
            return {
              ...option,
              interactionQuestions: option.interactionQuestions.map(
                question => ({
                  ...question,
                  serviceId: option.value,
                  isControlledBySecondary,
                })
              ),
            }
          }
        })
        .filter(s => s !== undefined)
      : []

    return {
      ...service,
      interactionQuestions,
      secondaryOptions,
    }
  })

  return nestedServiceList
}

function transformServiceQuestionsToOptions (questions) {
  const mapOptions = ({ id, name, answer_options = [] }) => {
    return {
      value: id,
      label: name,
      options: flatten(answer_options.map(mapAnswerOptions)),
    }
  }

  const mapAdditionalQuestions = ({ id, type, is_required, name }) => {
    return {
      value: id,
      label: name,
      type: type && type,
      isRequired: is_required && is_required,
    }
  }

  const mapAnswerOptions = ({ id, name, additional_questions = [] }) => {
    return {
      value: id,
      label: name,
      additionalQuestions: additional_questions.map(mapAdditionalQuestions),
    }
  }

  return mapOptions(questions)
}

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj (collection) {
  return keyBy(collection, elem => {
    return snakeCase(elem.label)
  })
}

module.exports = {
  buildMetaDataObj,
  transformHQCodeToLabelledOption,
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
  transformIdToObject,
  transformDateObjectToDateString,
  transformDateStringToDateObject,
  transformServicesOptions,
  transformServiceQuestionsToOptions,
  transformObjectToGovUKOption,
}
