import React from 'react'
import { Details, ListItem, UnorderedList } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import Countries from '../../../components/Resource/Countries'
import Sector from '../../../components/Resource/Sector'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { getStartDateOfTwelveMonthsAgo } from '../../../utils/date'
import { formatValue, sumAllWinTypeYearlyValues } from './utils'
import { BLACK, WHITE } from '../../../../client/utils/colours'
import { validateWinDate, validateTextField } from './validators'
import { StyledHintParagraph } from './styled'
import { Breakdowns } from './Breakdowns'
import urls from '../../../../lib/urls'

import {
  Step,
  FieldDate,
  FieldInput,
  FieldRadios,
  FieldTextarea,
  FieldCheckboxes,
} from '../../../components'
import {
  steps,
  winTypes,
  winTypeOptions,
  goodsServicesOptions,
} from './constants'

const MAX_WORDS = 100

const StyledDetails = styled(Details)({
  margin: 0,
})

const StyledExportTotal = styled('p')({
  color: WHITE,
  padding: 10,
  marginBottom: 30,
  backgroundColor: BLACK,
})

const StyledSectorFieldTypeahead = styled(Sector.FieldTypeahead)({
  marginBottom: 0,
  paddingBottom: 0,
})

const FOSSIL_FUEL_EMAIL = 'fossilfuelenquiries@trade.gov.uk'

