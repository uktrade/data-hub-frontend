import { isEmpty } from 'lodash'

export const transformTeamsAndAdvisers = (values) =>
  Object.keys(values)
    .filter((key) => key.startsWith('contributing_officer_'))
    .map((key) => {
      // We can't use the map index here as the user may delete one of the
      // items out of sequence. The FieldAddAnother component doesn't reindex
      // after a delete so we have to go by the digit at the very end of the key
      const index = key[key.length - 1]
      return {
        officer: values[`contributing_officer_${index}`]?.label,
        teamType: values[`team_type_${index}`].label,
        hqTeamRegionOrPost: values[`hq_team_region_or_post_${index}`].label,
      }
    })

export const transformGoodsAndServices = (goodsAndServices = []) =>
  goodsAndServices.map((gas) => ({
    label: gas,
  }))

export const transformCustomerConfidential = (confidential = []) =>
  isEmpty(confidential) ? 'No' : 'Yes'
