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
        teamType: values[`team_type_${index}`],
        hqTeamRegionOrPost: values[`hq_team_region_or_post_${index}`],
      }
    })

export const transformGoodsAndServices = (goodsAndServices = []) =>
  goodsAndServices.map((gas) => ({
    label: gas,
  }))

export const transformCustomerConfidential = (confidential = []) =>
  isEmpty(confidential) ? 'No' : 'Yes'

/**
 * @description Filters the keys on the values object and returns an array of objects matching the key.
 * @param {Object} values - the values object containing keys and values.
 * @param {String} key - the key to filter on.
 * @returns an array of objects matching the keys.
 * @example
 * From values object:
 *  {
 *    ...
 *    "campaign_0": {
 *      "value": "a28a21c8-63be-4ac9-99ba-0fe3bbfb5e0b",
 *      "label": "British Business Network"
 *    },
 *    "campaign_1": {
 *      "value": "f860195f-7ebe-4cc9-b553-c19adf576106",
 *      "label": "GCP - RBS"
 *    },
 *    "campaign_2": {
 *      "value": "b6f5c31a-aa45-4ae0-89bd-2eb3ab943f76",
 *      "label": "Afterburner"
 *    },
 *    ...
 *  }
 * To an array of objects that matches the key:
 * [
 *   {
 *      value: "a28a21c8-63be-4ac9-99ba-0fe3bbfb5e0b",
 *      label: "British Business Network"
 *   },
 *   {
 *      value: "f860195f-7ebe-4cc9-b553-c19adf576106",
 *      label: "GCP - RBS"
 *   },
 *   {
 *      value: "b6f5c31a-aa45-4ae0-89bd-2eb3ab943f76",
 *      label: "Afterburner"
 *   },
 * ]
 */

export const transformKeyValuePairToList = (values, key) =>
  Object.keys(values)
    .filter((k) => k.startsWith(key))
    .map((key) => ({
      ...values[key],
    }))
