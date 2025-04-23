import React from 'react'
import { UnorderedList, ListItem, H2 } from 'govuk-react'

import Layout from './Layout'
import AccessibleLink from '../../../components/Link'

const WCAGLink = () => (
  <AccessibleLink target="_blank" href="https://www.w3.org/TR/WCAG22/">
    Web Content Accessibility Guidelines (WCAG) 2.2
  </AccessibleLink>
)

const DBTMailtoLink = () => (
  <AccessibleLink href="mailto:digital@businessandtrade.gov.uk?subject=Export Wins accessibility question">
    digital@businessandtrade.gov.uk.
  </AccessibleLink>
)

const AccesibilityStatement = () => (
  <Layout title="Accessibility statement for Export Wins">
    <H2>The purpose of this document</H2>
    <p>
      This website is run by the Department for Business and Trade (DBT). Export
      Wins is where DBT staff can track export wins and DBT clients can approve
      or reject their wins.
    </p>
    <p>
      DBT regularly tests its online services to ensure they meet accessibility
      requirements. Our internal development teams test frequently and we also
      undertake regular accessibility audits conducted by external agencies. We
      want our whole website to comply with <WCAGLink /> AA as a minimum.
    </p>
    <p>
      We want as many people as possible to be able to use this website. For
      example, that means you should be able to:
    </p>
    <UnorderedList>
      <ListItem>change colours, contrast levels and fonts</ListItem>
      <ListItem>
        zoom in up to 400% without the text spilling off the screen
      </ListItem>
      <ListItem>navigate most of the website using just a keyboard</ListItem>
      <ListItem>
        navigate most of the website using speech recognition software
      </ListItem>
      <ListItem>listen to most of the website using a screen reader</ListItem>
    </UnorderedList>
    <p>The site will:</p>
    <UnorderedList>
      <ListItem>respond to different screen sizes or zoom levels</ListItem>
      <ListItem>use words that are clear and simple to understand </ListItem>
    </UnorderedList>
    <p>
      <AccessibleLink target="_blank" href="https://mcmw.abilitynet.org.uk/">
        AbilityNet
      </AccessibleLink>{' '}
      has advice on making your device easier to use if you have a disability.
    </p>
    <H2>How accessible this website is</H2>
    <p>
      We are constantly improving the content and performance of our website to
      make sure it can best support DBT employees and their clients to capture
      export wins.
    </p>
    <H2>Feedback and contact information</H2>
    <p>
      If you find any problems not listed on this page or think we’re not
      meeting accessibility requirements, email <DBTMailtoLink />
    </p>
    <H2>Reporting accessibility problems with this website</H2>
    <p>
      We’re always looking to improve the accessibility of this website. If you
      find any problems not listed on this page or think we’re not meeting
      accessibility requirements, email <DBTMailtoLink />
    </p>
    <H2>Enforcement procedure</H2>
    <p>
      The Equality and Human Rights Commission (EHRC) is responsible for
      enforcing the Public Sector Bodies (Websites and Mobile Applications) (No.
      2) Accessibility Regulations 2018 (the ‘accessibility regulations’). If
      you’re not happy with how we respond to your complaint, contact the
      Equality Advisory and Support Service (EASS).
    </p>
    <H2>Technical information about this website’s accessibility</H2>
    <p>
      The Department for Business and Trade is committed to making its websites
      accessible, in accordance with the Public Sector Bodies (Websites and
      Mobile Applications) (No. 2) Accessibility Regulations 2018.
    </p>
    <p>
      This website is compliant with the <WCAGLink /> AA standard.
    </p>
  </Layout>
)

export default AccesibilityStatement
