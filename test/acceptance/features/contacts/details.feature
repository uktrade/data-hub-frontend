@contact-details  @details
Feature: Contact details

  @contact-details--documents-link
  Scenario: Contact has Documents link

    When browsing to contact fixture Johnny Cakeman
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Interactions                |
      | Audit history               |
      | Documents                   |
    When I click the Documents local nav link
    Then view should contain the Documents link

  @contact-details--no-documents-link
  Scenario: Contact does not have Documents link

    When browsing to contact fixture Georgina Clark
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Interactions                |
      | Audit history               |
      | Documents                   |
    When I click the Documents local nav link
    And view should not contain the Documents link