const WinDetailsStep = ({ isEditing }) => {
  const { values } = useFormContext()
  const twelveMonthsAgo = getStartDateOfTwelveMonthsAgo()
  const month = twelveMonthsAgo.getMonth() + 1
  const year = twelveMonthsAgo.getFullYear()

  return (
    <Step name={steps.WIN_DETAILS}>
      <H3 data-test="step-heading">Win details</H3>
      <StyledHintParagraph data-test="hint">
        The customer will be asked to confirm this information.
      </StyledHintParagraph>
      {!isEditing && (
        <Countries.FieldTypeahead
          name="country"
          id="country"
          label="Destination country"
          required="Choose a destination country"
          payload={{ is_export_win: true }}
        />
      )}
      {!isEditing && (
        <FieldDate
          name="date"
          format="short"
          label="Date won"
          hint={`For example ${month} ${year}, date of win must be in the last 12 months.`}
          required="Enter the win date"
          invalid="Enter a valid date"
          validate={validateWinDate}
        />
      )}
      {!isEditing && (
        <FieldTextarea
          name="description"
          label="Summary of the support given"
          hint="Outline what had the most impact or would be memorable to the customer in less than 100 words."
          required="Enter a summary"
          invalid={`Summary must be ${MAX_WORDS} words or less`}
          maxWords={MAX_WORDS}
        />
      )}
      <FieldRadios
        name="name_of_customer_confidential"
        label="Overseas customer"
        hint="Is the customer's name confidential?"
        required="Select Yes or No"
        options={[
          {
            label: 'Yes',
            value: 'yes',
          },
          {
            label: 'No',
            value: 'no',
            children: (
              <FieldInput
                type="text"
                name="name_of_customer"
                label="Customer's name"
                hint="Enter the customer’s name, this will be displayed on Data Hub."
                required="Enter the name of the overseas customer"
                placeholder="Add name"
                validate={validateTextField("Customer's name")}
              />
            ),
          },
        ]}
      />
      {!isEditing && (
        <>
          <FieldInput
            type="text"
            name="business_type"
            label="Type of business deal"
            required="Enter the type of business deal"
            hint="For example: export sales, contract, order, distributor, tender / competition win, joint venture, outward investment."
            placeholder="Enter a type of business deal"
            validate={validateTextField('Type of business deal')}
          />

          <FieldCheckboxes
            name="win_type"
            legend="Type of win"
            required="Choose at least one type of win"
            options={winTypeOptions.map((option) => ({
              ...option,
              ...(option.value === winTypes.EXPORT && {
                children: (
                  <Breakdowns
                    label="Export value over the next 5 years"
                    name="export_win"
                    values={values}
                  />
                ),
              }),
              ...(option.value === winTypes.BUSINESS_SUCCESS && {
                link: (
                  <StyledDetails
                    summary="What is business success?"
                    data-test="business-success-details"
                  >
                    <p>Business success is defined as:</p>
                    <UnorderedList listStyleType="bullet">
                      <ListItem>
                        the exchange of ownership of goods/services from a
                        subsidiary of an eligible UK company to a non-UK
                        resident
                      </ListItem>
                      <ListItem>
                        in financial services, the value of assets under
                        management or the value of a listing
                      </ListItem>
                      <ListItem>
                        the collection of cash from an overdue invoice
                      </ListItem>
                      <ListItem>
                        reduced tax burden on a customer achieved by lobbying
                      </ListItem>
                      <ListItem>repatriation of profits to the UK</ListItem>
                    </UnorderedList>
                  </StyledDetails>
                ),
                children: (
                  <Breakdowns
                    label="Business success over the next 5 years"
                    name="business_success_win"
                    values={values}
                  />
                ),
              }),
              ...(option.value === winTypes.ODI && {
                link: (
                  <StyledDetails
                    summary="What is an ODI?"
                    data-test="odi-details"
                  >
                    <p>
                      An ODI is a cross-border investment from the UK into
                      another country, where the source of the money is the UK.
                    </p>
                    <p>
                      The aim of the investment is to set up a lasting interest
                      in a company, where the investor has a genuine influence
                      in the management. This may involve providing capital for
                      vehicles, machinery, buildings, and running costs to:
                    </p>
                    <UnorderedList listStyleType="bullet">
                      <ListItem>set up an overseas subsidiary</ListItem>
                      <ListItem>enter into a joint venture</ListItem>
                      <ListItem>expand current overseas operations</ListItem>
                    </UnorderedList>
                  </StyledDetails>
                ),
                children: (
                  <Breakdowns
                    label="Outward Direct Investment over the next 5 years"
                    name="odi_win"
                    values={values}
                  />
                ),
              }),
            }))}
          />
        </>
      )}

      {!isEditing && values?.win_type?.length > 1 && (
        <StyledExportTotal data-test="total-value">
          Total value:{' '}
          {formatValue(sumAllWinTypeYearlyValues(values?.win_type, values))}
        </StyledExportTotal>
      )}
      <FieldCheckboxes
        name="goods_vs_services"
        legend="What does the value relate to?"
        hint="Select all that apply."
        required="Select at least one option"
        options={goodsServicesOptions}
      />
      <FieldInput
        type="text"
        name="name_of_export"
        label="Name of goods or services"
        required="Enter the name of goods or services"
        hint="For instance 'shortbread biscuits', must be 128 characters or less."
        placeholder="Enter a name for goods or services"
        validate={validateTextField('Name of goods or services')}
      />

      <StyledSectorFieldTypeahead
        id="sector"
        name="sector"
        label="Sector"
        required="Enter a sector"
      />

      <Details
        summary="Oil and gas sector important information"
        data-test="oil-and-gas"
      >
        <p>
          Since 2021 the UK does not provide financial or promotional support
          for the fossil fuel energy sector overseas, so only exempt projects
          can be added. See guidance in{' '}
          <Link
            href={urls.external.cleanEnergyTransition}
            target="_blank"
            aria-label="opens in a new tab"
          >
            'Aligning UK international support for the clean energy transition'.
          </Link>
        </p>

        <p>If it doesn't meet the criteria the win will not be approved</p>
        <p>
          To check if your project is exempt contact{' '}
          <Link href={`mailto:${FOSSIL_FUEL_EMAIL}`}>{FOSSIL_FUEL_EMAIL}.</Link>
        </p>
      </Details>
    </Step>
  )
}

export default WinDetailsStep
