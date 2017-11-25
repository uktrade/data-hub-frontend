@investment-projects-details  @details
Feature: Investment project details

  @investment-projects-details--documents-link
  Scenario: Investment project has Documents link

    When browsing to investment project fixture New hotel (commitment to invest)
    Then there should be a local nav
      | text                        |
      | Project details             |
      | Project team                |
      | Interactions                |
      | Evaluations                 |
      | Audit history               |
      | Documents                   |
    When I click the Documents local nav link
    Then view should contain the Documents link

  @investment-projects-details--no-documents-link
  Scenario: Investment project does not have Documents link

    When browsing to investment project fixture New rollercoaster
    Then there should be a local nav
      | text                        |
      | Project details             |
      | Project team                |
      | Interactions                |
      | Evaluations                 |
      | Audit history               |
      | Documents                   |
    When I click the Documents local nav link
    And view should not contain the Documents link
