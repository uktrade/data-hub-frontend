import React from 'react'
import PropTypes from 'prop-types'
import { Details } from 'govuk-react'
import Button from '@govuk-react/button'
import { BLUE, GREY_1 } from 'govuk-colours'
import styled from 'styled-components'
import {
  MEDIA_QUERIES,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHTS,
} from '@govuk-react/constants'

import icon from './assets/search-gov.uk.svg'
import { Tag } from '../../components'
import { investments } from '../../../lib/urls'
import { STAGES } from './constants'
import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'
import InvestmentDetails from './InvestmentDetails'
import InvestmentNextSteps from './InvestmentNextSteps'

const ListItem = styled('li')`
  padding: ${SPACING.SCALE_2} 0;
  border-bottom: 2px solid ${GREY_1};
  &:last-child {
    border-bottom: none;
  }
`

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

const ListItemHeaderContainer = styled('div')`
  display: flex;
  align-items: top;
  align-content: stretch;
`

const ListItemHeader = styled('h2')`
  flex-grow: 1;
  font-size: ${FONT_SIZE.SIZE_19};
  font-weight: ${FONT_WEIGHTS.bold};
  margin: 0;
`

const ListItemHeaderTagContainer = styled('div')`
  padding: 0 ${SPACING.SCALE_4};
`

const ListItemHeaderActionContainer = styled('div')`
  flex: 0 1 152px;
  box-sizing: border-box;
  white-space: nowrap;

  a {
    width: 100%;
    margin-bottom: 0;
  }
`

const StyledDetails = styled(Details)`
  padding: 0;
  margin: 0;
  > div {
    border: none;
    padding: 0;
    margin-bottom: ${SPACING.SCALE_2};
  }
  summary {
    padding-left: ${SPACING.SCALE_5};
    &::before {
      clip-path: none;
      background: url(${icon}) 0 0 no-repeat;
      width: 30px;
      height: 30px;
      border: none;
      transform: rotate(180deg);
    }
    span {
      display: inline-block;
    }
  }
  &[open] summary::before {
    border: none;
    width: 30px;
    height: 30px;
    clip-path: none;
    background: url(${icon}) 0 0 no-repeat;
  }
`

const StyledInvestmentTimeline = styled(InvestmentTimeline)`
  display: none;
  box-sizing: border-box;

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    flex: 1 0 100%;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    flex: 1 0 348px;
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
  estimated_land_date,
  showDetails,
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
      <ListItemHeaderContainer>
        <ListItemHeader data-test="project-header">
          <a href={`${investments.projects.details(id)}`}>{name}</a>
        </ListItemHeader>
        <ListItemHeaderTagContainer>
          <Tag
            colour="grey"
            data-test="project-status-tag"
            aria-label="project status"
          >
            {stage.name}
          </Tag>
        </ListItemHeaderTagContainer>
        <ListItemHeaderActionContainer>
          <Button
            buttonColour={BLUE}
            href={investments.projects.interactions.index(id)}
            as="a"
            data-test="add-interaction"
          >
            View interactions
          </Button>
        </ListItemHeaderActionContainer>
      </ListItemHeaderContainer>
      <StyledDetails
        summary={project_code}
        open={showDetails}
        data-test="project-details"
      >
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
                nextStage={STAGES[STAGES.indexOf(stage.name) + 1]}
                projectId={id}
              />
            </Col>
          )}
        </Row>
      </StyledDetails>
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
