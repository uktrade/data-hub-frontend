import { transformIdNameToValueLabel } from '../../../../client/transformers/index'

const transformExportPipelineDetails = ({
  id,
  owner,
  team_members,
  contacts,
  destination_country,
  sector,
  exporter_experience,
  estimated_export_value_years,
  title,
  estimated_export_value_amount,
  estimated_win_date,
  export_potential,
  notes,
  company,
  status,
}) => ({
  id,
  owner: owner,
  teamMembers: team_members?.map(transformIdNameToValueLabel),
  contacts: contacts?.map(transformIdNameToValueLabel),
  destinationCountry: destination_country,
  sector: sector,
  exporterExperience: exporter_experience?.name,
  exportYears: estimated_export_value_years?.name,
  title,
  estimatedExportValueAmount: estimated_export_value_amount,
  estimatedWinDate: estimated_win_date,
  exportPotential: export_potential,
  notes,
  company,
  status,
})

export { transformExportPipelineDetails }
