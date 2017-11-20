@companies-details
Feature: Company details

  @companies-details--cdms-reference
  Scenario: Company has CDMS reference

    When browsing to company fixture Venus Ltd
    Then the company details CDMS reference is displayed

  @companies-details--no-cdms-reference
  Scenario: Company does not have CDMS reference

    When browsing to company fixture Lambda plc
    Then the company details CDMS reference is not displayed




