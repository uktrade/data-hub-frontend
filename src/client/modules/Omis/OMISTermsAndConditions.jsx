import React from 'react'
import styled from 'styled-components'
import { ListItem, OrderedList } from 'govuk-react'

import { NewWindowLink, SummaryTable } from '../../components'
import urls from '../../../lib/urls'
import AccessibleLink from '../../components/Link'

const StyledListItem = styled(ListItem)`
  margin-top: 16px;
`

const HAS_MEANING_GIVEN_IN_QUOTE = 'has the meaning given to it in the Quote'

const OMISTermsAndConditions = () => (
  <>
    <strong>ANNEX 1</strong>
    <br />
    <br />
    <strong>
      TERMS & CONDITIONS FOR DELIVERY OF DEPARTMENT FOR BUSINESS AND TRADE
      OVERSEAS MARKET INTRODUCTION SERVICE
    </strong>
    <br />
    <br />
    <OrderedList>
      <ListItem>
        <strong>1. INTERPRETATION</strong>
      </ListItem>
      <OrderedList>
        <ListItem>
          1.1. In this Contract the following terms shall have the meaning given
          to them below:
          <SummaryTable>
            <SummaryTable.Row
              heading='"Contract"'
              children="means the Quote and these Terms and Conditions"
            />
            <SummaryTable.Row
              heading='"Charges"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"Customer"'
              children="the company or other legal entity to whom the Quote is addressed"
            />
            <SummaryTable.Row
              heading='"Customer Contact"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"Delivery Date"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"DBT"'
              children='the Department for Business and Trade ("DBT"), of Old Admiralty Building, Admiralty Place, London, SW1A 2DY'
            />
            <SummaryTable.Row
              heading='"DBT Contact"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"Force Majeure Event"'
              children="has the meaning given to it in Clause 19"
            />
            <SummaryTable.Row
              heading='"Parties"'
              children="the parties to this Contract being the Secretary of State for DBT and the Customer"
            />
            <SummaryTable.Row
              heading='"OMIS"'
              children="the overseas market introduction services provided by DBT"
            />
            <SummaryTable.Row
              heading='"Quote"'
              children="the terms of DBT's proposal set out in the document to which these Terms and Conditions are annexed"
            />
            <SummaryTable.Row
              heading='"Payment Date"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"Services"'
              children={HAS_MEANING_GIVEN_IN_QUOTE}
            />
            <SummaryTable.Row
              heading='"Terms and Conditions"'
              children="means these terms and conditions as amended from time to time"
            />
            <SummaryTable.Row heading='"Website"'>
              <p>
                means the website based on the{' '}
                <NewWindowLink href={urls.external.omis}>
                  omis.trade.gov.uk
                </NewWindowLink>{' '}
                domain, to which you were directed by an email from DBT, and on
                which the Quote was first presented to you
              </p>
            </SummaryTable.Row>
          </SummaryTable>
        </ListItem>
      </OrderedList>
      <ListItem>
        <strong>2. THE CONTRACT</strong>
      </ListItem>
      <OrderedList>
        <StyledListItem>
          2.1. The Quote, together with these Terms and Conditions, contains our
          offer to provide the Services. The offer contained in the Quote and
          the Terms and Conditions shall be deemed to be accepted by you on your
          acceptance of the Quote and a Contract formed.
        </StyledListItem>
        <StyledListItem>
          2.2 This Contract is between yourselves and the Secretary of State for
          DBT. In these Terms and Conditions the expressions 'we', 'us' and
          'our' refer to the Secretary of State for DBT and those acting on his
          behalf. The expressions 'you' and 'your' refer to you, the Customer.
        </StyledListItem>
        <StyledListItem>
          2.3. Where appropriate we may choose to provide the Services through a
          team based in the commercial sections of a British Embassy, Consulate
          or High Commission or the auspices of Scottish Development
          International, the Welsh Government or Invest Northern Ireland.
        </StyledListItem>
        <StyledListItem>
          2.4. We will indicate who will be primarily responsible for delivering
          the Services in the DBT Contact section of the Quote, but we reserve
          the right to change the DBT Contact and/or any other member of DBT
          personnel involved in the provision of the services at any time.
        </StyledListItem>
        <StyledListItem>
          2.5. References to "Clauses" are, unless otherwise provided,
          references to the clauses of these Terms and Conditions.
        </StyledListItem>
        <StyledListItem>
          2.6. For the avoidance of doubt any reference to "in writing" in this
          Contract shall include email.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>3. SERVICES</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          3.1. We will provide you with the Services using reasonable care and
          skill.
        </StyledListItem>
        <StyledListItem>
          3.2. We will deliver the Services to you on or before the Delivery
          Date. If it becomes necessary to change the Delivery Date we will
          notify you in writing and a new date will be agreed between the
          Parties.
        </StyledListItem>
        <StyledListItem>
          3.3. Unless otherwise agreed in writing, we will not supply the
          Services until we have received payment of the Charges in full. You
          agree that we may extend the Delivery Dates to reflect any delay in
          our receiving payment from you.
        </StyledListItem>
        <StyledListItem>
          3.4. Any amendments to the Services or Charges must be agreed by the
          Parties in writing.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>4. CHARGES</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          4.1. You agree to pay the Charges to us for the provision of the
          Services.
        </StyledListItem>
        <StyledListItem>
          4.2. The Charges are exclusive of value added tax which will be
          payable by you at the prevailing rate, where applicable.
        </StyledListItem>
        <StyledListItem>
          4.3. You agree to pay the Charges in full on or before the Payment
          Date or such other date as has been agreed by the Parties in writing.
        </StyledListItem>
        <StyledListItem>
          4.4. Payment of the Charges will be made by one of the following
          methods:
        </StyledListItem>
        <OrderedList>
          <StyledListItem>
            <strong>Credit or Debit Card</strong>
          </StyledListItem>
          <StyledListItem>
            4.4.1. You can make payment online by following the relevant link on
            the Website.
          </StyledListItem>
          <StyledListItem>
            <strong>Bank Transfer</strong>
          </StyledListItem>
          <StyledListItem>
            4.4.2. Payment by bank transfer must be made in sterling for the
            full amount stated on the invoice to DBT's bank account at National
            Westminster Bank - Account Name: DBT OMIS Service Account Number:
            10014187 Sort Code: 60-70-80. SWIFT Address: NWBKGB2L and IBAN:
            GB57NWBK60708010014187.
          </StyledListItem>
          <StyledListItem>
            4.4.3. You agree to pay any bank charges incurred with this
            transaction. You must quote the invoice number shown on the relevant
            invoice when arranging the payment and must send a copy of the
            payment remittance advice which must show the payment reference to
            your DBT Contact.
          </StyledListItem>
          <StyledListItem>
            4.5. A VAT invoice will be available on the Website after your
            payment has been received (and cleared if necessary). The VAT
            receipt can be printed from the relevant page.
          </StyledListItem>
        </OrderedList>
      </OrderedList>
      <StyledListItem>
        <strong>5. NON-PAYMENT</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          5.1. If we have not received full payment of the Charges by the
          Payment Date (or such other date as has been agreed in writing), we
          will begin action to recover the non-payment from you. We may, at our
          absolute discretion, withdraw your access to all DBT services (not
          limited to OMIS) until payment is received in full, including any
          interest to which DBT is entitled in respect of late payments under
          Clause 5.2.
        </StyledListItem>
        <StyledListItem>
          5.2. If you fail to pay any undisputed Charges properly invoiced we
          will have the right to charge interest on the overdue amount at the
          applicable rate under the Late Payment of Commercial Debts (Interest)
          Act 1998, accruing on a daily basis from the due date up to the date
          of actual payment, whether before or after judgment.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>6. CORRESPONDENCE</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          6.1. Your Quote has a unique reference number which should always be
          quoted in correspondence.
        </StyledListItem>
        <StyledListItem>
          6.2. We will address all correspondence and any notices issued under
          this Contract to the Customer Contact and you should address the same
          to the DBT Contact.
        </StyledListItem>
        <StyledListItem>
          6.3. You will inform us immediately of any changes to the Customer
          Contact and we will inform you of any changes to the DBT Contact.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>7. YOUR RIGHT TO CANCEL</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          7.1. You may cancel the Services without incurring any liability by
          notifying us in writing at any time before you accept the Quote.
          Written notice of cancellation should be sent to the DBT Contact.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>8. CROWN COPYRIGHT</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          8.1. Any material that we produce for you in the course of delivering
          the Services will be Crown Copyright.
        </StyledListItem>
        <StyledListItem>
          8.2. Under the terms of the open government licence (and subject to
          Clause 8.4 below) you may use and reuse the Crown copyright material
          free of charge and in any format or medium. Excluded from this
          permission are the HM Government, Department for Business and Trade,
          DBT and "exporting is GREAT", names, logos and "get-up" (including our
          coat of arms) and all images and case studies that appear on the
          Website or any other DBT website. This means you must not reproduce
          them without our prior written approval.
        </StyledListItem>
        <StyledListItem>
          8.3. If you have a question about the use of our intellectual property
          and Crown copyright, email the DBT brand team at{' '}
          <AccessibleLink href="mailto:brand@trade.gsi.gov.uk">
            brand@trade.gsi.gov.uk
          </AccessibleLink>
          , with your contact details detailing how and why you wish to use the
          name or logo(s).
        </StyledListItem>
        <StyledListItem>
          8.4. If you do re-use any Crown Copyright material you must
          acknowledge the source with the following attribution:
          <OrderedList>
            <StyledListItem>
              8.4.1. "This information is provided by the Department for
              Business and Trade and used as permitted by the Open Government
              Licence v3.0"
            </StyledListItem>
          </OrderedList>
        </StyledListItem>
        <StyledListItem>
          8.5. For more information, please follow{' '}
          <NewWindowLink
            href={urls.external.nationalArchives.openGovLicence}
            aria-label="this link to the National Archives website"
          >
            this link
          </NewWindowLink>
          .
        </StyledListItem>
        <StyledListItem>
          8.6. Enquiries about use and re-use of Crown copyright material should
          be sent to{' '}
          <AccessibleLink href="mailto:psi@nationalarchives.gsi.gov.uk">
            psi@nationalarchives.gsi.gov.uk
          </AccessibleLink>
          .
        </StyledListItem>
        <StyledListItem>
          8.7. The ability for you to reproduce Crown copyright material in
          accordance with the instructions in this Clause does not extend to any
          material provided that is the copyright of a third party.
          Authorisation to reproduce such material has to be obtained by you
          from the copyright holder concerned.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>9. PRIVACY AND DATA PROTECTION POLICY</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          9.1. By accepting these Terms and Conditions you agree that we may
          collect your personal data in accordance with{' '}
          <NewWindowLink href={urls.external.great.privacyPolicy}>
            our privacy and cookies policy
          </NewWindowLink>
          .
        </StyledListItem>
        <StyledListItem>
          9.2. We will not share your information with any other organisations
          for marketing, market research or commercial purposes.
        </StyledListItem>
        <StyledListItem>
          9.3. We may pass on your personal information to third parties,
          including other government departments, where we have a legal
          obligation to do so.
        </StyledListItem>
        <StyledListItem>
          9.4. We will process any personal data you provide to us in accordance
          with the Data Protection Act 1998 and will also comply with the
          Privacy and Electronic Communications (EC Directive) Regulations 2003
          ("Data Protection Legislation"). Under Data Protection Legislation, we
          have a legal duty to protect any information we collect from you. We
          use leading technologies and encryption software to safeguard your
          data, and keep strict security standards to prevent any authorised
          access to or disclosure of it.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>10. CONFIDENTIALITY</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          10.1. Material provided by you to DBT or to its representatives and
          designated in writing by you as confidential will be used solely for
          the purpose for which it is provided and subject to Clause 10.2 shall
          not be disclosed to any person without your prior written consent.
        </StyledListItem>
        <StyledListItem>
          10.2. Notwithstanding Clause 10.1, we may disclose your confidential
          information:
          <OrderedList>
            <StyledListItem>
              10.2.1. where disclosure is required by applicable law (including
              the Freedom of Information Act 2000) or by a court of competent
              jurisdiction;
            </StyledListItem>
            <StyledListItem>
              10.2.2. on a confidential basis to our employees, agents,
              consultants, contractors and professional advisors to the extent
              necessary to perform our obligations under this Contract;
            </StyledListItem>
            <StyledListItem>
              10.2.3. on a confidential basis to the Scottish Development
              International, the Welsh Assembly, Invest Northern Ireland or any
              central government body; or
            </StyledListItem>
            <StyledListItem>
              10.2.4. to the extent that DBT (acting reasonably) deems
              disclosure necessary or appropriate in the course of carrying out
              its public functions.
            </StyledListItem>
          </OrderedList>
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>11. FREEDOM OF INFORMATION</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          11.1. You accept that any information held by us is subject to the
          provisions of the Freedom of Information Act 2000 and the
          Environmental Information Regulations 2004 which may require the
          release of such information by us. The release of information will be
          at our discretion and we may not always be able to consult with you
          before releasing information.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>12. VIRUS PROTECTION</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          12.1. We will make every effort to check and test the material we make
          available for you to access or download whilst we are providing you
          with the Services. You acknowledge and agree that you will run an
          appropriate anti-virus programme on all materials downloaded from the
          internet, including from the Website. We cannot accept responsibility
          for any loss, disruption or damage to your data or your computer
          system which may occur as a result of using material derived from the
          Website or sent to you by us electronically.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>13. COMPLAINTS AND REFUNDS</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          13.1. If you wish to lodge a complaint or believe that a refund of any
          Charges is due you must contact the DBT Contact in the first instance
          and they will consider the request.
        </StyledListItem>
        <StyledListItem>
          13.2. Refunds will be considered by DBT when you have paid for
          Services in advance of delivery and the Services are not subsequently
          delivered by us. Refunds are made at the discretion of DBT.
        </StyledListItem>
        <StyledListItem>
          13.3. A request for a refund must be submitted within three months of
          the delivery of the relevant part of the Services and in any event
          within three months of the delivery of all the Services set out in the
          Quote or otherwise agreed between the Parties in writing.
        </StyledListItem>
        <StyledListItem>
          13.4. If after discussing your case with your DBT Contract you are
          still dissatisfied with the service received, you can use our online
          feedback form on the DBT page at{' '}
          <NewWindowLink href={urls.external.govUkHomepage}>
            gov.uk
          </NewWindowLink>
          .
        </StyledListItem>
        <StyledListItem>
          13.5. Payment of refunds of Charges paid by credit or debit card will
          be made direct to your card. All non-card payments of Charges will be
          refunded by BACS and we will contact you to obtain the information we
          will need to effect the necessary transfer.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>14. TERM AND TERMINATION</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          14.1. The Contract will start on the date you accept the Quote and
          expire on the later of the date when:
          <OrderedList>
            <StyledListItem>
              14.1.1. all Services have been delivered; and
            </StyledListItem>
            <StyledListItem>14.1.2. all Charges paid in full.</StyledListItem>
          </OrderedList>
        </StyledListItem>
        <StyledListItem>
          14.2. Either Party may terminate the Contract by giving the other
          Party 14 days' written notice.
        </StyledListItem>
        <StyledListItem>
          14.3. You will remain liable to pay all Charges due up to and
          including the date of termination.
        </StyledListItem>
        <StyledListItem>
          14.4. Each Party shall be liable for its own costs arising on
          termination.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>15. DISCLAIMER</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          15.1. Nothing in this Clause 15 shall limit or exclude our liability
          for death or personal injury caused by our negligence, or the
          negligence of our employees or agents.
        </StyledListItem>
        <StyledListItem>
          15.2. We will make every effort to ensure that information provided by
          us in the course of delivering the Services is accurate but we accept
          no liability for any loss or damage caused to any person as a result
          of any errors, omissions or misleading statements in such information.
        </StyledListItem>
        <StyledListItem>
          15.3. In the course of providing the Services DBT may offer to
          introduce you to third parties. DBT does not guarantee the
          participation of any third party in such introduction process. You
          acknowledge that the actions of any third party introduced to you in
          connection with these services are outside of DBT's control and that
          DBT does not accept any liability for the actions or omissions of that
          third party.
        </StyledListItem>
        <StyledListItem>
          15.4. If you are interested in developing a relationship with any
          third party referred to in material provided by us you should
          undertake your own due diligence in respect of such third party and
          should not consider a reference in our material to be an endorsement
          by DBT of that third party or any goods or services provided by it.
        </StyledListItem>
        <StyledListItem>
          15.5. You acknowledge and agree that we accept no liability for
          commercial arrangements entered into in connection with use of the
          Services, and we assume no responsibility for the success or failure
          of any such arrangements.
        </StyledListItem>
        <StyledListItem>
          15.6. The identification by DBT of an export opportunity in any
          information provided to you does not indicate that such export
          opportunity is in compliance with export control legislation and it
          remains your responsibility to ensure that you comply with such export
          control legislation including the obtaining of relevant licences.
        </StyledListItem>
        <StyledListItem>
          15.7. We shall not have any responsibility to any third party to whom
          materials produced by us are disclosed. You agree to inform any
          recipient of the materials that should they choose to rely on any
          aspects of our work they will do so at their own risk and have no
          recourse to DBT.
        </StyledListItem>
        <StyledListItem>
          15.8. We shall have no liability to you in the event that we are
          prevented from providing the Services to you by your act, omission or
          failure.
        </StyledListItem>
        <StyledListItem>
          15.9. In no event shall we have any liability to you for:
          <OrderedList>
            <StyledListItem>
              15.9.1. loss of profits, sales, business or revenue;
            </StyledListItem>
            <StyledListItem>15.9.2. business interruption;</StyledListItem>
            <StyledListItem>
              15.9.3. loss of anticipated savings;
            </StyledListItem>
            <StyledListItem>
              15.9.4. loss of business opportunity, goodwill or reputation; or
            </StyledListItem>
            <StyledListItem>
              15.9.5. any indirect or consequential loss or damage.
            </StyledListItem>
          </OrderedList>
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>16. LIMIT OF LIABILITY</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          16.1. Subject to Clause 15.1 the liability of each of the Parties
          under the Contract is capped at the value of the Charges.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>17. AMENDMENTS TO THE TERMS AND CONDITIONS</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          17.1. We reserve the right to amend the Terms and Conditions from time
          to time at our discretion.
        </StyledListItem>
        <StyledListItem>
          17.2. Where the Terms and Conditions are amended we will notify you by
          email that an updated version of the Terms and Conditions is available
          and provide you with a link to a website where you can view the
          revised Terms and Conditions.
        </StyledListItem>
        <StyledListItem>
          17.3. Unless you terminate the Contract under Clause 14 within 14 days
          of our email notification you will be deemed to have accepted the
          amended Terms and Conditions.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>18. ENTIRE AGREEMENT</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          18.1. The Contract contains the whole agreement between the Parties
          and supersedes and replaces any prior written or oral agreements,
          representations or understandings between them. The Parties confirm
          that they have not entered into the Contract on the basis of any
          representation that is not expressly incorporated into the Contract.
          Nothing in this clause shall exclude liability for fraud or fraudulent
          misrepresentation.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>19. FORCE MAJEURE</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          19.1. In this Clause a "Force Majeure Event" means an event beyond our
          reasonable control including but not limited to strikes, lock-outs or
          other industrial disputes (whether involving our workforce or any
          other party), failure of a utility service or transport network, act
          of God, war, riot, civil commotion, malicious damage, compliance with
          any law or governmental order, rule, regulation or direction,
          accident, breakdown of plant or machinery, fire, flood, storm or
          default of our suppliers or subcontractors.
        </StyledListItem>
        <StyledListItem>
          19.2. We shall not be liable to you as a result of any delay or
          failure to perform the Services as a result of a Force Majeure Event.
        </StyledListItem>
        <StyledListItem>
          19.3. If the Force Majeure Event prevents us from providing the
          Services for more than four weeks, either Party may terminate the
          Contract by written notice to the other Party. If notice of
          termination for a Force Majeure Event occurs we will refund any
          Charges paid by you in advance for any part of the Services that we
          have been unable to deliver as at the date notice of termination is
          given.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>20. AGENCY</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          20.1. The Agreement shall not constitute or imply any partnership,
          joint venture, agency, fiduciary relationship or other relationship
          between the Parties other than the contractual relationship expressly
          provided for in the Contract.
        </StyledListItem>
      </OrderedList>
      <StyledListItem>
        <strong>21. GOVERNING LAW AND JURISDICTION</strong>
      </StyledListItem>
      <OrderedList>
        <StyledListItem>
          21.1. The Contract and any dispute or claim arising out of or in
          connection with it or its subject matter or formation (including
          non-contractual disputes or claims), shall be governed by, and
          construed in accordance with, English law, and the parties irrevocably
          submit to the exclusive jurisdiction of the courts of England and
          Wales.
        </StyledListItem>
      </OrderedList>
    </OrderedList>
  </>
)

export default OMISTermsAndConditions
