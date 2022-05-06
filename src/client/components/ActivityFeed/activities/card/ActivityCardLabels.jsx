import React from 'react'
import Tag from '../../../Tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { SPACING } from '@govuk-react/constants'

const TagRow = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_1};
`

const TagColumn = styled('div')`
  display: flex;
`

const StyledThemeTag = styled(Tag)`
  margin-right: ${SPACING.SCALE_1};
`

const ActivityCardLabels = ({ theme, service, kind }) => (
  <TagRow>
    <TagColumn>
      {theme && (
        <StyledThemeTag data-test="activity-theme-label" colour="default">
          {theme}
        </StyledThemeTag>
      )}
      {service && (
        <Tag data-test="activity-service-label" colour="blue">
          {service}
        </Tag>
      )}
    </TagColumn>
    <TagColumn>
      {kind && (
        <Tag data-test="activity-kind-label" colour="grey">
          {kind}
        </Tag>
      )}
    </TagColumn>
  </TagRow>
)

ActivityCardLabels.propTypes = {
  theme: PropTypes.string,
  service: PropTypes.string,
  kind: PropTypes.string,
}

export default ActivityCardLabels
