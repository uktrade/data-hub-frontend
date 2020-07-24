import React from 'react'
import { storiesOf } from '@storybook/react'
import Button from '@govuk-react/button'

import ButtonLink from 'ButtonLink'

storiesOf('ButtonLink', module)
  .add('Default', () => {
    return (
      <div>
        <Button>Submit</Button>
        <ButtonLink>Cancel</ButtonLink>
      </div>
    )
  })
  .add('Inline', () => {
    return (
      <div>
        Some text <ButtonLink inline={true}>Change</ButtonLink>
      </div>
    )
  })
