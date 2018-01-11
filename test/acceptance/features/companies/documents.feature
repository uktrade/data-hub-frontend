@companies-documents @details
Feature: Company documents

  @companies-documents--document-link
  Scenario: Company has documents

    Given I navigate to company fixture Venus Ltd
    When I click the Documents local nav link
    Then view should contain the Documents link

  @companies-documents--no-document-link
  Scenario: Company does not have documents

    Given I navigate to company fixture Lambda plc
    When I click the Documents local nav link
    Then view should not contain the Documents link

  @companies-documents--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate directly to /documents of company fixture Lambda plc
    Then I see the 403 error page

  @companies-documents--da @da
  Scenario: Navigate to documents as DA

    When I navigate directly to /documents of company fixture Lambda plc
    Then I see the 403 error page
