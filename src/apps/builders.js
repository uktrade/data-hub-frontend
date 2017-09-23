const { assign, at, keyBy, pick, pickBy, isArray, isFunction, isEmpty, isString, map } = require('lodash')

function getDeepObjectValuesForKey (object, keyName, values = []) {
  if (isArray(object)) {
    object.map(item => getDeepObjectValuesForKey(item, keyName, values))
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

function assignPropsIfFoundInObject (children, sourceObject = {}, propName) {
  if (!isArray(children) || isEmpty(sourceObject) || !propName) { return children }

  return children.map(child => {
    if (child.children) {
      child.children = assignPropsIfFoundInObject(child.children, sourceObject, propName)
    }
    if (isArray(child.options)) {
      child.options.map(option => {
        if (option.children) {
          option.children = assignPropsIfFoundInObject(option.children, sourceObject, propName)
        }
        return option
      })
    }
    return assign(
      {},
      child,
      { error: null }, // ensure error is reset if another property is set (e.g. value)
      { [propName]: sourceObject[child.name] }
    )
  })
}

function buildFormWithErrors (form = {}, errorMessages = {}) {
  if (!isArray(form.children) || isEmpty(errorMessages)) { return form }

  const formFieldNames = getDeepObjectValuesForKey(form, 'name')
  const messages = pick(pickBy(errorMessages), formFieldNames)

  const fieldLabels = form.children
    .filter(x => Object.keys(messages).includes(x.name))
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

  return assign({}, form, {
    children,
    errors,
  })
}

function buildFormWithState (form = {}, requestBody = {}) {
  if (!isArray(form.children) || isEmpty(requestBody)) { return form }

  const children = assignPropsIfFoundInObject(form.children, requestBody, 'value')

  return assign({}, form, {
    children,
  })
}

function buildFormWithStateAndErrors (form, requestBody, errorsObject) {
  if (isEmpty(requestBody)) { return form }

  const formWithState = buildFormWithState(form, requestBody)
  return buildFormWithErrors(formWithState, errorsObject)
}

function buildSelectedFiltersSummary (fields, query = {}) {
  if (!isArray(fields)) { return }

  return fields
    .map(field => {
      field.value = query[field.name]
      return field
    })
    .filter(field => field.value)
    .reduce((fieldsObj, field) => {
      fieldsObj[field.name] = {
        label: field.label,
        valueLabel: field.value,
      }

      const fieldValues = isString(field.value) ? field.value.split(',') : field.value
      const fieldOptions = isFunction(field.options) ? field.options() : field.options

      if (fieldOptions) {
        const selectedValues = at(keyBy(fieldOptions, 'value'), fieldValues).filter(x => x)
        fieldsObj[field.name].valueLabel = selectedValues.map(x => x.label).join(', ')
      }

      return fieldsObj
    }, {})
}

module.exports = {
  getDeepObjectValuesForKey,
  assignPropsIfFoundInObject,
  buildFormWithErrors,
  buildFormWithState,
  buildFormWithStateAndErrors,
  buildSelectedFiltersSummary,
}
