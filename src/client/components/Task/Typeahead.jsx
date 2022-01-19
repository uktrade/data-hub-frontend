// TODO: RR-237 - this Typeahead is no longer used and can be removed -
// please use Typeahead2 instead (which uses tasks)
import React from 'react'
import { components } from 'react-select'

import TaskReactSelect from './ReactSelect'

import typeaheadStyles, { errorStyles } from '../Typeahead/styles'

const Option = ({
  selectProps: { inputValue: needle },
  data: { label: hay },
  ...props
}) => {
  const [, front, middle, end] =
    hay.match(new RegExp(`(.*)(${needle})(.*)`, 'i')) || []
  return (
    <components.Option {...props}>
      {front}
      <strong>{middle}</strong>
      {end}
    </components.Option>
  )
}

const TaskReactSelectGovUK = ({ error, styles, ...props }) => (
  <TaskReactSelect
    {...props}
    styles={{
      ...typeaheadStyles,
      ...(error && errorStyles),
      ...styles,
    }}
    components={{ Option }}
  />
)

TaskReactSelectGovUK.propTypes = TaskReactSelect.propTypes

export default TaskReactSelectGovUK
