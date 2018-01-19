@investment-projects-documents @details
Feature: Investment project documents

  @investment-projects-documents--document-link
  Scenario: Investment project has documents

    Given I navigate to investment project fixture New hotel (commitment to invest)
    When I click the Documents local nav link
    Then view should contain the Documents link

  @investment-projects-documents--no-document-link
  Scenario: Investment project does not have documents

    Given I navigate to investment project fixture New rollercoaster
    When I click the Documents local nav link
    Then view should not contain the Documents link

  @investment-projects-documents--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate directly to /documents of investment project fixture New zoo (LEP)
    Then I see the 403 error page

  @investment-projects-documents--da @da
  Scenario: Navigate to documents as DA

    When I navigate directly to /documents of investment project fixture New golf course (DA)
    Then I see the 403 error page
