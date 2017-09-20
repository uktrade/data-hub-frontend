@interaction-create
Feature: Create New Interaction
  As an existing user
  I would like to create a new Interaction for a company

  Background:
    Given I am an authenticated user on the data hub website

  @interaction-create-verify-add
  Scenario: Verify Add Interaction option

    When I navigate to Interactions page of any company
    Then I verify an option to add a new Interaction
    And I logout of Data Hub website

  @interaction-create-add-business-card
  Scenario: Add a Business card Interaction

    When I add a new Business card interaction
    Then I see the edit interaction button to confirm successful adding
    And I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-email-website
  Scenario: Add a Email/Website Interaction

    When I add a new Email-Website interaction
    Then I see the edit interaction button to confirm successful adding
    And I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-face-to-face
  Scenario: Add a Face to face Interaction

    When I add a new Face to face interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-fax
  Scenario: Add a Fax Interaction

    When I add a new Fax interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-letter-fax
  Scenario: Add a Letter/Fax Interaction

    When I add a new Letter-Fax interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-sms
  Scenario: Add a SMS Interaction

    When I add a new SMS interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-media
  Scenario: Add a Social Media Interaction

    When I add a new Social Media interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-telephone
  Scenario: Add a Telephone Interaction

    When I add a new Telephone interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-telex
  Scenario: Add a Telex Interaction

    When I add a new Telex interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-ukti-website
  Scenario: Add a UKTI Website Interaction

    When I add a new UKTI Website interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-undefined
  Scenario: Add a Undefined Interaction

    When I add a new Undefined interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-add-teleconf
  Scenario: Add a Video/Teleconf Interaction

    When I add a new Video-Teleconf interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction in company profile
    And I logout of Data Hub website

  @interaction-create-verify-add-on-search-landing
  Scenario: Verify newly added Interaction under search landing page

    When I add a new Business card interaction
    Then I see the edit interaction button to confirm successful adding
    Then I verify my newly added Interaction under search landing page
    And I logout of Data Hub website
