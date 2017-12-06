@companies-details @details
Feature: Company details

  @companies-details--cdms-reference
  Scenario: Company has CDMS reference

    Given I navigate to company fixture Venus Ltd
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
    And the Account management details are displayed
      | key                       | value                   |
      | One List tier             | None                    |
      | One List account manager  | None                    |

  @companies-details--no-cdms-reference
  Scenario: Company does not have CDMS reference

    Given I navigate to company fixture Lambda plc
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
    And the Account management details are displayed
      | key                       | value                   |
      | One List tier             | None                    |
      | One List account manager  | None                    |
