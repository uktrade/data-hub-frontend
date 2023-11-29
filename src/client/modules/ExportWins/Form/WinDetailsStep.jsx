import React from 'react'
import { Details, ListItem, UnorderedList } from 'govuk-react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import Label from '@govuk-react/label'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { useFormContext } from '../../../../client/components/Form/hooks'
import CountriesResource from '../../../components/Resource/Countries'
import { currencyGBP } from '../../../../client/utils/number-utils'
import { idNameToValueLabel } from '../../../../client/utils'
import {
  LIGHT_GREY,
  DARK_GREY,
  BLACK,
  WHITE,
} from '../../../../client/utils/colours'
import {
  getFinancialYearStart,
  generateFinancialYearLabel,
} from '../../../../client/utils/date'
import {
  ExportResource,
  SectorResource,
  ExportWinsResource,
} from '../../../components/Resource'
import {
  Step,
  FieldDate,
  FieldInput,
  FieldTextarea,
  FieldCurrency,
  FieldTypeahead,
  FieldCheckboxes,
} from '../../../components'
import {
  steps,
  winTypeOptions,
  goodsServicesOptions,
  winTypes,
} from './constants'

const MAX_WORDS = 100

const WinTypeContainer = styled('div')({
  marginLeft: 56,
})

const FieldCurrencyContainer = styled('div')({
  display: 'flex',
  gap: 5,
})

const StyledLabel = styled(Label)({
  fontWeight: 'bold',
})

const StyledParagraph = styled('p')({
  padding: 10,
  fontWeight: 'bold',
  backgroundColor: LIGHT_GREY,
})

const StyledHintParagraph = styled('p')({
  color: DARK_GREY,
})

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
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

  return (
    <Step name={steps.WIN_DETAILS}>
      <H3>Win details</H3>
      <StyledHintParagraph>
        The customer will be asked to confirm this infomation.
      </StyledHintParagraph>
      {queryParams.export && (
        <PrepopulateFormFieldsFromExportProject
          id={queryParams.export}
          values={values}
        />
      )}
      {queryParams.exportwin && (
        <PrepopulateFormFieldsFromExportWin
          id={queryParams.exportwin}
          values={values}
        />
      )}
      {!queryParams.export && !queryParams.exportwin && (
        <FormFields values={values} />
      )}
    </Step>
  )
}

const calculateSumFromValues = (name, values) =>
  Object.keys(values)
    .filter((key) => key.startsWith(name))
    .reduce(
      (accumulator, currentValue) => accumulator + Number(values[currentValue]),
      0
    )

const sumWinTypeValues = (winTypes, values) =>
  winTypes.reduce(
    (accumulator, currentValue) =>
      accumulator + calculateSumFromValues(`${currentValue}_`, values),
    0
  )

const formatSum = (sum) => currencyGBP(sum)

const WinTypeValues = ({ label, name, values }) => {
  const financialYearStart = getFinancialYearStart(new Date())
  const years = 5
  return (
    <WinTypeContainer>
      <StyledLabel>{label}</StyledLabel>
      <StyledHintParagraph>(round to nearest £)</StyledHintParagraph>
      <FieldCurrencyContainer>
        {[...Array(years).keys()].map((index) => (
          <FieldCurrency
            type="text"
            name={`${name}${index}`}
            index={`${name}${index}`}
            label={generateFinancialYearLabel(financialYearStart + index, '/')}
            boldLabel={true}
          />
        ))}
      </FieldCurrencyContainer>
      <StyledParagraph>
        Totalling over 5 years:{' '}
        {formatSum(calculateSumFromValues(name, values))}
      </StyledParagraph>
    </WinTypeContainer>
  )
}

const FormFields = ({
  destinationCountry,
  winDate,
  summaryOfSupport,
  businessType,
  values,
}) => (
  <>
    <ResourceOptionsField
      id="destination-country"
      name="destination_country"
      label="Destination country"
      required="Choose a destination country"
      resource={CountriesResource}
      field={FieldTypeahead}
      initialValue={values.destination_country || destinationCountry}
    />
    <FieldDate
      name="win_date"
      format="short"
      label="Date won"
      hint="For example 06 2023, date of win must be in the last 12 months."
      required="Enter the win date"
      invalid="Enter a valid date"
      initialValue={values.win_date || winDate}
    />
    <FieldTextarea
      name="summary_of_support"
      label="Summary of the support given"
      hint="Outline what had the most impact or would be memorable to the customer in less than 100 words."
      required="Enter a summary"
      invalid={`Summary must be ${MAX_WORDS} words or less`}
      maxWords={MAX_WORDS}
      initialValue={values.summary_of_support || summaryOfSupport}
    />

    {/* 
        Overseas customer (input + checkbox) to go here when we have ACs,
        the API only has one field defined: name_of_customer
    */}

    <FieldInput
      type="text"
      name="business_type"
      label="Type of business deal"
      required="Enter the type of business deal"
      hint="For example: export sales, contract, order, distributor, tender / competition win, joint venture, outward investment."
      initialValue={values.business_type || businessType}
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
              name="export_"
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
                  the exchange of ownership of goods/services from a subsidiary
                  of an eligible UK company to a non_UK resident.
                </ListItem>
                <ListItem>
                  in financial services, the value of assets under management or
                  the value of a listing.
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
              name="business_success_"
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
              name="odi_"
              values={values}
            />
          ),
        }),
      }))}
    />

    {values?.win_type?.length > 1 && (
      <StyledExportTotal>
        Total export value:{' '}
        {formatSum(sumWinTypeValues(values?.win_type, values))}
      </StyledExportTotal>
    )}

    <FieldCheckboxes
      name="goods_and_services"
      legend="What does the value relate to?"
      hint="Select all that apply"
      required="Select at least one option"
      options={goodsServicesOptions}
    />

    <FieldInput
      type="text"
      name="goods_and_services_name"
      label="Name of goods or services"
      required="Enter the name of goods or services"
      hint="For instance `shortbread biscuits`"
      placeholder="Enter a name for goods or services"
    />

    <ResourceOptionsField
      name="sector"
      label="Sector"
      required="Enter a sector"
      resource={SectorResource}
      field={FieldTypeahead}
    />
  </>
)

const PrepopulateFormFieldsFromExportProject = ({ id, values }) => (
  <ExportResource id={id}>
    {(exportProject) => (
      <FormFields
        destinationCountry={idNameToValueLabel(
          exportProject.destinationCountry
        )}
        // The ACs state to use the estimated win date to pre-populate the win date.
        // I have questioned this as they could very easily be two different dates.
        winDate={exportProject.estimated_win_date}
        exportProject={exportProject}
        values={values}
      />
    )}
  </ExportResource>
)

const PrepopulateFormFieldsFromExportWin = ({ id, values }) => (
  <ExportWinsResource id={id}>
    {(exportWin) => (
      <FormFields
        destinationCountry={idNameToValueLabel(exportWin.country)}
        winDate={exportWin.date}
        summaryOfSupport={exportWin.description}
        nameOfCustomer={exportWin.name_of_customer}
        values={values}
      />
    )}
  </ExportWinsResource>
)

export default WinDetailsStep
