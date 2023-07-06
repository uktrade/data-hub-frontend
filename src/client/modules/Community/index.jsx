import React from 'react'
import roadmapImg from './img-roadmap.jpg'
import feedbackImg from './img-feedback.jpg'
import principlesImg from './img-principles.jpg'
import trainingImg from './img-training.jpg'
import researchImg from './img-research.jpg'
import { DefaultLayout } from '../../components'
// import { Link } from 'govuk-react'
import { H4 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import urls from '../../../lib/urls'

const StyledImage = styled('img')`
  width: 100%;
  height: auto;
  objectfit: cover;
`

const Community = () => {
  const email = 'crmresearch@trade.gov.uk'
  const emailSubject = 'Volunteering for user research'
  const emailBody =
    'Hello, I would like to volunteer to take part in future user research around CRM.'
  return (
    <DefaultLayout
      heading={'CRM Community'}
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
    >
      <GridRow>
        <GridCol>
          <div>
            <StyledImage src={roadmapImg} alt="Roadmap" />
            <H4>Take a look at what we're working on</H4>
            <p>
              Our CRM roadmap shows what we're currently working on and the work
              that is lined up over the coming months
            </p>
          </div>
        </GridCol>
        <GridCol>
          <div>
            <StyledImage src={feedbackImg} alt="Feedback" />
            <H4>Discuss and give feedback</H4>
            <p>
              Do you have a great idea? We would love to hear it. Tell us your
              feedback or experience using our CRM tools.
            </p>
          </div>
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <div>
            <StyledImage src={principlesImg} alt="Principles" />
            <H4>Our CRM principles</H4>
            <p>
              These set the direction for future work around customer
              relationship management and help us to plan and prioritise
              upcoming development. Find out more about our CRM principles.
            </p>
          </div>
        </GridCol>

        <GridCol>
          <div>
            <StyledImage src={trainingImg} alt="Training" />
            <H4>Sign up for training</H4>
            <p>
              We offer introductions to Data Hub and Data Workspace as well as
              bootcamps to help use our analysis and visualisation tools
              effectively. View available training and sign up today!.
            </p>
          </div>
        </GridCol>
        <GridCol>
          <div>
            <StyledImage src={researchImg} alt="Research" />
            <H4>Volunteer for user research</H4>
            <p>
              We regularly run user research sessions to find out how our
              current tools are used and to test new solutions. We need your
              help, if you are interested
              <a
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
                sign up to take part in user research.
              </a>
            </p>
          </div>
        </GridCol>
      </GridRow>
    </DefaultLayout>
  )
}

export default Community
