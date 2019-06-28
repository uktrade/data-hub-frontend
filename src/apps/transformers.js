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

function transformContactToOption ({
  id,
  first_name,
  last_name,
  job_title,
  email,
}) {
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
  const delim = ' : '

  const level1 = uniqBy(
    services.map(s => {
      const splitName = s.name.split(delim)
      return {
        label: splitName[0],
        value: !splitName[1] ? s.id : splitName[0],
        interactionQuestions: s.interaction_questions.length
          ? s.interaction_questions.map(q => {
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
          : [],
      }
    }),
    'label'
  )

  const level2 = services
    .map(s => {
      const splitName = s.name.split(delim)
      if (!splitName[1]) return
      return {
        label: splitName[1],
        value: s.id,
        parent: splitName[0],
        interactionQuestions: s.interaction_questions
          ? s.interaction_questions.map(q => {
            return {
              label: q.name,
              value: q.id,
              options:
                  q.answer_options &&
                  q.answer_options.map(o => ({
                    label: o.name,
                    value: o.id,
                  })),
            }
          })
          : [],
      }
    })
    .filter(s => s !== undefined)

  const nested = level1.map(s => {
    const isControlledBySecondary = s.label === s.value
    return {
      ...s,
      interactionQuestions: isControlledBySecondary
        ? []
        : s.interactionQuestions.map(i => ({
          ...i,
          serviceId: s.value,
        })),
      secondaryOptions: isControlledBySecondary
        ? level2
          .map(o => {
            if (o.parent === s.label) {
              return {
                ...o,
                interactionQuestions: o.interactionQuestions.map(i => {
                  return {
                    ...i,
                    serviceId: o.value,
                    isControlledBySecondary,
                  }
                }),
              }
            }
          })
          .filter(s => s !== undefined)
        : [],
    }
  })

  return nested
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
