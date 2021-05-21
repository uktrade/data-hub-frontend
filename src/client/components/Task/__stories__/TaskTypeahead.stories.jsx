/* eslint-disable */
import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { number, withKnobs } from '@storybook/addon-knobs'

import TaskReactSelect from '../ReactSelect'
import TaskTypeahead from '../Typeahead'

addDecorator(withKnobs)

const delayKnobOptions = {range: true, min: 0, max: 10000, step: 500}

const Base = ({component: Component, id, delay, ...props}) =>
  <Component
    id={`${Component.displayName}_${id}`}
    optionsTaskName="Task typeahead example options"
    defaultValues={['foo', 'bar']}
    labelTaskName="Task typeahead example label"
    interceptOptionsPayload={payload => ({
      query: payload,
      delay,
    })}
    {...props}
  />

storiesOf('Task/Typeahead')
  .add('Multi-select', () => {
    const delay = number('Options delay', 500, delayKnobOptions)
    return (
      <>
        <h2><code>Task/Typeahead</code></h2>
        <Base
          component={TaskTypeahead}
          id="multi-select"
          isMulti={true}
          delay={delay}
        />
        <h2><code>Task/ReactSelect</code></h2>
        <Base
          component={TaskReactSelect}
          id="multi-select"
          isMulti={true}
          delay={delay}
        />
      </>
    )
  })
  .add('Single-select', () => {
    const delay = number('Options delay', 1000, delayKnobOptions)
    return (
      <>
        <h2><code>Task/Typeahead</code></h2>
        <Base
          component={TaskTypeahead}
          id="single-select"
          delay={delay}
        />
        <h2><code>Task/ReactSelect</code></h2>
        <Base
          component={TaskReactSelect}
          id="single-select"
          delay={delay}
        />
      </>
    )
  })
