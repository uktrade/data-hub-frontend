import React from 'react'
import { Details, ListItem, UnorderedList } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { getStartDateOfTwelveMonthsAgo } from '../../../utils/date'
import CountriesResource from '../../../components/Resource/Countries'
import { formatValue, sumAllWinTypeYearlyValues } from './utils'
import { BLACK, WHITE } from '../../../../client/utils/colours'
import { SectorResource } from '../../../components/Resource'
import { OPTION_YES } from '../../../../common/constants'
import { validateWinDate } from './validators'
import { WinTypeValues } from './WinTypeValues'
import { StyledHintParagraph } from './styled'
import {
  Step,
  FieldDate,
  FieldInput,
  FieldTextarea,
  FieldTypeahead,
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
  padding: 10,
  color: WHITE,
  backgroundColor: BLACK,
})

const WinDetailsStep = () => {
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
      <ResourceOptionsField
        name="country"
        id="country"
        label="Destination country"
        required="Choose a destination country"
        resource={CountriesResource}
        field={FieldTypeahead}
      />
      <FieldDate
        name="date"
        format="short"
        label="Date won"
        hint={`For example ${month} ${year}, date of win must be in the last 12 months.`}
        required="Enter the win date"
        invalid="Enter a valid date"
        validate={validateWinDate}
      />
      <FieldTextarea
        name="description"
        label="Summary of the support given"
        hint="Outline what had the most impact or would be memorable to the customer in less than 100 words."
        required="Enter a summary"
        invalid={`Summary must be ${MAX_WORDS} words or less`}
        maxWords={MAX_WORDS}
      />

      <FieldInput
        type="text"
        name="name_of_customer"
        label="Overseas customer"
        required="Enter the name of the overseas customer"
        placeholder="Add name"
      />

      <FieldCheckboxes
        name="name_of_customer_confidential"
        hint="Check this box if your customer has asked for this not to be public (optional)."
        options={[
          {
            value: OPTION_YES,
            label: 'Confidential',
          },
        ]}
      />

      <FieldInput
        type="text"
        name="business_type"
        label="Type of business deal"
        required="Enter the type of business deal"
        hint="For example: export sales, contract, order, distributor, tender / competition win, joint venture, outward investment."
        placeholder="Enter a type of business deal"
      />

      <FieldCheckboxes
        name="win_type"
        legend="Type of win"
        required="Choose at least one type of win"
        options={winTypeOptions.map((option) => ({
          ...option,
          ...(option.value === winTypes.EXPORT && {
            children: (
              <WinTypeValues
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
                    subsidiary of an eligible UK company to a non-UK resident.
                  </ListItem>
                  <ListItem>
                    in financial services, the value of assets under management
                    or the value of a listing.
                  </ListItem>
                  <ListItem>
                    the collection of cash from an overdue invoice.
                  </ListItem>
                  <ListItem>
                    reduced tax burden on a customer achieved by lobbying.
                  </ListItem>
                  <ListItem>repatriation of profits to the UK.</ListItem>
                </UnorderedList>
              </StyledDetails>
            ),
            children: (
              <WinTypeValues
                label="Business success over the next 5 years"
                name="business_success_win"
                values={values}
              />
            ),
          }),
          ...(option.value === winTypes.ODI && {
            link: (
              <StyledDetails summary="What is an ODI?" data-test="odi-details">
                <p>
                  An ODI is a cross-border investment from the UK into another
                  country, where the source of the money is the UK.
                </p>
                <p>
                  The aim of the investment is to set up a lasting interest in a
                  company, where the investor has a genuine influence in the
                  management. This may involve providing capital for vehicles,
                  machinery, buildings, and running costs to:
                </p>
                <UnorderedList listStyleType="bullet">
                  <ListItem>set up an overseas subsidiary.</ListItem>
                  <ListItem>enter into a joint venture.</ListItem>
                  <ListItem>expand current overseas operations.</ListItem>
                </UnorderedList>
              </StyledDetails>
            ),
            children: (
              <WinTypeValues
                label="Outward Direct Investment over the next 5 years"
                name="odi_win"
                values={values}
              />
            ),
          }),
        }))}
      />

      {values?.win_type?.length > 1 && (
        <StyledExportTotal data-test="total-export-value">
          Total export value:{' '}
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
        hint="For instance 'shortbread biscuits'."
        placeholder="Enter a name for goods or services"
      />

      <ResourceOptionsField
        id="sector"
        name="sector"
        label="Sector"
        required="Enter a sector"
        resource={SectorResource}
        field={FieldTypeahead}
      />
    </Step>
  )
}

export default WinDetailsStep
