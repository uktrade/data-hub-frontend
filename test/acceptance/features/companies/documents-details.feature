@companies-documents-details @details
Feature: Company documents

  @companies-documents-details--has-documents
  Scenario: Company has documents

    When browsing to company fixture Venus Ltd
    When I click the Documents local nav link
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
    Then view should contain the Documents link

  @companies-documents-details--no-documents
  Scenario: Company does not have documents

    When browsing to company fixture Lambda plc
    When I click the Documents local nav link
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
    Then view should not contain the Documents link
