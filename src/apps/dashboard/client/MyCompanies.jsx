import React from 'react'
import { useMyCompaniesContext, MyCompaniesTile } from 'data-hub-components'

const MyCompanies = (props) =>
  <useMyCompaniesContext.Provider {...props}
    deleteListPropsAccessor={list =>
      ({ href: `/company-lists/${list.id}/delete` })
    }
    addInteractionPropsAccessor={company =>
      ({ href: `/companies/${company.id}/interactions/create` })
    }
  >
    <MyCompaniesTile />
  </useMyCompaniesContext.Provider>

export default MyCompanies
