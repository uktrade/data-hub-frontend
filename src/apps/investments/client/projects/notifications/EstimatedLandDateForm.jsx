import React from 'react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import { GREY_2 } from 'govuk-colours'
import { H2, H3 } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import {
  Main,
  Form,
  FieldCheckboxes,
  InvestmentProjectLocalHeader,
} from '../../../../../client/components'

import { format } from '../../../../../client/utils/date'

import {
  TASK__GET_NOTIFY_SETTINGS_ESTIMATED_LAND_DATE,
  TASK__SAVE_NOTIFY_SETTINGS_ESTIMATED_LAND_DATE,
} from './state'

import urls from '../../../../../lib/urls'

const NONE_VALUE = 'none'
const NONE_LABEL = 'None, I do not want to get emails for estimated land date'

const options = [
  {
    value: '60',
    label: '60 days before estimated land date',
  },
  {
    value: '30',
    label: '30 days before estimated land date',
  },
  {
    value: NONE_VALUE,
    label: NONE_LABEL,
  },
]

const StyledEstimatedLandDate = styled('div')({
  borderLeft: `10px solid ${GREY_2}`,
  padding: 12,
  marginTop: SPACING.SCALE_2,
  marginBottom: SPACING.SCALE_5,
  fontSize: FONT_SIZE.SIZE_16,
})

const EstimatedLandDateForm = ({ investment }) => (
  <>
    <InvestmentProjectLocalHeader
      investment={investment}
      breadcrumbs={[
        { link: urls.dashboard(), text: 'Home' },
        {
          link: urls.investments.index(),
          text: 'Investments',
        },
        {
          link: urls.investments.index(),
          text: 'Projects',
        },
        {
          link: urls.investments.projects.details(investment.id),
          text: investment.name,
        },
        {
          link: urls.investments.projects.notifications(investment.id),
          text: 'Notifications',
        },
        {
          text: 'Estimated land date',
        },
      ]}
    />
    <Main>
      <H2 size={LEVEL_SIZE[3]}>Estimated land date notification preferences</H2>
      <StyledEstimatedLandDate data-test="estimated-land-date">
        Estimated land date for this project:{' '}
        {format(investment.estimated_land_date)}
      </StyledEstimatedLandDate>
      <Form
        id="notify-settings-estimated-land-date"
        initialValuesPayload={investment}
        initialValuesTaskName={TASK__GET_NOTIFY_SETTINGS_ESTIMATED_LAND_DATE}
        submissionTaskName={TASK__SAVE_NOTIFY_SETTINGS_ESTIMATED_LAND_DATE}
        redirectTo={() => urls.investments.projects.details(investment.id)}
        transformPayload={({ estimated_land_date }) => ({
          investment,
          estimated_land_date: estimated_land_date.filter(
            (esl) => esl !== NONE_VALUE
          ),
        })}
        analyticsFormName="Notify settings - estimated land date"
        flashMessage={() => 'Estimated land date notifications updated'}
        cancelRedirectTo={() =>
          `/investments/projects/${investment.id}/details`
        }
      >
        {({ values }) => (
          <>
            {values.estimatedLandDate && (
              <FieldCheckboxes
                name="estimated_land_date"
                legend={
                  <H3 size={LEVEL_SIZE[4]}>
                    When do you want to get an email for this project?
                  </H3>
                }
                hint="Select all that apply"
                required={`Select notification email or select "${NONE_LABEL}"`}
                exclusive={true}
                initialValue={values.estimatedLandDate}
                options={options}
              />
            )}
          </>
        )}
      </Form>
    </Main>
  </>
)

export default EstimatedLandDateForm
