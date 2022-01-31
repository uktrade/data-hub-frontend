import React from 'react'
import { storiesOf } from '@storybook/react'

import FieldHelp from '../FieldHelp'

storiesOf('Form/Form Elements/Help', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('FieldHelp - with footer URL', () => (
    <>
      <FieldHelp
        helpSummary="Help with policy issue types"
        helpText="A policy is the broad category/categories that information fits into."
        footerUrl="http://datahub.trade.gov.uk/"
        footerUrlDescription="See more guidance"
      />
    </>
  ))
  .add('FieldHelp - without footer URL', () => (
    <>
      <FieldHelp
        helpSummary="Help with policy issue types"
        helpText="A policy is the broad category/categories that information fits into."
      />
    </>
  ))
  .add('FieldHelp - set as open', () => (
    <>
      <FieldHelp
        helpSummary="Help with policy issue types"
        helpText="A policy is the broad category/categories that information fits into."
        open="true"
      />
    </>
  ))
