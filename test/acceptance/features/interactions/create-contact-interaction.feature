@create-contact-interaction
Feature: Create New Contact Interaction
  As an existing user
  I would like to create a new Interaction for a company contact

  Background:
    Given I am an authenticated user on the data hub website
    And I navigate to contact interactions

  @create-contact-interaction--verify-add
  Scenario: Verify Add interaction option
    Then I see a button to "Add interaction"

  @create-contact-interaction--verify-defaults
  Scenario: Verify the form set the correct default when loaded
    And I click on the "Add interaction" button
    Then company name is displayed
    And the "contact" form field should have the contact selected
    And the "dit_adviser" form field should have the value "QA"
