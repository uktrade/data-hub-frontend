import _ from 'lodash'
import React from 'react'
import Select from 'react-select/base'

import {
  TASK_REACT_SELECT__CHANGE,
  TASK_REACT_SELECT__INPUT_CHANGE,
  TASK_REACT_SELECT__OPEN_MENU,
  TASK_REACT_SELECT__SUCCESS,
} from '../../actions'

import multiInstance from '../../utils/multiinstance'
import Task from '.'

const TaskTypeahead = ({
  id,
  taskName,
  defaultValues,
  onChange,
  interceptOptionsPayload = (x) => x,
  resultToOptions = (x) => x,
  // State props
  menuIsOpen,
  result,
  value,
  inputValue = '',
  dispatch,
  touched,
  ...props
}) => (
  <Task>
    {(t) => {
      const optionsTask = t(taskName, id)
      return (
        <Select
          {...props}
          isLoading={optionsTask.progress}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => {
            dispatch({
              type: TASK_REACT_SELECT__OPEN_MENU,
            })
            optionsTask.cancel()
            optionsTask.start({
              onSuccessDispatch: TASK_REACT_SELECT__SUCCESS,
              payload: interceptOptionsPayload(''),
            })
          }}
          options={result && resultToOptions(result)}
          noOptionsMessage={({ inputValue }) =>
            optionsTask.error ? (
              <>
                Error: {optionsTask.errorMessage}
                <br />
                Type to retry.
              </>
            ) : (
              `No options for "${inputValue}"`
            )
          }
          inputValue={inputValue}
          value={value}
          onChange={(x) => {
            dispatch({
              type: TASK_REACT_SELECT__CHANGE,
              value: x,
            })
            onChange && onChange(x)
          }}
          onInputChange={_.throttle((inputValue) => {
            dispatch({
              type: TASK_REACT_SELECT__INPUT_CHANGE,
              inputValue,
            })
            optionsTask.cancel()
            optionsTask.start({
              onSuccessDispatch: TASK_REACT_SELECT__SUCCESS,
              payload: interceptOptionsPayload(inputValue),
            })
          }, 500)}
          onMenuClose={optionsTask.cancel}
        />
      )
    }}
  </Task>
)

export default multiInstance({
  name: 'TaskReactSelect',
  actionPattern: 'TASK_REACT_SELECT__',
  reducer: (state = {}, { type, inputValue, value, result }) => {
    switch (type) {
      case TASK_REACT_SELECT__OPEN_MENU:
        return { ...state, menuIsOpen: true }
      case TASK_REACT_SELECT__INPUT_CHANGE:
        return { ...state, inputValue }
      case TASK_REACT_SELECT__CHANGE:
        return { ...state, value, menuIsOpen: false }
      case TASK_REACT_SELECT__SUCCESS:
        return { ...state, result }
      default:
        return state
    }
  },
  component: TaskTypeahead,
})
