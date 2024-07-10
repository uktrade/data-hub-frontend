export function getCompanyId(baseURL:string):string {
  // Returns an id of a company in the database
  if (baseURL == 'https://datahub.prod.uktrade.digital') {
    // Company in DB with Company Tree
    return 'eca13ac7-a098-e211-a939-e4115bead28a'
  }
  // One list corp
  return '375094ac-f79a-43e5-9c88-059a7caa17f0'
}
