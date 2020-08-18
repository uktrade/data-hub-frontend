import React from 'react'

import { FieldRadios } from '../../../../../client/components'
import { useFormContext } from '../../../../../client/components/Form/hooks'
import { THEMES, KINDS } from '../../../constants'

const getOnChangeHandler = (fieldName, setFieldValue) => (e) => {
  setFieldValue('service', '')
  setFieldValue(fieldName, e.target.value)
}

const getInvestmentOnChangeHandler = (setFieldValue) => (e) => {
  setFieldValue('service', '')
  setFieldValue('theme', e.target.value)
  setFieldValue('kind', KINDS.INTERACTION)
}

const StepInteractionType = () => {
  const { setFieldValue } = useFormContext()
  return (
    <FieldRadios
      name="theme"
      label="What is this regarding?"
      required="Select what you would like to record"
      options={[
        {
          label: 'Export',
          value: THEMES.EXPORT,
          onChange: getOnChangeHandler('theme', setFieldValue),
          children: (
            <FieldRadios
              label="What would you like to record?"
              name="kind"
              required="Select what you would like to record"
              options={[
                {
                  label: 'A standard interaction',
                  hint: 'For example, an email, phone call or meeting',
                  value: KINDS.INTERACTION,
                  onChange: getOnChangeHandler('kind', setFieldValue),
                },
                {
                  label: 'A service that you have provided',
                  hint: 'For example a significant assist or an event',
                  value: KINDS.SERVICE_DELIVERY,
                  onChange: getOnChangeHandler('kind', setFieldValue),
                },
              ]}
            />
          ),
        },
        {
          label: 'Investment',
          value: THEMES.INVESTMENT,
          onChange: getInvestmentOnChangeHandler(setFieldValue),
        },
        {
          label: 'Other',
          value: THEMES.OTHER,
          onChange: getOnChangeHandler('theme', setFieldValue),
          children: (
            <FieldRadios
              label="What would you like to record?"
              name="kind"
              required="Select what you would like to record"
              onChange={getOnChangeHandler('kind', setFieldValue)}
              options={[
                {
                  label: 'A standard interaction',
                  hint: 'For example, an email, phone call or meeting',
                  value: KINDS.INTERACTION,
                  onChange: getOnChangeHandler('kind', setFieldValue),
                },
                {
                  label: 'A service that you have provided',
                  hint: 'For example a significant assist or an event',
                  value: KINDS.SERVICE_DELIVERY,
                  onChange: getOnChangeHandler('kind', setFieldValue),
                },
              ]}
            />
          ),
        },
      ]}
    />
  )
}

export default StepInteractionType
