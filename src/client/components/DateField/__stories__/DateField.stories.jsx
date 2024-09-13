import React from 'react'

import DateField from '..'

export default {
  title: 'DateField',

  parameters: {
    component: DateField,
  },
}

const BasicDateField = () => {
  return (
    <DateField
      name="start_date"
      initialValue="2020-02-02"
      label="Start Date"
      legend="This is a start date field"
      hint="When it began"
    />
  )
}
const AlertChangeDateField = () => {
  return (
    <DateField
      name="end_date"
      initialValue="2020-12-31"
      label="End Date"
      onChange={() => alert('End date changed!')}
    />
  )
}

export const Basic = () => <BasicDateField />
export const CallbackOnChange = () => <AlertChangeDateField />

CallbackOnChange.story = {
  name: 'Callback on Change',
}
