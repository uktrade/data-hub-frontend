import React from 'react'
import PropTypes from 'prop-types'

import {
  AdviserTypeAhead,
  FieldRadios,
  FieldInput,
  FieldDate,
  FieldTextarea,
  FieldTypeahead,
  NewWindowLink,
} from '../../../../client/components'
import {
  OPTIONS_YES_NO,
  OPTION_YES,
  UK_VALUE,
} from '../../../../client/constants'
import { validateStartDateBeforeOrEqualToEndDate } from './validators'
import urls from '../../../../lib/urls'

export const EventFormFields = ({ values }) => {
  return values && values.metadata ? (
    <>
      <article>
        <p>
          If your Event is set up to focus on a Trade Agreement or contributes
          to implementing a Trade Agreement then select that the event relates
          to a Trade Agreement and the relevant Agreement(s)
        </p>
        <NewWindowLink href={urls.external.helpCentre.tradeagreementGuidance()}>
          See more guidance
        </NewWindowLink>
      </article>
      <FieldRadios
        legend="Does the event relate to a trade agreement?"
        name="has_related_trade_agreements"
        required="Answer if the event is related to a trade agreement"
        options={OPTIONS_YES_NO.map((option) => ({
          label: option.label,
          value: option.value,
          ...(option.value === OPTION_YES && {
            children: (
              <FieldTypeahead
                label="Related Trade Agreements"
                isMulti={true}
                closeMenuOnSelect={true}
                name="related_trade_agreements"
                options={values.metadata.relatedTradeAgreements}
                placeholder="Search trade agreements"
                required="Trade Agreement can not be null"
                aria-label="Select a trade agreement"
                noOptionsMessage={() => <span>No trade agreement found</span>}
              />
            ),
          }),
        }))}
        inline={true}
      />
      <FieldInput
        label="Event name"
        name="name"
        type="text"
        required="Enter an event name"
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
        required="Enter an Address line 1"
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
        required="Enter a town or city"
      />
      <FieldInput label="County (optional)" name="address_county" type="text" />
      <FieldInput
        label="Postcode"
        name="address_postcode"
        type="text"
        required="Enter a postcode"
      />
      <FieldTypeahead
        name="address_country"
        label="Country"
        options={values.metadata.countries}
        required="Enter a country"
        placeholder="Select country"
        aria-label="Select a country"
      />
      {values.address_country?.value === UK_VALUE && (
        <FieldTypeahead
          name="uk_region"
          label="UK Region"
          options={values.metadata.ukRegions}
          required="UK region may not be null"
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
        options={OPTIONS_YES_NO.map((option) => ({
          label: option.label,
          value: option.value,
          ...(option.value === OPTION_YES && {
            children: (
              <FieldTypeahead
                label="Teams"
                isMulti={true}
                closeMenuOnSelect={true}
                name="teams"
                options={values.metadata.teams}
                placeholder="Select team"
                required="Team can not be null"
                aria-label="Select at least one team"
                noOptionsMessage={() => <span>No team found</span>}
              />
            ),
          }),
        }))}
        inline={true}
      />
      <FieldTypeahead
        label="Related programmes"
        isMulti={true}
        closeMenuOnSelect={true}
        name="related_programmes"
        options={values.metadata.programmes}
        placeholder="Select programme"
        required="Programme can not be null"
        aria-label="Programme can not be null"
        noOptionsMessage={() => <span>No programmes found</span>}
      />
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
    has_related_trade_agreements: PropTypes.oneOf(['yes', 'no', '']),
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
    event_shared: PropTypes.oneOf(['yes', 'no', '']),
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
