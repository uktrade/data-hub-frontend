@companies-details @details
Feature: Company details

  @companies-details--cdms-reference
  Scenario: Company has CDMS reference

    When browsing to company fixture Venus Ltd
    Then there should be a local nav
      | text                      |
      | Details                   |
      | Contacts                  |
      | Interactions              |
      | Export                    |
      | Investment                |
      | Orders (OMIS)             |
      | Audit history             |
      | Documents                 |
    And the Company summary details are displayed
      | key                       | value                   |
      | Business type             | company.businessType    |
      | Primary address           | company.primaryAddress  |
      | UK region                 | company.ukRegion        |
      | Headquarters              | company.headquarterType |
      | Sector                    | company.sector          |
      | Business description      | company.description     |
      | CDMS reference            | company.referenceCode   |
    When I click the Documents local nav link
    Then view should contain the Documents link

  @companies-details--no-cdms-reference
  Scenario: Company does not have CDMS reference

    When browsing to company fixture Lambda plc
    Then there should be a local nav
      | text                      |
      | Details                   |
      | Contacts                  |
      | Interactions              |
      | Export                    |
      | Investment                |
      | Orders (OMIS)             |
      | Audit history             |
      | Documents                 |
    And the Company summary details are displayed
      | key                       | value                     |
      | Business type             | company.businessType      |
      | Primary address           | company.primaryAddress    |
      | Headquarters              | company.headquarterType   |
      | Sector                    | company.sector            |
      | Business description      | company.description       |
      | Number of employees       | company.employeeRange     |
      | Annual turnover           | company.turnoverRange     |
      | Country                   | company.country           |
    When I click the Documents local nav link
    Then view should not contain the Documents link




