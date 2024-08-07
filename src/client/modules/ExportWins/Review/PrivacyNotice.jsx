import React from 'react'
import {
  H2,
  GridCol,
  GridRow,
  Link,
  ListItem,
  UnorderedList,
  Table,
} from 'govuk-react'

import Layout from './Layout'
import { FORM_LAYOUT } from '../../../../common/constants'

const MainPrivacyNotice = () => (
  <Link href="https://www.great.gov.uk/privacy-and-cookies/">
    main privacy notice
  </Link>
)

const DataProtectionMailtolink = () => (
  <Link href="mailto:data.protection@businessandtrade.gov.uk?subject=DBT data protection question">
    data.protection@businessandtrade.gov.uk
  </Link>
)

const InformationCommissionerOffice = () => (
  <Link href="https://ico.org.uk/">
    Information Commissioner's Office (ICO)
  </Link>
)

const PrivacyNotice = () => (
  <Layout title="Privacy Notice">
    <H2>The purpose of this document</H2>
    <p>
      This privacy notice explains how the Department for Business and Trade
      (DBT), as a 'data controller', processes personal data for the Export Wins
      service. This service records information on export deals that the
      department has supported.
    </p>
    <p>
      This notice is supplemented by our 
      <MainPrivacyNotice /> which provides further information on how DBT
      processes personal data, and sets out your rights in respect of that
      personal data.
    </p>
    <H2>Personal data DBT collects</H2>
    <p>DBT collects information about:</p>
    <UnorderedList>
      <ListItem>
        Clients that DBT supports through its export promotion services and
        their exporting outcomes
      </ListItem>
    </UnorderedList>
    <p>DBT collects the following categories of personal data:</p>
    <UnorderedList>
      <ListItem>Company name</ListItem>
      <ListItem>Company contact name</ListItem>
      <ListItem>Company contact job title</ListItem>
      <ListItem>Company contact email address</ListItem>
    </UnorderedList>
    <H2>
      Why DBT asks for this information and what happens if it is not provided
    </H2>
    <p>DBT collects this information in order to:</p>
    <UnorderedList>
      <ListItem>
        To inform of successful export and ODI deals the department has
        supported
      </ListItem>
      <ListItem>To record export wins by companies</ListItem>
      <ListItem>To manage the performance of DBT</ListItem>
      <ListItem>
        To identify and secure international and UK based opportunities
      </ListItem>
      <ListItem>To evaluate the impact of trade and investment</ListItem>
      <ListItem>
        To better understand the trade and investment environment
      </ListItem>
      <ListItem>
        To better understand the domestic and international business landscape
      </ListItem>
      <ListItem>
        To design effective and intelligent trade and investment policy,
        services and make business decisions
      </ListItem>
      <ListItem>
        To support the promotion and marketing activity of DBT (where the client
        has agreed to this use)
      </ListItem>
    </UnorderedList>
    <p>
      Without access to this data DBT would be limited in its ability to assess
      and enhance its export promotion services.
    </p>
    <H2>The legal basis for processing your personal data</H2>

    <p>
      The table below sets out the primary legal bases we rely on for processing
      the personal data we collect about you.
    </p>
    <p>
      In some instances we may process your data further for a compatible
      purpose and/or on other legal bases. For example, your data may be used
      for archiving, research and/or statistical purposes. These are compatible
      purposes for further processing in UK GDPR and your data will be subject
      to appropriate safeguards if used for such purposes.
    </p>
    <H2>Legal basis for processing</H2>
    <GridRow>
      <GridCol>
        <Table>
          <Table.Row>
            <Table.CellHeader setWidth={FORM_LAYOUT.ONE_HALF}>
              Personal Data (Article 6(1) UK GDPR)
            </Table.CellHeader>
            <Table.CellHeader setWidth={FORM_LAYOUT.ONE_HALF}>
              Special Category Data / Criminal Conviction Data
            </Table.CellHeader>
          </Table.Row>
          <Table.Row>
            <Table.Cell setWidth={FORM_LAYOUT.ONE_HALF}>
              Processing is necessary for the performance of a task carried out
              in the public interest or in the exercise of official authority
              vested in the controller;
            </Table.Cell>
            <Table.Cell setWidth={FORM_LAYOUT.ONE_HALF} />
          </Table.Row>
        </Table>
      </GridCol>
    </GridRow>
    <H2>How DBT processes personal data it receives</H2>
    <p>Once received your data will be:</p>
    <UnorderedList>
      <ListItem>Stored on DBT’s internal CRM system</ListItem>
      <ListItem>Analysed to fulfil the functions described above</ListItem>
    </UnorderedList>
    <H2>Third Party Processors</H2>
    <UnorderedList>
      <ListItem>Investment Support Service (ISSs)</ListItem>
      <ListItem>Ernst & Young</ListItem>
    </UnorderedList>
    <p>
      We have a contract with these third parties which means that they are
      required to meet appropriate security standards and which also means that
      they cannot use your data without instruction from DBT.
    </p>
    <H2>Information sharing</H2>
    <p>We may share personal data you provide:</p>
    <UnorderedList>
      <ListItem>
        With other government departments, public authorities, law enforcement
        agencies and regulators
      </ListItem>

      <ListItem>
        With other third parties where we consider it necessary in order to
        further our functions as a government department
      </ListItem>

      <ListItem>
        In response to information requests, for example, under Freedom of
        Information (FOI) law or the Environmental Information Regulations (EIR)
      </ListItem>

      <ListItem>
        To a court, tribunal or party where the disclosure is necessary in order
        to exercise, establish or defend a legal claim
      </ListItem>

      <ListItem>
        Where we are ordered to do so or where we are otherwise required to do
        so by law
      </ListItem>

      <ListItem>
        With third party data processors as governed by contract
      </ListItem>
    </UnorderedList>
    <p>
      You can find out more detailed information about how we share data and
      further processing in the <MainPrivacyNotice />.
    </p>
    <H2>How long will DBT hold your data for</H2>
    <p>
      DBT will only retain your personal data for as long as necessary to fulfil
      the purposes we collected it for, including for the purposes of satisfying
      any legal, accounting, or reporting requirements. We will only retain your
      data for as long as it is required to fulfil the purpose for which we
      collected it. With respect to the processing outlined in this privacy
      notice, this means we will keep your data for 10 years.
    </p>
    <p>
      If we decide that we need to process your personal data for a reason which
      is incompatible with the purposes for which we collected it for, we will
      contact you to explain why we are doing this and why it is lawful to do
      so.
    </p>
    <p>
      To determine the appropriate retention period for personal data, we
      consider the amount, nature, and sensitivity of the personal data, the
      potential risk of harm from unauthorised use or disclosure of your
      personal data, the purposes for which we process your personal data and
      whether we can achieve those purposes through other means, and the
      applicable legal requirements.
    </p>
    <H2>Your rights</H2>
    <p>
      You have a number of rights available to you under UK data protection
      legislation, including:
    </p>
    <UnorderedList>
      <ListItem>
        the right to request copies of the personal data we hold about you
      </ListItem>

      <ListItem>
        the right to request that we rectify information about you which you
        think is inaccurate or incomplete
      </ListItem>

      <ListItem>
        the right to request that we restrict your data from further processing
        (in certain circumstances)
      </ListItem>

      <ListItem>
        the right to object to the processing of your data (in certain
        circumstances)
      </ListItem>

      <ListItem>
        the right to data portability (in certain circumstances)
      </ListItem>

      <ListItem>
        the right to request that we erasure your data (in certain
        circumstances)
      </ListItem>

      <ListItem>
        the right not to be subject to a decision based on solely automated data
        processing
      </ListItem>
    </UnorderedList>
    <p>
      You can contact DBT’s Data Protection Officer for further information
      about how your data has been processed by the department or to make a
      complaint about how your data has been used. Please contact:{' '}
      <DataProtectionMailtolink />
    </p>
    <p>
      You can also submit a complaint to the Information Commissioner’s Office
      (ICO) at:
    </p>
    <p>Information Commissioner's Office</p>
    <p>Wycliffe House</p>
    <p>Water Lane</p>
    <p>Wilmslow</p>
    <p>Cheshire</p>
    <p>SK9 5AF</p>
    <p>
      Web: <InformationCommissionerOffice />
    </p>
    <p>Tel: 0303 123 1113</p>
    <p>
      You can find out more about your rights as a data subject, and details of
      how to contact our Data Protection Officer and the ICO in our{' '}
      <MainPrivacyNotice />.
    </p>
  </Layout>
)

export default PrivacyNotice
