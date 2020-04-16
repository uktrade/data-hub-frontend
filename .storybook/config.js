import React from 'react'
import { addDecorator, configure } from '@storybook/react'
import { addReadme } from 'storybook-readme'
import { FONT_SIZE, FONT_STACK, MEDIA_QUERIES } from '@govuk-react/constants'
import { createGlobalStyle } from 'styled-components'

const req = require.context('../src', true, /.*\.stories\.(js|jsx)$/)

const GlobalStyle = createGlobalStyle`
  body {
    font: ${FONT_SIZE.SIZE_16} ${FONT_STACK};

    ${MEDIA_QUERIES.TABLET} {
      font: ${FONT_SIZE.SIZE_19} ${FONT_STACK};
    }
  }
`
addDecorator(addReadme)
addDecorator(s => <><GlobalStyle />{s()}</>)

const loadStories = () => req.keys().forEach(filename => req(filename))

configure(loadStories, module)
