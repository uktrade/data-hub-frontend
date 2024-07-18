import React from 'react'
import { Button, H2, InsetText, Table } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import {
  AdviserResource,
  CompanyResource,
  InvestmentResource,
} from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { BLACK, GREY_3 } from '../../../../utils/colours'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'

const checkIfAdvisersAreSet = (adviser1, adviser2) => adviser1 || adviser2

const getTeamMemberTeam = (id) => (
  <AdviserResource id={id}>
    {(adviser) => adviser.ditTeam?.name}
  </AdviserResource>
)

const ProjectTeam = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },

        { text: 'Project team' },
      ]}
      pageTitle="Project team"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <CompanyResource id={project.investorCompany.id}>
            {(company) => (
              <>
                <H2 size={LEVEL_SIZE[3]} data-test="crm-heading">
                  Client relationship management
                </H2>
                {checkIfAdvisersAreSet(
                  project.clientRelationshipManager,
                  company.oneListGroupGlobalAccountManager
                ) ? (
                  <>
                    <Table data-test="crm-table">
                      <Table.Row>
                        <Table.CellHeader>Role</Table.CellHeader>
                        <Table.CellHeader>Adviser</Table.CellHeader>
                        <Table.CellHeader>Team</Table.CellHeader>
                      </Table.Row>
                      {project.clientRelationshipManager && (
                        <Table.Row>
                          <Table.Cell>Client Relationship Manager</Table.Cell>
                          <Table.Cell>
                            {project.clientRelationshipManager.name}
                          </Table.Cell>
                          <Table.Cell>
                            {project.clientRelationshipManagerTeam
                              ? project.clientRelationshipManagerTeam.name
                              : ''}
                          </Table.Cell>
                        </Table.Row>
                      )}
                      {company.oneListGroupGlobalAccountManager && (
                        <Table.Row>
                          <Table.Cell>Global Account Manager</Table.Cell>
                          <Table.Cell>
                            {company.oneListGroupGlobalAccountManager.name}
                          </Table.Cell>
                          <Table.Cell>
                            {company.oneListGroupGlobalAccountManager.ditTeam
                              ? company.oneListGroupGlobalAccountManager.ditTeam
                                  .name
                              : ''}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table>
                    <Button
                      as={'a'}
                      href={urls.investments.projects.clientRelationshipManagement(
                        project.id
                      )}
                      buttonColour={GREY_3}
                      buttonTextColour={BLACK}
                      data-test="edit-crm-button"
                    >
                      Change
                    </Button>
                  </>
                ) : (
                  <Button
                    as={'a'}
                    href={urls.investments.projects.clientRelationshipManagement(
                      project.id
                    )}
                    data-test="add-crm-button"
                  >
                    Assign
                  </Button>
                )}
                <H2 size={LEVEL_SIZE[3]} data-test="pm-heading">
                  Project management
                </H2>
                {checkIfAdvisersAreSet(
                  project.projectManager,
                  project.projectAssuranceAdviser
                ) ? (
                  <>
                    <Table data-test="pm-table">
                      <Table.Row>
                        <Table.CellHeader>Role</Table.CellHeader>
                        <Table.CellHeader>Adviser</Table.CellHeader>
                        <Table.CellHeader>Team</Table.CellHeader>
                      </Table.Row>
                      {project.projectAssuranceAdviser && (
                        <Table.Row>
                          <Table.Cell>Project Assurance Adviser</Table.Cell>
                          <Table.Cell>
                            {project.projectAssuranceAdviser.name}
                          </Table.Cell>
                          <Table.Cell>
                            {project.projectAssuranceTeam
                              ? project.projectAssuranceTeam.name
                              : ''}
                          </Table.Cell>
                        </Table.Row>
                      )}
                      {project.projectManager && (
                        <Table.Row>
                          <Table.Cell>Project Manager</Table.Cell>
                          <Table.Cell>{project.projectManager.name}</Table.Cell>
                          <Table.Cell>
                            {project.projectManagerTeam
                              ? project.projectManagerTeam.name
                              : ''}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table>
                    <Button
                      as={'a'}
                      href={urls.investments.projects.editProjectManagement(
                        project.id
                      )}
                      buttonColour={GREY_3}
                      buttonTextColour={BLACK}
                      data-test="edit-pm-button"
                    >
                      Change
                    </Button>
                  </>
                ) : (
                  <>
                    {project.stage.name === 'Prospect' ? (
                      <InsetText data-test="pm-prospect-inset">
                        Will be assigned during the Assign PM stage.
                      </InsetText>
                    ) : (
                      <>
                        <InsetText data-test="pm-inset">
                          Once both a Project Manager and a Project Assurance
                          Adviser have been assigned, the project will move to
                          the Active stage.
                        </InsetText>
                        <Button
                          as={'a'}
                          href={urls.investments.projects.editProjectManagement(
                            project.id
                          )}
                          data-test="add-pm-button"
                        >
                          Assign
                        </Button>
                      </>
                    )}
                  </>
                )}
                <H2 size={LEVEL_SIZE[3]} data-test="team-heading">
                  Project specialist and team members
                </H2>
                {project.teamMembers?.length > 0 ? (
                  <>
                    <Table data-test="team-table">
                      <Table.Row>
                        <Table.CellHeader>Role</Table.CellHeader>
                        <Table.CellHeader>Adviser</Table.CellHeader>
                        <Table.CellHeader>Team</Table.CellHeader>
                      </Table.Row>
                      {project.teamMembers.map((member) => {
                        const adviserTeam = getTeamMemberTeam(member.adviser.id)
                        return (
                          <Table.Row key={member.adviser.id}>
                            <Table.Cell>{member.role}</Table.Cell>
                            <Table.Cell>{member.adviser.name}</Table.Cell>
                            <Table.Cell>{adviserTeam}</Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table>
                    <Button
                      as={'a'}
                      href={urls.investments.projects.editTeamMembers(
                        project.id
                      )}
                      buttonColour={GREY_3}
                      buttonTextColour={BLACK}
                      data-test="edit-team-button"
                    >
                      Change
                    </Button>
                  </>
                ) : (
                  <Button
                    as={'a'}
                    href={urls.investments.projects.editTeamMembers(project.id)}
                    data-test="add-team-button"
                  >
                    Assign
                  </Button>
                )}
              </>
            )}
          </CompanyResource>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default ProjectTeam
