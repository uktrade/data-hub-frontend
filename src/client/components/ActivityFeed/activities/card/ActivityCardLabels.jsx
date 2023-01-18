import React from 'react'
import Tag from '../../../Tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { SPACING } from '@govuk-react/constants'

const TagRow = styled('div')`
  display: inline-block;
  justify-content: space-between;
  padding-bottom: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_1};
`

const TagColumn = styled('div')`
  display: inline-block;
`

const StyledThemeTag = styled(Tag)`
  margin-bottom: ${SPACING.SCALE_1};
`

const ActivityCardLabels = ({ isExternalActivity, theme, service, kind }) => (
  <TagRow>
    <TagColumn>
      {theme && (
        <StyledThemeTag
          data-test="activity-theme-label"
          colour={isExternalActivity ? 'darkGreen' : 'default'}
        >
          {theme}
        </StyledThemeTag>
      )}
      {service && (
        <StyledThemeTag
          data-test="activity-service-label"
          colour={isExternalActivity ? 'turquoise' : 'blue'}
        >
          {service}
        </StyledThemeTag>
      )}
      {kind && (
        <StyledThemeTag data-test="activity-kind-label" colour="grey">
          {kind}
        </StyledThemeTag>
      )}
    </TagColumn>
  </TagRow>
)

ActivityCardLabels.propTypes = {
  theme: PropTypes.string,
  service: PropTypes.string,
  kind: PropTypes.string.isRequired,
  isExternalActivity: PropTypes.bool,
}

ActivityCardLabels.defaultProps = {
  isExternalActivity: false,
}
export default ActivityCardLabels
