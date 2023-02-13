import React from 'react'
import Tag from '../../../Tag'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { SPACING } from '@govuk-react/constants'

const TagRow = styled('div')`
  display: block;
  justify-content: space-between;
  padding-bottom: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_1};
`

const TagColumn = styled('div')`
  display: block;
`

const StyledThemeTag = styled(Tag)`
  margin-right: ${SPACING.SCALE_1};
  margin-bottom: ${SPACING.SCALE_1};
`

const StyledThemeTagGreyLabel = styled(Tag)`
  margin-right: ${SPACING.SCALE_1};
  margin-bottom: ${SPACING.SCALE_1};
  float: right;
`

const TagRowFlex = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_1};
`

const TagColumnFlex = styled('div')`
  display: flex;
`

const StyledThemeTagFlex = styled(Tag)`
  margin-right: ${SPACING.SCALE_1};
`

const ActivityCardLabelsInLine = ({
  isExternalActivity,
  theme,
  service,
  kind,
}) => (
  <TagRowFlex>
    <TagColumnFlex>
      {theme && (
        <StyledThemeTagFlex
          data-test="activity-theme-label"
          colour={isExternalActivity ? 'darkGreen' : 'default'}
        >
          {theme}
        </StyledThemeTagFlex>
      )}
      {service && (
        <Tag
          data-test="activity-service-label"
          colour={isExternalActivity ? 'turquoise' : 'blue'}
        >
          {service}
        </Tag>
      )}
    </TagColumnFlex>
    {kind && (
      <TagColumnFlex>
        <Tag data-test="activity-kind-label" colour="grey">
          {kind}
        </Tag>
      </TagColumnFlex>
    )}
  </TagRowFlex>
)

const ActivityCardLabelsStack = ({
  isExternalActivity,
  theme,
  service,
  kind,
}) => (
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
      {kind && (
        <StyledThemeTagGreyLabel data-test="activity-kind-label" colour="grey">
          {kind}
        </StyledThemeTagGreyLabel>
      )}
    </TagColumn>
    <TagColumn>
      {service && (
        <Tag
          data-test="activity-service-label"
          colour={isExternalActivity ? 'turquoise' : 'blue'}
        >
          {service}
        </Tag>
      )}
    </TagColumn>
  </TagRow>
)
function isOverflow(theme, service, kind) {
  return theme?.length + service?.length + kind?.length > 50
}
const ActivityCardLabels = ({ isExternalActivity, theme, service, kind }) =>
  isOverflow(theme, service, kind) ? (
    <ActivityCardLabelsStack
      isExternalActivity={isExternalActivity}
      theme={theme}
      service={service}
      kind={kind}
    />
  ) : (
    <ActivityCardLabelsInLine
      isExternalActivity={isExternalActivity}
      theme={theme}
      service={service}
      kind={kind}
    />
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
