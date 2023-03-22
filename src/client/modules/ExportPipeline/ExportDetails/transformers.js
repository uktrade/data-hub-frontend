export const transformNameIdToValueLabel = (value) => {
  if (value) {
    const { id, name } = value
    return {
      value: id,
      label: name,
    }
  }
  return null
}
const transformExportPipelineDetails = ({
  id,
  owner,
  team_members,
  contacts,
  destination_country,
  sector,
  exporter_experience,
  title,
  estimated_export_value_amount,
  estimated_win_date,
  export_potential,
  notes,
  company,
  status,
}) => ({
  id,
  owner: owner.name,
  teamMembers: team_members?.map(transformNameIdToValueLabel),
  contacts: contacts?.map(transformNameIdToValueLabel),
  destination: destination_country.name,
  sector: sector.name,
  exporterExperience: exporter_experience.name,
  title,
  estimatedExportValueAmount: estimated_export_value_amount,
  estimatedWinDate: estimated_win_date,
  exportPotential: export_potential,
  notes,
  company: company.name,
  status,
})

export { transformExportPipelineDetails }
