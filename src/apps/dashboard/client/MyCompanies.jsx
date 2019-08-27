import React from 'react'
import { useMyCompaniesContext, MyCompaniesTile } from 'data-hub-components'

const MyCompanies = () => (
  <useMyCompaniesContext.Provider>
    <MyCompaniesTile />
  </useMyCompaniesContext.Provider>
)

export default MyCompanies
