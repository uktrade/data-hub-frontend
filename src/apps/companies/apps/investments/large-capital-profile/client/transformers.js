export const transformValueToId = (values = []) => {
  return values.map((value) => ({ id: value.value }))
}

export const transformLocationDetailsToApi = ({
  profileId,
  companyId,
  values,
}) => {
  const {
    uk_region_locations,
    other_countries_being_considered,
    notes_on_locations,
  } = values
  return {
    id: profileId,
    investor_company_id: companyId,
    uk_region_locations: transformValueToId(uk_region_locations),
    other_countries_being_considered: transformValueToId(
      other_countries_being_considered
    ),
    notes_on_locations,
  }
}
