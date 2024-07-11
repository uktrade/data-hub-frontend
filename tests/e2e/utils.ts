export const BASE_URLS = {
  LOCALHOST: 'http://127.0.0.1:3000',
  DEV: 'https://dev.datahub.uktrade.digital',
  STAGING: 'https://staging.datahub.uktrade.digital',
  UAT: 'https://uat.datahub.uktrade.digital',
  TEMP_PROD: 'https://datahub.prod.uktrade.digital',
  PROD: 'https://www.datahub.trade.gov.uk',
};

export function getCompanyId(baseURL:string):string {
  // Returns an id of a company in the database
  if (baseURL == BASE_URLS.TEMP_PROD || baseURL == BASE_URLS.PROD) {
    // Company in DB with Company Tree
    return 'eca13ac7-a098-e211-a939-e4115bead28a'
  }
  // One list corp
  return '375094ac-f79a-43e5-9c88-059a7caa17f0'
}
