@contacts-save
Feature: Create New Contact
  As a data hub user
  I would like to add a contact to data hub
  So that I can collect contact data

  Background:
    Given I am an authenticated user on the data hub website

  @contacts-save--primary
  Scenario: Add a new primary contact

    And a company is created for contacts
    When navigating to the company contacts
    And a primary contact is added
    Then I see the success message
    When navigating to the company contacts
    Then the contact is displayed on the company contact tab
    When the contact is clicked
    Then the contact details are displayed

  @contacts-save--primary-new-company-address @ignore
  Scenario: Add a new primary contact with new company address

    And a company is created for contacts
    When navigating to the company contacts
    And a primary contact with new company address is added
    Then I see the success message
    When navigating to the company contacts
    Then the contact is displayed on the company contact tab

  @contacts-save--non-primary
  Scenario: Add a new non-primary contact

    And a company is created for contacts
    When navigating to the company contacts
    And a non-primary contact is added
    Then I see the success message
    When navigating to the company contacts
    Then the contact is displayed on the company contact tab
    When the contact is clicked
    Then the contact details are displayed

  @contacts-save--primary-dashboard
  Scenario: New primary contact is visible on the dashboard

    And a company is created for contacts
    When navigating to the company contacts
    And a primary contact is added
    Then I see the success message
    When I navigate to the dashboard
    Then the contact is displayed on the dashboard

  @contacts-save--mandatory-fields
  Scenario: Contact fields are mandatory

    And a company is created for contacts
    When navigating to the company contacts
    And the add new contact button is clicked
    And the save button is clicked
    Then the contact fields have error messages
    And I see form error summary
