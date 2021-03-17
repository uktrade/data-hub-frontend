import React from 'react'
import { storiesOf } from '@storybook/react'

import { VARIANTS } from '../../../../common/constants'

import usageReadme from '../usage.md'
import exampleReadme from '../example.md'

import FieldInput from '../../Form/elements/FieldInput'
import FormStateful from '../../Form/FormStateful'

import NotificationBadge from 'NotificationBadge'
import ToggleSection from 'ToggleSection'

storiesOf('ToggleSection', module)
  .addParameters({
    options: { theme: undefined },
    readme: {
      content: exampleReadme,
      sidebar: usageReadme,
    },
  })
  .add('Primary - Single (with badge)', () => (
    <ToggleSection
      label="Toggle me"
      id="toggle.one"
      isOpen={true}
      variant={VARIANTS.PRIMARY}
      badge={<NotificationBadge label="15" />}
    >
      <FormStateful>
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </FormStateful>
    </ToggleSection>
  ))
  .add('Primary - Multiple', () => (
    <>
      <ToggleSection
        label="Toggle me"
        id="toggle.two"
        isOpen={true}
        variant={VARIANTS.PRIMARY}
      >
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
      <ToggleSection
        label="Toggle me"
        id="toggle.three"
        variant={VARIANTS.PRIMARY}
      >
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
    </>
  ))
  .add('Secondary - Single', () => (
    <ToggleSection
      label="Toggle me"
      id="toggle.four"
      isOpen={true}
      variant={VARIANTS.SECONDARY}
    >
      <FormStateful>
        {() => (
          <FieldInput
            label="Text"
            hint="Some hint"
            name="testField"
            required="Enter text"
            type="text"
          />
        )}
      </FormStateful>
    </ToggleSection>
  ))
  .add('Secondary - Multiple', () => (
    <>
      <ToggleSection
        label="Toggle me"
        id="toggle.five"
        isOpen={true}
        variant={VARIANTS.SECONDARY}
      >
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
      <ToggleSection
        label="Toggle me"
        id="toggle.six"
        variant={VARIANTS.SECONDARY}
      >
        <FormStateful>
          {() => (
            <FieldInput
              label="Text"
              hint="Some hint"
              name="testField"
              required="Enter text"
              type="text"
            />
          )}
        </FormStateful>
      </ToggleSection>
    </>
  ))
