import React from 'react'
import _, { get, isEmpty, pick, throttle } from 'lodash'
import qs from 'qs'
import { H3 } from '@govuk-react/heading'
import InsetText from '@govuk-react/inset-text'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import axios from 'axios'
import { SPACING_POINTS } from '@govuk-react/constants'
import { ListItem, UnorderedList } from 'govuk-react'

import { idNamesToValueLabels } from '../../../../../client/utils'
import {
  FieldAdvisersTypeahead,
  NewWindowLink,
  FieldCheckboxes,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldSelect,
  FieldTextarea,
  FieldTypeahead,
  ContactInformation,
} from '../../../../../client/components'
import Resource from '../../../../../client/components/Resource/Resource'
import SubFieldSelect from '../../../../../client/components/Form/elements/FieldSelect/SubFieldSelect'

import { useFormContext } from '../../../../../client/components/Form/hooks'

import {
  SERVICE_CONTEXTS,
  SERVICE_DELIVERY_STATUS_COMPLETED,
  THEMES,
  KINDS,
} from '../../../constants'

import {
  EXPORT_INTEREST_STATUS,
  EXPORT_INTEREST_STATUS_VALUES,
  OPTION_YES,
  OPTIONS_YES_NO,
} from '../../../../../common/constants'

import { ID, TASK_GET_ACTIVE_EVENTS } from './state'

import urls from '../../../../../lib/urls'

const StyledRelatedTradeAgreementsWrapper = styled.div`
  margin-bottom: ${SPACING_POINTS[6]}px;
`
const StyledUnorderedList = styled(UnorderedList)`
  color: inherit;
`

const getServiceContext = (theme, kind, investmentProject) => {
  if (investmentProject) {
    return SERVICE_CONTEXTS.INVESTMENT_PROJECT_INTERACTION
  }

  const mapping = {
    [THEMES.EXPORT]: {
      [KINDS.INTERACTION]: SERVICE_CONTEXTS.EXPORT_INTERACTION,
      [KINDS.SERVICE_DELIVERY]: SERVICE_CONTEXTS.EXPORT_SERVICE_DELIVERY,
    },
    [THEMES.INVESTMENT]: SERVICE_CONTEXTS.INVESTMENT_INTERACTION,
    [THEMES.TRADE_AGREEMENT]: SERVICE_CONTEXTS.TRADE_AGREEMENT_INTERACTION,
    [THEMES.OTHER]: {
      [KINDS.INTERACTION]: SERVICE_CONTEXTS.OTHER_INTERACTION,
      [KINDS.SERVICE_DELIVERY]: SERVICE_CONTEXTS.OTHER_SERVICE_DELIVERY,
    },
    [THEMES.DOMESTIC]: SERVICE_CONTEXTS.OTHER_INTERACTION,
  }
  return kind && mapping[theme][kind] ? mapping[theme][kind] : mapping[theme]
}

const isUktpService = (service) => service?.label?.includes('(UKTP)')

const isInvestmentTheme = (theme) => theme === THEMES.INVESTMENT
const isExportTheme = (theme) => theme === THEMES.EXPORT

const buildServicesHierarchy = (services) =>
  Object.values(
    services.reduce((acc, s) => {
      const [parentLabel, childLabel] = s.label.split(' : ')
      const parent =
        parentLabel in acc
          ? acc[parentLabel]
          : {
              label: parentLabel,
              value: childLabel ? parentLabel : s.value,
              children: [],
            }

      if (childLabel) {
        parent.children.push({
          label: childLabel,
          value: s.value,
        })
      }

      return {
        ...acc,
        [parentLabel]: parent,
      }
    }, {})
  )

const validateRequiredCountries = (countries, field, { values }) =>
  !EXPORT_INTEREST_STATUS_VALUES.some(
    (status) => values[status] && values[status].length
  )
    ? 'Select at least one country in one of the three fields'
    : null

const validatedDuplicatedCountries = (countries, field, { values }) =>
  EXPORT_INTEREST_STATUS_VALUES.filter((status) => status !== field.name).some(
    (status) =>
      countries &&
      values[status] &&
      countries.some((country) => values[status].includes(country))
  )
    ? 'A country that was discussed cannot be entered in multiple fields'
    : null
