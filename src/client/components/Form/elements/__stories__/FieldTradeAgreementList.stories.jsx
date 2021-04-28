import React from 'react'
import { addDecorator, storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import Button from '@govuk-react/button'

import FormStateful from '../../FormStateful'
import FieldTradeAgreementList from '../FieldTradeAgreementList'

import exampleReadme from '../FieldTradeAgreementList/example.md'
import usageReadme from '../FieldTradeAgreementList/usage.md'

addDecorator(withKnobs)

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Trade agreement 1',
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Trade agreement 2',
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Trade agreement 3',
  },
]

storiesOf('Forms/TradeAgreementList', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Default', () => (
    <FormStateful onSubmit={action('onSubmit')}>
      {(state) => (
        <>
          <FieldTradeAgreementList
            label="Related Trade Agreements"
            name="trade_agreements"
            placeholder="-- Search trade agreements --"
            options={options}
            validate={[]}
          />
          <Button>Submit</Button>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </>
      )}
    </FormStateful>
  ))
