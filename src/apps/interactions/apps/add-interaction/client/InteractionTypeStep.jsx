import React from 'react'
import { FieldRadios, Step, useFormContext } from 'data-hub-components'
import { THEMES, SERVICE_CONTEXTS } from '../../../constants'

const getOnChangeHandler = (fieldName, setFieldValue) => (e) => {
  setFieldValue('kind_export', '')
  setFieldValue('kind_other', '')
  setFieldValue('service', '')
  setFieldValue(fieldName, e.target.value)
}

const InteractionTypeStep = () => {
  const { setFieldValue } = useFormContext()
  return (
    <Step name="interaction_type">
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
                name="kind_export"
                required="Select what you would like to record"
                options={[
                  {
                    label: 'A standard interaction',
                    hint: 'For example, an email, phone call or meeting',
                    value: SERVICE_CONTEXTS.EXPORT_INTERACTION,
                    onChange: getOnChangeHandler('kind_export', setFieldValue),
                  },
                  {
                    label: 'A service that you have provided',
                    hint: 'For example a significant assist or an event',
                    value: SERVICE_CONTEXTS.EXPORT_SERVICE_DELIVERY,
                    onChange: getOnChangeHandler('kind_export', setFieldValue),
                  },
                ]}
              />
            ),
          },
          {
            label: 'Investment',
            value: THEMES.INVESTMENT,
            onChange: getOnChangeHandler('theme', setFieldValue),
          },
          {
            label: 'Other',
            value: THEMES.OTHER,
            onChange: getOnChangeHandler('theme', setFieldValue),
            children: (
              <FieldRadios
                label="What would you like to record?"
                name="kind_other"
                required="Select what you would like to record"
                onChange={getOnChangeHandler('kind_other', setFieldValue)}
                options={[
                  {
                    label: 'A standard interaction',
                    hint: 'For example, an email, phone call or meeting',
                    value: SERVICE_CONTEXTS.OTHER_INTERACTION,
                    onChange: getOnChangeHandler('kind_other', setFieldValue),
                  },
                  {
                    label: 'A service that you have provided',
                    hint: 'For example a significant assist or an event',
                    value: SERVICE_CONTEXTS.OTHER_SERVICE_DELIVERY,
                    onChange: getOnChangeHandler('kind_other', setFieldValue),
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </Step>
  )
}

export default InteractionTypeStep
