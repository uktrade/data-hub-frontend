import React from 'react'
import { H2 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import { DefaultLayout, NewWindowLink } from '../../components'
import urls from '../../../lib/urls'

import roadmapImg from './img-roadmap.jpg'
import feedbackImg from './img-feedback.jpg'
import principlesImg from './img-principles.jpg'
import trainingImg from './img-training.jpg'
import researchImg from './img-research.jpg'

const StyledHeading = styled(H2)`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px;
  margin-top: 2px;
  margin-bottom: 10px;
`
const StyledImage = styled('img')`
  width: 100%;
  height: 278.459px;
  flex-shrink: 0;
`

const SmallStyledImage = styled('img')`
  width: 100%;
  height: 179.651px;
  flex-shrink: 0;
`
const StyledParagraph = styled('p')`
  font-size: 16px;
  line-height: 26px;
  font-weight: 400;
  padding-bottom: 20px;
`
const EMAIL = 'crm.research@businessandtrade.gov.uk'
const EMAIL_SUBJECT = 'Volunteering for user research'
const EMAIL_BODY =
  'Hello, I would like to volunteer to take part in future user research around CRM.'

const Community = () => {
  return (
    <DefaultLayout
      heading={'CRM community'}
      pageTitle={'Community'}
      subheading={
        'Find out about upcoming improvements to CRM and to help shape its future development.'
      }
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          text: 'CRM Community',
        },
      ]}
      useReactRouter={false}
    >
      <GridRow>
        <GridCol setWidth="one-half">
          <div data-test="community-roadmap">
            <StyledImage src={roadmapImg} alt="Roadmap" />
            <StyledHeading data-test="community-roadmap-header">
              Take a look at what we&apos;re working on
            </StyledHeading>
            <StyledParagraph data-test="community-roadmap-paragraph">
              Our{' '}
              <NewWindowLink href={urls.external.helpCentre.community.roadmap}>
                CRM roadmap
              </NewWindowLink>{' '}
              shows what we&apos;re currently working on and the work that is
              lined up over the coming months.
            </StyledParagraph>
          </div>
        </GridCol>
        <GridCol setWidth="one-half">
          <div data-test="community-feedback">
            <StyledImage src={feedbackImg} alt="Feedback" />
            <StyledHeading data-test="community-feedback-header">
              Discuss and give feedback
            </StyledHeading>
            <StyledParagraph>
              Do you have a great idea? We would love to hear it. Tell us your{' '}
              <Link href={urls.external.helpCentre.community.feedback}>
                feedback or experience
              </Link>{' '}
              using our CRM tools.
            </StyledParagraph>
          </div>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol setWidth="one-third">
          <div data-test="community-principles">
            <SmallStyledImage src={principlesImg} alt="Principles" />
            <StyledHeading data-test="community-principles-header">
              Our CRM principles
            </StyledHeading>
            <StyledParagraph>
              These set the direction for future work around customer
              relationship management and help us to plan and prioritise
              upcoming development.{' '}
              <NewWindowLink
                href={urls.external.helpCentre.community.principles}
              >
                Find out more about our CRM principles
              </NewWindowLink>
              {'.'}
            </StyledParagraph>
          </div>
        </GridCol>

        <GridCol setWidth="one-third">
          <div data-test="community-training">
            <SmallStyledImage src={trainingImg} alt="Training" />
            <StyledHeading data-test="community-training-header">
              Sign up for training
            </StyledHeading>
            <StyledParagraph>
              We offer introductions to Data Hub and Data Workspace as well as
              bootcamps to help use our analysis and visualisation tools
              effectively.{' '}
              <NewWindowLink href={urls.external.helpCentre.community.training}>
                View available training
              </NewWindowLink>{' '}
              and sign up today!
            </StyledParagraph>
          </div>
        </GridCol>

        <GridCol setWidth="one-third">
          <div data-test="community-research">
            <SmallStyledImage src={researchImg} alt="Research" />
            <StyledHeading>Volunteer for user research</StyledHeading>
            <StyledParagraph>
              We regularly run user research sessions to find out how our
              current tools are used and to test new solutions. We need your
              help, if you are interested{' '}
              <Link
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(
                  EMAIL_SUBJECT
                )}&body=${encodeURIComponent(EMAIL_BODY)}`}
              >
                sign up to take part in user research
              </Link>
              .
            </StyledParagraph>
          </div>
        </GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

export default Community
