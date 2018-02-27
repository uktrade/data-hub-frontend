@contact-documents  @details
Feature: Contact details

  @contact-documents--link
  Scenario: Contact has Documents link

    When I navigate to the `contacts.Fixture` page using `contact` `Johnny Cakeman` fixture
    And I click the Documents local nav link
    Then view should contain the Documents link

  @contact-documents--no-documents-link
  Scenario: Contact does not have Documents link

    When I navigate to the `contacts.Fixture` page using `contact` `Georgina Clark` fixture
    And I click the Documents local nav link
    Then view should not contain the Documents link

  @contact-documents--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate directly to /documents of contact fixture Johnny Cakeman
    Then I see the 403 error page

  @contact-documents--da @da
  Scenario: Navigate to documents as DA

    When I navigate directly to /documents of contact fixture Johnny Cakeman
    Then I see the 403 error page
