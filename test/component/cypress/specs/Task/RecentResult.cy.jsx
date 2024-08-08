import React from 'react'

import RecentResult from '../../../../../src/client/components/Task/RecentResult'
import Task from '../../../../../src/client/components/Task'

describe('Task/RecentResult', () => {
  it('Should provide most recent result of a given task', () => {
    const TASK_CALLS = [
      {
        name: 'double',
        id: 'aaa',
        payload: 1,
        expectedResult: 2,
      },
      {
        name: 'double',
        id: 'bbb',
        payload: 3,
        expectedResult: 6,
      },
      {
        name: 'plusMillion',
        id: 'aaa',
        payload: 1,
        expectedResult: 1_000_001,
      },
      {
        name: 'double',
        id: 'aaa',
        payload: 10,
        expectedResult: 20,
      },
      {
        name: 'plusMillion',
        id: 'bbb',
        payload: 111,
        expectedResult: 1_000_111,
      },
      {
        name: 'double',
        id: 'bbb',
        payload: 444,
        expectedResult: 888,
      },
      {
        name: 'plusMillion',
        id: 'aaa',
        payload: 222,
        expectedResult: 1_000_222,
      },
    ]

    const TASKS = TASK_CALLS.reduce(
      (a, { name, id }) => ({
        ...a,
        [`${name}-${id}`]: { name, id },
      }),
      {}
    )

    cy.mountWithProvider(
      <>
        <Task>
          {(t) => (
            // A utility to start tasks
            <form
              onSubmit={(e) => {
                e.preventDefault()
                t(e.target.taskName.value, e.target.taskId.value).start({
                  payload: parseInt(e.target.payload.value, 10),
                  onSuccessDispatch: `ACTION_NAME-${Math.random()}`,
                })
              }}
            >
              <input name="taskName" placeholder="name" />
              <input name="taskId" placeholder="id" />
              <input name="payload" placeholder="payload" />
              <button>Start task</button>
            </form>
          )}
        </Task>
        {/* Render most recent result of each task */}
        <ul>
          {Object.entries(TASKS).map(([key, { name, id }]) => (
            <li key={key}>
              {key}:{' '}
              <RecentResult name={name} id={id}>
                {(result) => (
                  <span id={`result-${key}`}>{result || 'nothing'}</span>
                )}
              </RecentResult>
            </li>
          ))}
        </ul>
      </>,
      {
        tasks: {
          double: (payload) => payload * 2,
          plusMillion: (payload) => payload + 1_000_000,
        },
      }
    )

    TASK_CALLS.forEach(({ name, id, payload, expectedResult }) => {
      cy.get('input[name="taskName"]').clear().type(name)
      cy.get('input[name="taskId"]').clear().type(id)
      cy.get('input[name="payload"]').clear().type(payload)
      cy.get('button').click()
      cy.contains(`${name}-${id}: ${expectedResult}`)
    })
  })
})
