import React from 'react'
import PropTypes from 'prop-types'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import Tag, { TAG_COLOURS } from '../../../Tag'

const flexMixin = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: SPACING.SCALE_1,
  [MEDIA_QUERIES.TABLET]: {
    gap: SPACING.SCALE_2,
  },
}

const Container = styled('div')({
  ...flexMixin,
  justifyContent: 'space-between',
  paddingBottom: '10px',
})

const ThemeServiceContainer = styled('div')({
  ...flexMixin,
})

const ActivityCardLabels = ({ isExternalActivity, theme, service, kind }) => (
  <Container>
    {(kind || theme || service) && (
      <ThemeServiceContainer>
        {kind && (
          <Tag colour={TAG_COLOURS.GREY} data-test="activity-kind-label">
            {kind}
          </Tag>
        )}
        {theme && (
          <Tag
            colour={
              isExternalActivity ? TAG_COLOURS.DARK_GREEN : TAG_COLOURS.GOV_BLUE
            }
            data-test="activity-theme-label"
          >
            {theme}
          </Tag>
        )}
        {service && (
          <Tag
            colour={
              isExternalActivity ? TAG_COLOURS.TURQUOISE : TAG_COLOURS.BLUE
            }
            data-test="activity-service-label"
          >
            {service}
          </Tag>
        )}
      </ThemeServiceContainer>
    )}
  </Container>
)

ActivityCardLabels.propTypes = {
  theme: PropTypes.string,
  service: PropTypes.string,
  kind: PropTypes.string.isRequired,
  isExternalActivity: PropTypes.bool,
}

export default ActivityCardLabels
