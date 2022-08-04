import React from 'react'
import { addDecorator, configure, addParameters } from '@storybook/react'
import { addReadme } from 'storybook-readme'
import { FONT_SIZE, FONT_STACK, MEDIA_QUERIES } from '@govuk-react/constants'
import { createGlobalStyle } from 'styled-components'

const req = require.context('../src', true, /.*\.stories\.(js|jsx)$/)

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

addDecorator(addReadme)
addDecorator((s) => (
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
      {s()}
    </DataHubProvider>
  </>
))

configure(req, module)
