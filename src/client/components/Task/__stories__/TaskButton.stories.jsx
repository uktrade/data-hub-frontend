import React from 'react'
import styled from 'styled-components'

import { TaskButton } from '../TaskButton'

export default {
  title: 'Task/TaskButton',
}

const StyledList = styled('ul')({
  listStyleType: 'none',
})

export const List = () => (
  <StyledList>
    {[{ id: 1 }, { id: 2 }, { id: 3 }].map((item) => (
      <li>
        <TaskButton
          id={item.id}
          name={'TASK_DO_SOMETHING'}
          startOptions={{ payload: item.id }}
        >
          Do Something
        </TaskButton>
      </li>
    ))}
  </StyledList>
)
