import React from 'react'
import { throttle } from 'lodash'
import styled from 'styled-components'
import { H2, Button } from 'govuk-react'
import { SPACING, LEVEL_SIZE } from '@govuk-react/constants'

import { ID as STORE_ID } from './state'
import urls, { contacts } from '../../../../../lib/urls'
import {
  Panel,
  NewWindowLink,
  FormActions,
  FieldInput,
  FieldTypeahead,
  FieldTextarea,
} from '../../../../components'

import { useFormContext } from '../../../../components/Form/hooks'
import { apiProxyAxios } from '../../../../components/Task/utils'
import AccessibleLink from '../../../../components/Link'

const StyledPanel = styled(Panel)({
  marginBottom: SPACING.SCALE_4,
})

const StepReferralDetails = ({
  companyContacts,
  companyId,
  openContactFormTask,
}) => {
  const MAX_LENGTH = 255
  const { values = {} } = useFormContext()

  const transformedContacts = companyContacts.map(
    ({ firstName, lastName, id }) => ({
      name: `${firstName} ${lastName}`,
      id: id,
    })
  )

  return (
    <>
      <StyledPanel title="When to send a referral">
        Referrals are for when you want to ask another DBT advisor to help out{' '}
        an account you are working on.
        <br />
        <NewWindowLink
          data-test="referral-guidance"
          href={urls.external.helpCentre.referrals}
          darkBackground={true}
        >
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
              apiProxyAxios
                .get('/adviser/', {
                  params: {
                    autocomplete: searchString,
                    permission__has: 'company_referral.change_companyreferral',
                  },
                })
                .then(({ data: { results } }) =>
                  results
                    .filter((adviser) => adviser?.name.trim().length)
                    .map(({ id, name, dit_team, is_active }) => ({
                      label: `${name}${!is_active ? ' - INACTIVE' : ''}${
                        dit_team ? ', ' + dit_team.name : ''
                      }`,
                      value: id,
                    }))
                ),
            500
          )}
          hint={
            <>
              This can be an adviser at post, a sector specialist or an{' '}
              international trade advisor. If you're not sure, you can{' '}
              <NewWindowLink href={urls.external.intranet.teams}>
                find the right team and person on the Intranet
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
            <AccessibleLink
              onClick={(e) => {
                e.preventDefault()
                openContactFormTask.start({
                  payload: {
                    values,
                    url: e.target.href,
                    storeId: STORE_ID,
                  },
                })
              }}
              href={contacts.create(companyId, {
                origin_url: window.location.pathname,
                origin_type: 'referral',
              })}
            >
              add a new contact.
            </AccessibleLink>
          </>
        }
        options={transformedContacts.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
        noOptionsMessage="This company has no contacts"
        placeholder="Select a contact"
        isClearable={true}
      />
      <FormActions>
        <Button name="forward">Continue</Button>
        <AccessibleLink
          data-test="referral-details-cancel"
          href={urls.companies.detail(companyId)}
        >
          Cancel
        </AccessibleLink>
      </FormActions>
    </>
  )
}

export default StepReferralDetails
