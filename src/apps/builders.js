const {
  at,
  castArray,
  get,
  has,
  keyBy,
  isArray,
  isFunction,
  isEmpty,
  isString,
  map,
  pick,
  pickBy,
} = require('lodash')
const { getOptions } = require('../lib/options')

function getDeepObjectValuesForKey(object, keyName, values = []) {
  if (isArray(object)) {
    object.map((item) => getDeepObjectValuesForKey(item, keyName, values))
  }
  map(object, (value, key) => {
    if (key === 'children' || key === 'options') {
      getDeepObjectValuesForKey(value, keyName, values)
    }
    if (key === keyName) {
      values.push(value)
    }
  })

  return values
}

function assignPropsIfFoundInObject(children, sourceObject = {}, propName) {
  if (!isArray(children) || isEmpty(sourceObject) || !propName) {
    return children
  }

  return children.map((child) => {
    if (child.children) {
      child.children = assignPropsIfFoundInObject(
        child.children,
        sourceObject,
        propName
      )
    }
    if (isArray(child.options)) {
      child.options.map((option) => {
        if (option.children) {
          option.children = assignPropsIfFoundInObject(
            option.children,
            sourceObject,
            propName
          )
        }
        return option
      })
    }
    return {
      ...child,
      error: null, // ensure error is reset if another property is set (e.g. value)
      [propName]: sourceObject[child.name],
    }
  })
}

function buildFormWithErrors(form = {}, errorMessages = {}) {
  if (!isArray(form.children) || isEmpty(errorMessages)) {
    return form
  }

  const formFieldNames = getDeepObjectValuesForKey(form, 'name')
  const messages = pick(pickBy(errorMessages), formFieldNames)

  const fieldLabels = form.children
    .filter((x) => Object.keys(messages).includes(x.name))
    .reduce((obj, item) => {
      obj[item.name] = item.label || item.name
      return obj
    }, {})

  const errors = (!isEmpty(messages) || errorMessages.summary) && {
    summary: errorMessages.summary || 'Please correct the following errors:',
    messages,
    fieldLabels,
  }

  const children = assignPropsIfFoundInObject(form.children, messages, 'error')

  return Object.assign(form, {
    children,
    errors,
  })
}

function buildFormWithState(form = {}, requestBody = {}) {
  if (!isArray(form.children) || isEmpty(requestBody)) {
    return form
  }

  const children = assignPropsIfFoundInObject(
    form.children,
    requestBody,
    'value'
  )

  return Object.assign(form, {
    children,
  })
}

function buildFormWithStateAndErrors(form, requestBody, errorsObject) {
  if (isEmpty(requestBody)) {
    return form
  }

  const formWithState = buildFormWithState(form, requestBody)
  return buildFormWithErrors(formWithState, errorsObject)
}

function buildSelectedFiltersSummary(fields, query = {}) {
  if (!isArray(fields)) {
    return
  }

  return fields
    .map((field) => {
      field.value = query[field.name]
      return field
    })
    .filter(
      (field) => field.value || get(field, 'selectedOptions', []).length > 0
    )
    .reduce(buildSelectedFiltersSummaryReducer, {})
}

function buildSelectedFiltersSummaryReducer(fieldsObj, field) {
  if (!isEmpty(field.selectedOptions)) {
    fieldsObj[field.name] = getFieldWithSelectedOptions(field)
    return fieldsObj
  }

  fieldsObj[field.name] = {
    label: field.label,
    valueLabel: field.value,
  }

  const fieldValues = isString(field.value)
    ? field.value.split(',')
    : field.value
  const fieldOptions = isFunction(field.options)
    ? field.options()
    : field.options

  if (fieldOptions) {
    const selectedValues = at(keyBy(fieldOptions, 'value'), fieldValues).filter(
      (x) => x
    )
    fieldsObj[field.name].valueLabel = selectedValues
      .map((x) => x.label)
      .join(', ')
  }

  return fieldsObj
}

function getFieldWithSelectedOptions(field) {
  const values = field.selectedOptions.map((x) => x.label).join(', ')

  return {
    label: field.label,
    valueLabel: values,
  }
}

async function buildFieldsWithSelectedEntities(req, fields = [], query = {}) {
  const fieldsArray = castArray(fields)
  const processedFields = []

  for (let childIndex = 0; childIndex < fieldsArray.length; childIndex += 1) {
    const child = fieldsArray[childIndex]
    const newChild = { ...child }

    if (child.entity && has(query, child.name)) {
      const id = castArray(get(query, child.name))
      newChild.selectedOptions = await getOptions(req, child.entity, { id })
    }

    processedFields.push(newChild)
  }

  return processedFields
}

module.exports = {
  getDeepObjectValuesForKey,
  assignPropsIfFoundInObject,
  buildFormWithErrors,
  buildFormWithState,
  buildFormWithStateAndErrors,
  buildSelectedFiltersSummary,
  buildFieldsWithSelectedEntities,
}
