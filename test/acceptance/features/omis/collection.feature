@omis-collection
Feature: OMIS collection

  @omis-collection--lep @lep
  Scenario: Navigate to OMIS shows 403 for LEPs

    Given I navigate directly to /omis
    Then I see the 403 error page
