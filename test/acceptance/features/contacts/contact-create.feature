@contact-create
Feature: Create New Contact
  As an existing user
  I would like to create a new contact for a company

  Background:
    Given I am an authenticated user on the data hub website

  @contact-create-option
  Scenario: Verify Add new Contact option

    When I navigate to Contacts page of any company
    Then I verify an option to add a new contact
    And I logout of Data Hub website

  @contact-create-primary
  Scenario: Add a new Primary Contact

    When I add a new Primary Contact
    Then I see the Added new contact confirmation message
    And I verify my newly added contact in company profile
    And I logout of Data Hub website

  @contact-create-primary-new-company-address
  Scenario: Add a new Primary Contact with new Company address

    When I add a new Primary Contact with a new company address
    Then I see the Added new contact confirmation message
    And I verify my newly added contact in company profile
    And I logout of Data Hub website

  @contact-create-non-primary
  Scenario: Add a new non-Primary Contact

    When I add a new non Primary Contact
    Then I see the Added new contact confirmation message
    And I verify my newly added contact in company profile
    And I logout of Data Hub website

  @contact-create-verify
  Scenario: Verify newly added contact under search landing page
    When I add a new Primary Contact
    Then I see the Added new contact confirmation message
    And I verify my newly added contact under search landing page
    And I logout of Data Hub website
