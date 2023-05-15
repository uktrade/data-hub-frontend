import React from 'react'

import FieldHelp from '../FieldHelp'

export default {
  title: 'Form/Form Elements/Help',

  parameters: {
    component: FieldHelp,
  },
}

export const FieldHelpWithFooterUrl = () => (
  <>
    <FieldHelp
      helpSummary="Help with policy issue types"
      helpText="A policy is the broad category/categories that information fits into."
      footerUrl="http://datahub.trade.gov.uk/"
      footerUrlDescription="Learn more about policy issue types. This will open in a new tab or window"
    />
  </>
)

FieldHelpWithFooterUrl.story = {
  name: 'FieldHelp - with footer URL',
}

export const FieldHelpWithoutFooterUrl = () => (
  <>
    <FieldHelp
      helpSummary="Help with policy issue types"
      helpText="A policy is the broad category/categories that information fits into."
    />
  </>
)

FieldHelpWithoutFooterUrl.story = {
  name: 'FieldHelp - without footer URL',
}

export const FieldHelpSetAsOpen = () => (
  <>
    <FieldHelp
      helpSummary="Help with policy issue types"
      helpText="A policy is the broad category/categories that information fits into."
      open="true"
    />
  </>
)

FieldHelpSetAsOpen.story = {
  name: 'FieldHelp - set as open',
}
