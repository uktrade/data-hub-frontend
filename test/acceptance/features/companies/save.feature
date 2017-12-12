@companies-save
Feature: Create a new company
  As an existing user
  I would like to create a new company in various locations

  @companies-save--uk-private-or-public-ltd-company
  Scenario: Create a UK private or public limited company

    When a "UK private or public limited company" is created
    Then I see the success message
    And the company trading name is in the search results
    When the first search result is clicked
    Then the Company summary details are displayed
      | key                   | value                   |
      | Business type         | company.businessType    |
      | Primary address       | company.primaryAddress  |
      | UK region             | company.ukRegion        |
      | Headquarters          | company.headquarterType |
      | Sector                | company.sector          |
      | Website               | company.website         |
      | Business description  | company.description     |
      | Number of employees   | company.employeeRange   |
      | Annual turnover       | company.turnoverRange   |

  @companies-save--uk-non-private-or-non-public-ltd-company
  Scenario: Create a UK non-private or non-public limited company

    When a "UK non-private or non-public limited company" is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Company summary details are displayed
      | key                   | value                   |
      | Business type         | company.businessType    |
      | Primary address       | company.primaryAddress  |
      | UK region             | company.ukRegion        |
      | Headquarters          | company.headquarterType |
      | Sector                | company.sector          |
      | Website               | company.website         |
      | Business description  | company.description     |
      | Number of employees   | company.employeeRange   |
      | Annual turnover       | company.turnoverRange   |

  @companies-save--foreign
  Scenario: Create a foreign company

    When a new "Foreign company" is created
    Then I see the success message
    And the company is in the search results
    When the first search result is clicked
    Then the Company summary details are displayed
      | key                   | value                            |
      | Business type         | company.businessType             |
      | Primary address       | company.primaryAddress           |
      | Headquarters          | company.headquarterType          |
      | Sector                | company.sector                   |
      | Website               | company.website                  |
      | Business description  | company.description              |
      | Number of employees   | company.employeeRange            |
      | Annual turnover       | company.turnoverRange            |
      | Country               | company.registeredAddressCountry |
