import React from 'react'
import PropTypes from 'prop-types'
import { Details } from 'govuk-react'
import Button from '@govuk-react/button'
import { BLUE, GREY_1 } from 'govuk-colours'
import styled from 'styled-components'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'

import icon from './assets/search-gov.uk.svg'
import { Tag } from '../../components'
import { companies, investments } from '../../../lib/urls'
import InvestmentEstimatedLandDate from './InvestmentEstimatedLandDate'
import InvestmentTimeline from './InvestmentTimeline'
import InvestmentDetails from './InvestmentDetails'

const ListItem = styled('li')`
  padding: ${SPACING.SCALE_3} 0;
  border-bottom: 2px solid ${GREY_1};
  &:last-child {
    border-bottom: none;
  }
`

const Row = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};
  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    justify-content: space-between;
  }
`
const Col = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};
  ${MEDIA_QUERIES.LARGESCREEN} {
    width: calc(50% - ${SPACING.SCALE_3});
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
  margin: 0;
`

const ListItemHeaderTagContainer = styled('div')`
  padding: 0 ${SPACING.SCALE_4};
`

const ListItemHeaderActionContainer = styled('div')`
  a {
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
    transform: rotate(0);
  }
`

const StyledInvestmentTimeline = styled(InvestmentTimeline)`
  display: none;
  width: 80%;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
  }
`

const StyledInvestmentEstimatedLandDate = styled(InvestmentEstimatedLandDate)`
  width: 20%;
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
}) => {
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
            href={companies.interactions.create(investor_company.id)}
            as="a"
            data-test="add-interaction"
          >
            Add interaction
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
          <Col>
            <InvestmentDetails
              investor={investor_company}
              sector={sector}
              countryOrigin={country_investment_originates_from}
              latestInteraction={latest_interaction}
            />
          </Col>
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
