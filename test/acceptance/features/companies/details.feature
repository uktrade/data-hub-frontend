@companies-details
Feature: Company details

  @companies-details--cdms-reference
  Scenario: Company has CDMS reference

    When browsing to company fixture Venus Ltd
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Contacts                    |
      | Interactions                |
      | Export                      |
      | Investment                  |
      | Orders (OMIS)               |
      | Audit history               |
      | Documents                   |
    And the company details CDMS reference is displayed

  @companies-details--no-cdms-reference
  Scenario: Company does not have CDMS reference

    When browsing to company fixture Lambda plc
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Contacts                    |
      | Interactions                |
      | Export                      |
      | Investment                  |
      | Orders (OMIS)               |
      | Audit history               |
    And the company details CDMS reference is not displayed




