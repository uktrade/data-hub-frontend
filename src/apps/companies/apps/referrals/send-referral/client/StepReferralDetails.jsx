import React from 'react'
import { throttle } from 'lodash'
import axios from 'axios'
import styled from 'styled-components'
import { H2, Button, Link } from 'govuk-react'
import { WHITE, LIGHT_BLUE_50 } from 'govuk-colours'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'

import { contacts } from '../../../../../../lib/urls'
import {
  Panel,
  NewWindowLink,
  FormActions,
  FieldInput,
  FieldTypeahead,
  FieldTextarea,
} from '../../../../../../client/components'

import { useFormContext } from '../../../../../../client/components/Form/hooks'

const StyledPanel = styled(Panel)`
  a:link,
  a:visited {
    color: ${WHITE};
  }
  a:hover {
    color: ${LIGHT_BLUE_50};
  }
  margin-bottom: ${SPACING.SCALE_4};
`

const StepReferralDetails = ({
  cancelUrl,
  companyContacts,
  companyId,
  openContactFormTask,
}) => {
  const MAX_LENGTH = 255
  const { values = {} } = useFormContext()

  return (
    <>
      <StyledPanel title="When to send a referral">
        Referrals are for when you want to ask another DIT advisor to help out{' '}
        an account you are working on.
        <br />
        <NewWindowLink href="https://data-services-help.trade.gov.uk/data-hub/updates/announcements/improving-collaboration-internal-referrals/">
          Read more guidance here
        </NewWindowLink>
      </StyledPanel>

      <fieldset>
        <legend>
          <H2 size={LEVEL_SIZE[3]}>
            Who do you want to refer this company to?
          </H2>
        </legend>
        <FieldTypeahead
          name="adviser"
          label="Adviser"
          placeholder="Search for an adviser"
          required="Select an adviser for the referral"
          loadOptions={throttle(
            (searchString) =>
              axios
                .get('/api-proxy/adviser/', {
                  params: {
                    autocomplete: searchString,
                    permission__has: 'company_referral.change_companyreferral',
                  },
                })
                .then(({ data: { results } }) =>
                  results
                    .filter((adviser) => adviser?.name.trim().length)
                    .map(({ id, name, dit_team }) => ({
                      label: `${name}${dit_team ? ', ' + dit_team.name : ''}`,
                      value: id,
                    }))
                ),
            500
          )}
          hint={
            <>
              This can be an adviser at post, a sector specialist or an{' '}
              international trade advisor. If you're not sure, you can{' '}
              <NewWindowLink href="https://people.trade.gov.uk/teams/department-for-international-trade">
                find the right team and person on Digital Workspace
              </NewWindowLink>
              .
            </>
          }
        />
      </fieldset>
      <fieldset>
        <legend>
          <H2 size={LEVEL_SIZE[3]}>Referral notes</H2>
        </legend>
        <FieldInput
          type="text"
          label="Subject"
          name="subject"
          required={`Enter a subject for the referral (Max ${MAX_LENGTH} characters)`}
          validate={(value) =>
            value && value.length > 255
              ? `Enter a subject for the referral (Max ${MAX_LENGTH} characters)`
              : null
          }
        />
        <FieldTextarea
          type="text"
          name="notes"
          label="Notes"
          hint="Include reasons you're referring this company and any specific opportunities."
          required="Enter notes for the referral"
        />
      </fieldset>
      <FieldTypeahead
        name="contact"
        label="Company contact (optional)"
        hint={
          <>
            Who should the recipient of the referral talk to? If the contact you{' '}
            are looking for is not listed you can{' '}
            <Link
              onClick={(e) => {
                e.preventDefault()
                openContactFormTask.start({
                  payload: {
                    values,
                    url: e.target.href,
                  },
                })
              }}
              href={contacts.create(companyId, {
                origin_url: window.location.pathname,
                origin_type: 'referral',
              })}
            >
              add a new contact.
            </Link>
          </>
        }
        options={companyContacts.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
        noOptionsMessage={() => 'This company has no contacts'}
        placeholder="Select a contact"
        isClearable={true}
      />
      <FormActions>
        <Button name="forward">Continue</Button>
        <Link href={cancelUrl}>Cancel</Link>
      </FormActions>
    </>
  )
}

export default StepReferralDetails
