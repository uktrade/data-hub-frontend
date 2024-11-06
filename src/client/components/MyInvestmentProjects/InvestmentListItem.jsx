import React from 'react'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import styled from 'styled-components'
import { capitalize } from 'lodash'
import {
  MEDIA_QUERIES,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import { BLUE, MID_GREY } from '../../utils/colours'
import { investments } from '../../../lib/urls'
import { STAGE_TAG_COLOURS } from './constants'
import { INVESTMENT_PROJECT_STAGES } from '../../modules/Investments/Projects/constants'

import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'
import InvestmentDetails from './InvestmentDetails'
import InvestmentNextSteps from './InvestmentNextSteps'
import { NoHighlightToggleSection } from '../ToggleSection'
import Tag, { TAG_COLOURS } from '../Tag'

const Row = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    flex-wrap: nowrap;
  }
`
const Col = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.LARGESCREEN} {
    width: ${({ fullWidth }) =>
      fullWidth ? '100%' : `calc(50% - ${SPACING.SCALE_2})`};
    margin-bottom: 0;
  }
`

const ListItem = styled('li')({
  padding: `${SPACING.SCALE_2} 0`,
  borderBottom: `1px solid ${MID_GREY}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  display: 'grid',
  columnGap: SPACING.SCALE_2,
  rowGap: SPACING.SCALE_3,
  gridTemplateAreas: `
    "tags"
    "title"
    "details"
    "actions"
  `,
  gridTemplateColumns: '100%',

  [MEDIA_QUERIES.DESKTOP]: {
    gridTemplateColumns:
      'minmax(130px, 2fr) minmax(140px, 1fr) minmax(0, 170px)',
    gridTemplateAreas: `
      "title tags actions"
      "details details details"
    `,
  },
})

const ListItemTitle = styled('h2')({
  fontSize: FONT_SIZE.SIZE_19,
  fontWeight: FONT_WEIGHTS.bold,
  margin: 0,
  gridArea: 'title',
})

const ListItemTags = styled('div')({
  gridArea: 'tags',

  [MEDIA_QUERIES.DESKTOP]: {
    padding: `0 ${SPACING.SCALE_5}`,
    marginBottom: `-${SPACING.SCALE_6}`,
  },
})

const ListItemTagRow = styled('div')({
  display: 'inline-block',
  paddingBottom: SPACING.SCALE_4,
  marginRight: SPACING.SCALE_1,

  [MEDIA_QUERIES.DESKTOP]: {
    minWidth: '140px',
    display: 'block',
  },
})

const ListItemActions = styled('div')({
  boxSizing: 'border-box',
  gridArea: 'actions',
  a: {
    width: '100%',
    marginBottom: 0,
  },

  [MEDIA_QUERIES.DESKTOP]: {
    marginBottom: `-${SPACING.SCALE_6}`,
  },
})

const ListItemDetails = styled(NoHighlightToggleSection)({
  maxWidth: '100%',
  gridArea: 'details',
})

const StyledInvestmentTimeline = styled(InvestmentTimeline)`
  display: none;
  box-sizing: border-box;

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    flex: 1 0 100%;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    flex: 1 0 335px;
  }
`

const StyledInvestmentEstimatedLandDate = styled(InvestmentEstimatedLandDate)`
  flex: 1 1 100%;
  box-sizing: border-box;
  min-height: 93px;

  ${MEDIA_QUERIES.DESKTOP} {
    flex: 0 1 152px;
  }
`

const InvestmentListItem = ({
  id,
  name,
  stage,
  status,
  estimated_land_date,
  investor_company,
  project_code,
  sector,
  country_investment_originates_from,
  latest_interaction,
  incomplete_fields,
}) => {
  const hasStepsToComplete = !!incomplete_fields.length
  return (
    <ListItem data-test="projects-list-item">
      <ListItemTitle data-test="project-title">
        <a href={`${investments.projects.details(id)}`}>{name}</a>
      </ListItemTitle>
      <ListItemTags>
        <ListItemTagRow>
          <Tag
            colour={STAGE_TAG_COLOURS[stage.name]}
            data-test="project-stage-tag"
            aria-label="project stage"
          >
            {stage.name}
          </Tag>
        </ListItemTagRow>
        <ListItemTagRow>
          <Tag
            colour={TAG_COLOURS.GREY}
            data-test="project-status-tag"
            aria-label="project status"
          >
            {capitalize(status)}
          </Tag>
        </ListItemTagRow>
      </ListItemTags>
      <ListItemActions>
        <Button
          buttonColour={BLUE}
          href={investments.projects.interactions.index(id)}
          as="a"
          data-test="add-interaction"
        >
          View interactions
        </Button>
      </ListItemActions>
      <ListItemDetails id={id} label={project_code} data-test="project-details">
        <Row>
          <StyledInvestmentTimeline stage={stage} />
          <StyledInvestmentEstimatedLandDate
            estimatedLandDate={estimated_land_date}
          />
        </Row>
        <Row>
          <Col fullWidth={!hasStepsToComplete}>
            <InvestmentDetails
              investor={investor_company}
              sector={sector}
              countryOrigin={country_investment_originates_from}
              latestInteraction={latest_interaction}
            />
          </Col>
          {hasStepsToComplete && (
            <Col>
              <InvestmentNextSteps
                nextSteps={incomplete_fields}
                nextStage={
                  INVESTMENT_PROJECT_STAGES[
                    INVESTMENT_PROJECT_STAGES.indexOf(stage.name) + 1
                  ]
                }
                projectId={id}
              />
            </Col>
          )}
        </Row>
      </ListItemDetails>
    </ListItem>
  )
}

InvestmentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  project_code: PropTypes.string.isRequired,
  stage: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  estimated_land_date: PropTypes.string.isRequired,
  investor_company: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default InvestmentListItem
