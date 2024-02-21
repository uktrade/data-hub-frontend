import React from 'react'
import { FONT_SIZE, FONT_STACK, MEDIA_QUERIES } from '@govuk-react/constants'
import { createGlobalStyle } from 'styled-components'

import '../src/client/components'
import DataHubProvider from '../src/client/provider'
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

export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <DataHubProvider
        tasks={{
          ...taskStoriesTasks,
          ...contactTasks,
          ...typeaheadTasks,
          ...formTasks,
        }}
      >
        <Story />
      </DataHubProvider>
    </>
  ),
]
