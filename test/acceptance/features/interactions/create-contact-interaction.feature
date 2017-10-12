@create-contact-interaction
Feature: Create New Contact Interaction
  As an existing user
  I would like to create a new Interaction for a company contact

  Background:
    Given I am an authenticated user on the data hub website
    And There is a UK ltd company named "Freds" with a contact named "Fred Smith"
    And I view the interactions for "Fred Smith" at "Freds"

  @create-contact-interaction--verify-add
  Scenario: Verify Add interaction option
    Then I see a button to "Add interaction"

  @create-contact-interaction--verify-defaults
  Scenario: Verify the form set the correct default when loaded
    And I click on the "Add interaction" button
    Then details view data for "Company" should contain "Freds"
    And the "contact" form field should have the value "Fred Smith"
    And the "dit_adviser" form field should have the value "QA"
