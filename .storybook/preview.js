import React from 'react'
import { FONT_SIZE, FONT_STACK, MEDIA_QUERIES } from '@govuk-react/constants'
import { createGlobalStyle } from 'styled-components'

import '../src/client/components'
import { createProvider } from '../src/client/createProvider.jsx'
import taskStoriesTasks from '../src/client/components/Task/__stories__/tasks.js'
import typeaheadTasks from '../src/client/components/Typeahead/tasks.js'
import contactTasks from '../src/client/components/Resource/__stories__/tasks.js'
import formTasks from '../src/client/components/Form/__stories__/tasks'

const GlobalStyle = createGlobalStyle`
  body {
    font: ${FONT_SIZE.SIZE_16} ${FONT_STACK};

    ${MEDIA_QUERIES.TABLET} {
      font: ${FONT_SIZE.SIZE_19} ${FONT_STACK};
    }
  }
`
const Provider = createProvider({
  tasks: {
    ...taskStoriesTasks,
    ...contactTasks,
    ...typeaheadTasks,
    ...formTasks,
  },
})
export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <Provider>
        <Story />
      </Provider>
    </>
  ),
]