const exportBarrierTypes = {
  FINANCE: '758c4132-a07b-4e4d-a43d-f2f630113023',
  KNOWLEDGE: 'ef9b19d8-510b-4819-8304-5387e4c6df29',
  CAPACITY: 'd0c8fe10-dd29-4e39-a422-80dd111199e7',
  ACCESS: '27ea2db8-4383-42dd-aa7d-62023950f97d',
  OTHER: '8ef83315-2b0f-4d5e-98da-a16f8b2217a6',
}

const exportBarrierIdToHintMap = {
  [exportBarrierTypes.FINANCE]:
    'For example, delivering export contracts, having access to export finance and insurance',
  [exportBarrierTypes.KNOWLEDGE]:
    'For example, having information about regulations or how to export to a market',
  [exportBarrierTypes.CAPACITY]:
    'For example, understanding international markets and their costs, as well as having enough people',
  [exportBarrierTypes.ACCESS]:
    'For example, having access to contacts, customers and the right networks',
  [exportBarrierTypes.OTHER]: '',
}

const getSecondTierServices = (service, services) =>
  service
    ? get(
        services.filter((s) => s.label === service),
        '[0].children',
        []
      )
    : []

const StepInteractionDetails = ({
  companyId,
  contacts,
  services,
  serviceDeliveryStatuses,
  communicationChannels,
  countries,
  onOpenContactForm,
  relatedTradeAgreements,
  exportBarrier,
}) => {
  const { values = {} } = useFormContext()
  const serviceContext = getServiceContext(
    values.theme,
    values.kind,
    values.investment_project
  )
  const servicesHierarchy = buildServicesHierarchy(
    services.filter((s) => s.contexts.includes(serviceContext))
  )

  const selectedServiceId = values.service_2nd_level || values.service
  const selectedService = services.find((s) => s.value === selectedServiceId)

  const isServiceDelivery = values.kind === KINDS.SERVICE_DELIVERY
  const topLevelServices = servicesHierarchy.map((s) =>
    pick(s, ['label', 'value'])
  )

  const secondTierServices = getSecondTierServices(
    values.service,
    servicesHierarchy
  )

  const validateSecondTierServices = (
    second_level_service_value,
    _field,
    { values }
  ) =>
    values.service &&
    getSecondTierServices(values.service, servicesHierarchy).length > 0 &&
    isEmpty(second_level_service_value)
      ? 'Select a service'
      : null

  const helpUrl = (position) =>
    urls.external.helpCentre.policyFeedback +
    '?' +
    qs.stringify({
      ..._.pick(values, ['theme', 'kind']),
      'link-pos': 'box-' + position,
    })

  return (
    <>
      <H3 as="h2">Service</H3>
      <FieldSelect
        name="service"
        emptyOption="-- Select service --"
        options={topLevelServices}
        required="Select a service"
        aria-label="service"
      />

      <SubFieldSelect
        /*
        We need to hide the component this way as mounting it conditionally
        would make its error message in the error summary appear at the end of
        the list and we want the errors in the summary to be in the same order
        as the corresponding fields.
        */
        style={{ display: !secondTierServices.length && 'none' }}
        name="service_2nd_level"
        emptyOption="-- Select service --"
        options={secondTierServices}
        validate={validateSecondTierServices}
        aria-label="Select service category"
      />

      {selectedService?.interaction_questions?.map((question) => (
        <FieldRadios
          name={`service_answers.${question.id}`}
          legend={question.name}
          required={`Give answer to "${question.name}"`}
          options={question.answer_options.map(({ id, name }) => ({
            label: name,
            value: id,
          }))}
        />
      ))}

      {isServiceDelivery && isUktpService(selectedService) && (
        <>
          <FieldSelect
            label="Service status (optional)"
            name="service_delivery_status"
            emptyOption="-- Select service status --"
            options={serviceDeliveryStatuses}
          />
          <FieldInput
            type="number"
            label="Grant offered (optional)"
            name="grant_amount_offered"
          />
          {values.service_delivery_status ===
            SERVICE_DELIVERY_STATUS_COMPLETED && (
            <FieldInput
              type="text"
              label="Net receipt (optional)"
              name="net_company_receipt"
            />
          )}
        </>
      )}
      {!isInvestmentTheme(values.theme) && (
        <StyledRelatedTradeAgreementsWrapper>
          <FieldRadios
            inline={true}
            name="has_related_trade_agreements"
            legend="Does this interaction relate to a named trade agreement? (optional)"
            options={OPTIONS_YES_NO}
          />

          {values.has_related_trade_agreements === OPTION_YES && (
            <FieldTypeahead
              name="related_trade_agreements"
              label="Related named trade agreement(s)"
              placeholder="-- Select trade agreements --"
              required="Select at least one Trade Agreement"
              options={relatedTradeAgreements}
              aria-label="Select a trade agreement"
              isMulti={true}
            />
          )}
        </StyledRelatedTradeAgreementsWrapper>
      )}
      <H3 as="h2">Participants</H3>

      <FieldTypeahead
        name="contacts"
        label="Contacts"
        placeholder="Select contact"
        required="Select at least one contact"
        options={contacts}
        noOptionsMessage="No contacts listed, add a new contact"
        isMulti={true}
      />
      <ContactInformation
        onOpenContactForm={onOpenContactForm}
        companyId={companyId}
      />

      <FieldAdvisersTypeahead
        name="dit_participants"
        label="Adviser(s)"
        required="Select at least one adviser"
        isMulti={true}
      />

      <H3 as="h2">Details</H3>

      <FieldDate
        name="date"
        label="Date of interaction"
        required="Enter a valid date"
      />

      {!isServiceDelivery && (
        <FieldTypeahead
          name="communication_channel"
          label="Communication channel"
          options={communicationChannels}
          placeholder="-- Select communication channel --"
          required="Select a communication channel"
        />
      )}

      {isServiceDelivery && (
        <>
          <FieldRadios
            inline={true}
            name="is_event"
            legend="Is this an event?"
            options={OPTIONS_YES_NO}
            required="Select if this was an event"
          />
          {values.is_event === OPTION_YES && (
            <Resource name={TASK_GET_ACTIVE_EVENTS} id={ID}>
              {(events) => (
                <FieldTypeahead
                  label="Event"
                  name="event"
                  placeholder="-- Select event --"
                  required="Select a specific event"
                  options={events}
                />
              )}
            </Resource>
          )}
        </>
      )}
      <FieldInput
        type="text"
        name="subject"
        label="Summary"
        required="Enter a summary"
      />

      <FieldTextarea
        type="text"
        name="notes"
        label="Notes (optional)"
        hint="Add details of the interaction, such as how the meeting came about and location. Issues relating to DBT or government objectives should be added to the business intelligence section."
      />

      <InsetText>
        Select business intelligence if your contact mentioned issues relating
        to DBT or government objectives.
        <br />
        <br />
        For more information see{' '}
        <NewWindowLink href={helpUrl(1)}>
          record business intelligence in an interaction
        </NewWindowLink>{' '}
      </InsetText>

      <FieldRadios
        inline={true}
        name="was_policy_feedback_provided"
        legend="Did the contact provide business intelligence?"
        options={OPTIONS_YES_NO}
        required="Select if the contact provided business intelligence"
      />

      {values.was_policy_feedback_provided === OPTION_YES && (
        <>
          <FieldTextarea
            name="policy_feedback_notes"
            label="Business intelligence summary"
            required="Enter business intelligence"
            hint={
              <>
                <p>
                  Please summarise the information the business shared during
                  this interaction, including sufficient detail to convey the
                  meaning and significance of the topics covered.
                </p>
                <p>Where available, include:</p>
                <StyledUnorderedList listStyleType="bullet">
                  <ListItem>
                    Opportunities, risks and/or anything affecting business
                    operations (company, sector or market) or investor sentiment
                  </ListItem>
                  <ListItem>
                    Quantify impacts and timescales (e.g. costs, number/location
                    of jobs created/lost)
                  </ListItem>
                  <ListItem>
                    Actions the business has or is proposing to take
                  </ListItem>
                  <ListItem>Comments, questions or requests of HMG</ListItem>
                </StyledUnorderedList>
              </>
            }
          />
        </>
      )}

      {values.theme !== THEMES.INVESTMENT && (
        <>
          <FieldRadios
            inline={true}
            name="were_countries_discussed"
            legend="Were any countries discussed? (optional)"
            options={OPTIONS_YES_NO}
          />

          {values.were_countries_discussed === OPTION_YES && (
            <>
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.EXPORTING_TO}
                label="Countries currently exporting to"
                hint="Select all countries discussed"
                placeholder="-- Search countries --"
                value={values.currently_exporting}
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.FUTURE_INTEREST}
                label="Future countries of interest"
                hint="Select all countries discussed"
                placeholder="-- Search countries --"
                value={values.future_interest}
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
              <FieldTypeahead
                name={EXPORT_INTEREST_STATUS.NOT_INTERESTED}
                label="Countries not interested in"
                hint="Select all countries discussed"
                placeholder="-- Search countries --"
                value={values.not_interested}
                options={countries}
                validate={[
                  validateRequiredCountries,
                  validatedDuplicatedCountries,
                ]}
                isMulti={true}
              />
            </>
          )}
        </>
      )}
      {isInvestmentTheme(values.theme) && (
        <>
          <FieldRadios
            inline={true}
            name="has_related_opportunity"
            legend="Does this interaction relate to a large capital opportunity? (optional)"
            options={OPTIONS_YES_NO}
          />

          {values.has_related_opportunity === OPTION_YES && (
            <FieldTypeahead
              isMulti={false}
              label="Related large capital opportunity"
              name="large_capital_opportunity"
              placeholder="Type to search for opportunities"
              noOptionsMessage="No opportunities found"
              aria-label="Select an opportunity"
              required="Select a related large capital opportunity"
              loadOptions={throttle(
                (searchString) =>
                  axios
                    .get('/api-proxy/v4/large-capital-opportunity', {
                      params: {
                        autocomplete: searchString,
                        archived: false,
                      },
                    })
                    .then(({ data: { results } }) =>
                      idNamesToValueLabels(results)
                    ),
                500
              )}
            />
          )}
        </>
      )}

      {isExportTheme(values.theme) && (
        <>
          <FieldRadios
            inline={true}
            name="helped_remove_export_barrier"
            legend="Did the interaction help remove an export barrier? (optional)"
            options={OPTIONS_YES_NO}
          />

          {values.helped_remove_export_barrier === OPTION_YES && (
            <FieldCheckboxes
              name="export_barrier_types"
              legend="Tell us how the interaction helped remove an export barrier"
              hint="Select all that apply"
              options={exportBarrier.map((barrierType) => ({
                ...barrierType,
                hint: exportBarrierIdToHintMap[barrierType.value],
              }))}
              required="Select at least one option"
            />
          )}

          {values.export_barrier_types?.includes(exportBarrierTypes.OTHER) && (
            <FieldTextarea
              type="text"
              name="export_barrier_notes"
              label="What happened in the interaction to help remove an export barrier?"
              required="Enter a description"
            />
          )}
        </>
      )}
    </>
  )
}

const typeaheadOptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

const typeaheadOptionsListProp = PropTypes.arrayOf(typeaheadOptionProp)

StepInteractionDetails.propTypes = {
  companyId: PropTypes.string.isRequired,
  services: typeaheadOptionsListProp.isRequired,
  serviceDeliveryStatuses: typeaheadOptionsListProp.isRequired,
  communicationChannels: typeaheadOptionsListProp.isRequired,
  countries: typeaheadOptionsListProp.isRequired,
  relatedTradeAgreements: typeaheadOptionsListProp.isRequired,
  onOpenContactForm: PropTypes.func.isRequired,
  contacts: typeaheadOptionsListProp.isRequired,
}

export default StepInteractionDetails
