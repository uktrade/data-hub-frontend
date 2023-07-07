import React from 'react'
import roadmapImg from './img-roadmap.jpg'
import feedbackImg from './img-feedback.jpg'
import principlesImg from './img-principles.jpg'
import trainingImg from './img-training.jpg'
import researchImg from './img-research.jpg'
import { DefaultLayout } from '../../components'
import { Link } from 'govuk-react'
import { H4 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import urls from '../../../lib/urls'

const StyledHeading = styled(H4)`
  font-size: 19px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px;
`
const StyledImage = styled('img')`
  width: 100%;
  height: auto;
  objectfit: cover;
`
const StyledParagraph = styled('p')`
  font-size: 16px;
  line-height: 26px;
  font-weight: 400;
`

const Community = () => {
  const email = 'crmresearch@trade.gov.uk'
  const emailSubject = 'Volunteering for user research'
  const emailBody =
    'Hello, I would like to volunteer to take part in future user research around CRM.'
  return (
    <DefaultLayout
      heading={'CRM community'}
      pageTitle={'Community'}
      subheading={
        'Find out about upcoming improvements to CRM and to help shape its future development.'
      }
      breadcrumbs={[
        {
          link: urls.dashboard(),
          text: 'Home',
        },
        {
          text: 'CRM Community',
        },
      ]}
      useReactRouter={false}
      // data-test="community-page"
    >
      <GridRow>
        <GridCol>
          <div data-test="community-roadmap">
            <StyledImage src={roadmapImg} alt="Roadmap" />
            <StyledHeading data-test="community-roadmap-header">
              Take a look at what we're working on
            </StyledHeading>
            <StyledParagraph>
              Our{' '}
              <Link href={urls.external.community.roadmap()}>CRM roadmap</Link>{' '}
              shows what we're currently working on and the work that is lined
              up over the coming months
            </StyledParagraph>
          </div>
        </GridCol>
        <GridCol>
          <div data-test="community-feedback">
            <StyledImage src={feedbackImg} alt="Feedback" />
            <StyledHeading data-test="community-feedback-header">
              Discuss and give feedback
            </StyledHeading>
            <StyledParagraph>
              Do you have a great idea? We would love to hear it. Tell us your{' '}
              <Link href={urls.external.community.feedback()}>
                feedback or experience
              </Link>{' '}
              using our CRM tools.
            </StyledParagraph>
          </div>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <div data-test="community-principles">
            <StyledImage src={principlesImg} alt="Principles" />
            <StyledHeading data-test="community-principles-header">
              Our CRM principles
            </StyledHeading>
            <StyledParagraph>
              These set the direction for future work around customer
              relationship management and help us to plan and prioritise
              upcoming development.{' '}
              <Link href={urls.external.community.principles()}>
                Find out more about our CRM principles.
              </Link>
            </StyledParagraph>
          </div>
        </GridCol>

        <GridCol>
          <div data-test="community-training">
            <StyledImage src={trainingImg} alt="Training" />
            <StyledHeading data-test="community-training-header">
              Sign up for training
            </StyledHeading>
            <StyledParagraph>
              We offer introductions to Data Hub and Data Workspace as well as
              bootcamps to help use our analysis and visualisation tools
              effectively.{' '}
              <Link href={urls.external.community.training()}>
                View available training
              </Link>{' '}
              and sign up today!.
            </StyledParagraph>
          </div>
        </GridCol>
        <GridCol>
          <div data-test="community-research">
            <StyledImage src={researchImg} alt="Research" />
            <StyledHeading>Volunteer for user research</StyledHeading>
            <StyledParagraph>
              We regularly run user research sessions to find out how our
              current tools are used and to test new solutions. We need your
              help, if you are interested
              <Link
                href={
                  'mailto:' +
                  email +
                  '?subject=' +
                  emailSubject +
                  '&body=' +
                  emailBody
                }
              >
                {' '}
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
