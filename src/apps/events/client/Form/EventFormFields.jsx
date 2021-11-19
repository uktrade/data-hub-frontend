import React from 'react'
import PropTypes from 'prop-types'

import {
  AdviserTypeAhead,
  FieldRadios,
  FieldInput,
  FieldDate,
  FieldAddAnother,
  FieldTextarea,
  FieldTypeahead,
} from '../../../../client/components'
import { OPTIONS_YES_NO, OPTION_YES } from '../../../../client/constants'
import { validateStartDateBeforeOrEqualToEndDate } from './validators'

const UK = '80756b9a-5d95-e211-a939-e4115bead28a'

export const EventFormFields = ({ values }) => {
  return values && values.metadata ? (
    <>
      <FieldRadios
        legend="Does the event relate to a trade agreement?"
        name="has_related_trade_agreements"
        required="Answer if the event is related to a trade agreement"
        options={OPTIONS_YES_NO}
        inline={true}
      />
      {values.has_related_trade_agreements === OPTION_YES && (
        <FieldAddAnother
          name="related_trade_agreements"
          label="Related named trade agreement(s)"
          data-test-prefix="trade-agreement-field-"
          required="Select at least one Trade Agreement"
          item-name="trade agreement"
        >
          {({ value, onChange, error }) => (
            <FieldTypeahead
              name="related_trade_agreements"
              options={values.metadata.relatedTradeAgreements}
              placeholder="Search trade agreements"
              required="Select at least one Trade Agreement"
              aria-label="Select a trade agreement"
              value={values.metadata.relatedTradeAgreements?.find(
                ({ value: option_value }) => option_value === value
              )}
              onChange={onChange}
              error={error}
            />
          )}
        </FieldAddAnother>
      )}
      <FieldInput
        label="Event name"
        name="name"
        type="text"
        required="Event name may not be null."
      />
      <FieldTypeahead
        name="event_type"
        label="Type of event"
        options={values.metadata.eventTypeOptions}
        placeholder="Select event type"
        required="Select at least one event type"
        aria-label="Select an event type"
      />
      <FieldDate
        name="start_date"
        label="Event start date"
        required="Enter a valid start date"
      />
      <FieldDate
        name="end_date"
        label="Event end date"
        required="Enter a valid end date"
        validate={validateStartDateBeforeOrEqualToEndDate}
      />
      <FieldTypeahead
        name="location_type"
        label="Event location type (optional)"
        options={values.metadata.eventLocationTypes}
        placeholder="Select event"
        aria-label="Select an event"
      />
      <FieldInput
        label="Address line 1"
        name="address_1"
        type="text"
        required="Business and street may not be null."
      />
      <FieldInput
        name="address_2"
        type="text"
        label="Address line 2 (optional)"
      />
      <FieldInput
        label="Town or city"
        name="address_town"
        type="text"
        required="Town or city may not be null."
      />
      <FieldInput label="County (optional)" name="address_county" type="text" />
      <FieldInput
        label="Postcode"
        name="address_postcode"
        type="text"
        required="Postcode may not be null."
      />
      <FieldTypeahead
        name="address_country"
        label="Country"
        options={values.metadata.countries}
        required="Country may not be null."
        placeholder="Select country"
        aria-label="Select a country"
      />
      {values.address_country?.value === UK && (
        <FieldTypeahead
          name="uk_region"
          label="UK Region"
          options={values.metadata.ukRegions}
          required="UK region may not be null."
          placeholder="Select region"
          aria-label="Select a region"
        />
      )}
      <FieldTextarea type="text" name="notes" label="Event Notes (optional)" />
      <FieldTypeahead
        name="lead_team"
        label="Team hosting the event"
        options={values.metadata.teams}
        required="Select at least one team hosting the event"
        placeholder="Select team"
        aria-label="Select an team"
      />
      <FieldTypeahead
        name="service"
        label="Service"
        required="Select at least one service"
        options={values.metadata.services}
        placeholder="Select service"
        aria-label="Select a service"
      />
      <AdviserTypeAhead
        name="organiser"
        label="Organiser"
        required="Type at least one organiser"
        placeholder="Type to search for organiser"
      />
      <FieldRadios
        legend="Is this a shared event? (optional)"
        name="event_shared"
        options={OPTIONS_YES_NO}
        inline={true}
      />
      {values.event_shared === OPTION_YES && (
        <FieldAddAnother
          name="teams"
          label="Teams"
          required="Select at least one team"
          item-name="team"
          data-test-prefix="team-field-"
        >
          {({ value, onChange, error }) => (
            <FieldTypeahead
              name="teams"
              options={values.metadata.teams}
              placeholder="Select team"
              required="Select at least one team"
              aria-label="Select at least one team"
              value={values.metadata.teams?.find(
                ({ value: option_value }) => option_value === value
              )}
              onChange={onChange}
              error={error}
            />
          )}
        </FieldAddAnother>
      )}
      <FieldAddAnother
        name="related_programmes"
        label="Related programmes"
        required="Select at least one programme"
        item-name="program"
      >
        {({ value, onChange, error }) => (
          <>
            <FieldTypeahead
              name="related_programmes"
              options={values.metadata.programmes}
              placeholder="Select programme"
              required="Select at least one programme"
              aria-label="Select at least one programme"
              value={values.metadata.programmes?.find(
                ({ value: option_value }) => option_value === value
              )}
              onChange={onChange}
              error={error}
            />
          </>
        )}
      </FieldAddAnother>
    </>
  ) : null
}

EventFormFields.propTypes = {
  values: PropTypes.shape({
    metadata: PropTypes.shape({
      eventTypeOptions: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      relatedTradeAgreements: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      eventLocationTypes: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      countries: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      teams: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      services: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      programmes: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
      ukRegions: PropTypes.arrayOf(
        PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
      ),
    }),
    id: PropTypes.string,
    address_postcode: PropTypes.string,
    address_1: PropTypes.string,
    address_2: PropTypes.string,
    address_county: PropTypes.string,
    address_postcode: PropTypes.string,
    address_town: PropTypes.string,
    address_country: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    end_date: PropTypes.shape({
      year: PropTypes.string,
      month: PropTypes.string,
      day: PropTypes.string,
    }),
    start_date: PropTypes.shape({
      year: PropTypes.string,
      month: PropTypes.string,
      day: PropTypes.string,
    }),
    event_type: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    lead_team: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    location_type: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    name: PropTypes.string,
    notes: PropTypes.string,
    organiser: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    has_related_trade_agreements: PropTypes.oneOf(['yes', 'no']),
    related_trade_agreements: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    related_programmes: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    event_shared: PropTypes.oneOf(['yes', 'no']),
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    service: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
    uk_region: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  }),
}
