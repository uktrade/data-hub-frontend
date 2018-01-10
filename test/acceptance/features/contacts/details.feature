@contact-details  @details
Feature: Contact details

  @contact-details--documents-link
  Scenario: Contact has Documents link

    When I navigate to contact fixture Johnny Cakeman
    And I click the Documents local nav link
    Then view should contain the Documents link

  @contact-details--no-documents-link
  Scenario: Contact does not have Documents link

    When I navigate to contact fixture Georgina Clark
    And I click the Documents local nav link
    Then view should not contain the Documents link
