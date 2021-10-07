/* eslint-disable prettier/prettier */
import React from 'react'
import { Link, Route } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import TabNav from '../../TabNav'
import Contact from '../Contact'
import Company from '../Company'
import Resource from '..'
import {
  ActionResource,
  ActionsResource,
  EntityResource,
  CreateEntityResource,
  RoutedCRUDResource,
} from '..'

const Json = ({ children }) => <pre>{JSON.stringify(children, null, 2)}</pre>

const Foo = {
  bar: () => <pre>bar</pre>,
  $baz: (props) => <pre>{JSON.stringify(props, null, 2)}</pre>,
}

const Box = ({ children }) => (
  <div style={{ padding: '1rem', border: '1px solid grey' }}>{children}</div>
)

const A = ({ children, x }) => (
  <Box>
    AAA
    {children}
  </Box>
)

const B = ({ children, x }) => (
  <Box>
    BBB
    {children}
  </Box>
)

const C = ({ children, x }) => (
  <Box>
    CCC
    {children}
  </Box>
)

const SimpleCompose = ({ components, ...props }) => {
  const Res = Object.entries(components).reduce(
    (Acc, [name, Component]) =>
      ({ children }) =>
        (
          <Acc>
            <Component>{children}</Component>
          </Acc>
        ),
    ({ children }) => children
  )

  return <Res {...props} />
}

const AA = ({ children, ...props }) => (
  <Box>
    AAA(<code>{JSON.stringify(props)}</code>){children(props.x)}
  </Box>
)

const BB = ({ children, ...props }) => (
  <Box>
    BBB(<code>{JSON.stringify(props)}</code>){children(props.x)}
  </Box>
)

const CC = ({ children, ...props }) => (
  <Box>
    CCC(<code>{JSON.stringify(props)}</code>){children(props.x)}
  </Box>
)

const Identity = ({ children }) => children()

const ABC = ({ children, x }) => (
  <Identity>
    {() => (
      <AA x="a">
        {(a) => (
          <BB x="b">
            {(b) => <CC x="c">{(c) => children({ A: a, B: b, C: c })}</CC>}
          </BB>
        )}
      </AA>
    )}
  </Identity>
)

const composeComponents =
  (...components) =>
  (props) =>
    Object.entries(components).reduce(
      (Acc, [name, X]) =>
        ({ children }) =>
          (
            <Acc>
              {(a) => (
                <X {...props[name]}>{(x) => children({ ...a, [name]: x })}</X>
              )}
            </Acc>
          ),
      ({ children, ...props }) => children({})
    )(props)

const AABBCC = composeComponents(AA, BB, CC)

const Compose = ({ components, ...props }) => {
  const Identity = ({ children, ...props }) => children({})

  const Res = Object.entries(components).reduce(
    (Acc, [name, X]) =>
      ({ children, ...props }) =>
        (
          <Acc {...props}>
            {(a) => (
              <X {...props[name]}>{(...x) => children({ ...a, [name]: x })}</X>
            )}
          </Acc>
        ),
    Identity
  )

  return <Res {...props} />
}

const RoutedEntityExample = ({parentPath, children}) =>
  <Route path={parentPath + '/:id'}>
    {({match}) =>
      <>
        {/* <Json>{nestedRoute}</Json> */}
        {match && children(
          match.params.id,
          {
            Local: {
              Link: ({to, ...props}) =>
                <Link {...props} to={[parentPath, match.params.id, to].join('/')}/>,
              Route: ({path, ...props}) =>
                <Route {...props} path={[parentPath, match.params.id, path].join('/')}/>
            }
          }
        )}
      </>
    }
  </Route>

const LocalizedRoute = ({children, ...props}) =>
  <Route {...props}>
    {({match, location}) =>
      <>
        <Json>{{location, match}}</Json>
        {match && children(
          match.params,
          {
            Link: ({to, ...props}) =>
              <Link {...props} to={[location.pathname, to].join('/')}/>,
            Route: ({path, ...props}) =>
              <Route {...props} path={[location.pathname, path].join('/')}/>
          }
        )}
      </>
    }
  </Route>

storiesOf('Resource', module)
  .add('Routed create', () =>
    <>
      <ul>
        <li><Link to="/example">/example</Link></li>
        <li><Link to="/example/123">/example/123</Link></li>
        <li><Link to="example">example</Link></li>
        <li><Link to="example/123">example/123</Link></li>
      </ul>
      <LocalizedRoute path="/example/:id">
        {(match, local) =>
          <>
            <local.Link to="/aaa">aaa</local.Link>
            |
            <local.Link to="/bbb">bbb</local.Link>
            <local.Route path="aaa">
              AAA
            </local.Route>
            <local.Route path="bbb">
              BBB
            </local.Route>
            <Json>{match}</Json>
          </>
        
        }
      </LocalizedRoute>
      {/* <RoutedEntityExample parentPath="/example">
        {(id, {Local}) =>
          <>
            <h1>id: {id}</h1>
            <Local.Link to="aaa">aaa</Local.Link>
            |
            <Local.Link to="bbb">bbb</Local.Link>
            <Local.Route path="aaa">
              AAA
            </Local.Route>
            <Local.Route path="bbb">
              BBB
            </Local.Route>
            <Route>
              {x => <Json>{x}</Json>}
            </Route>
          </>
        }
      </RoutedEntityExample> */}
      {/* <Route path="/example/:id">
        {nestedRoute => <Json>{{nestedRoute}}</Json>}
      </Route> */}
    </>
  )
  .add('Default', () => (
    <TabNav
      id="resource-example"
      label="Resource examples"
      tabs={[
        {
          label: 'Example resolved',
          content: (
            <Resource
              name="Resource example"
              id="resource-example-resolve"
              payload={1234}
            >
              {(resource) => <Json>{resource}</Json>}
            </Resource>
          ),
        },
        {
          label: 'Example rejected',
          content: (
            <Resource name="Resource example" id="resource-example-reject">
              {(resource) => <Json>{resource}</Json>}
            </Resource>
          ),
        },
        {
          label: 'Contact',
          content: (
            <Contact id="foo">{(contact) => <Json>{contact}</Json>}</Contact>
          ),
        },
        {
          label: 'Company',
          content: (
            <Company id="bar">{(company) => <Json>{company}</Json>}</Company>
          ),
        },
      ]}
    />
  ))
  .add('Entity resource', () =>
    <EntityResource
      resourceName="Bar"
      id="foobarbaz"
      actions={{
        a: 'Action resource example',
        b: 'Resource example',
        $read: 'Resource example',
      }}
      emptyState={create =>
        <button onClick={() => create()}>create</button>
      }
      onCreate={entity => console.log('created:', entity)}
    >
      {(entity, { a, b, $read }) => (
        <>
          <button onClick={() => $read()}>read</button>
          <button onClick={() => $read('reject')}>reject read</button>
          <button onClick={() => a(123)}>resolve A</button>
          <button onClick={() => a('reject')}>reject A</button>
          <button onClick={() => b(456)}>resolve B</button>
          <button onClick={() => b('reject')}>reject B</button>
          <pre>{JSON.stringify({ entity, a, b }, null, 2)}</pre>
        </>
      )}
    </EntityResource>
  )
  .add('Create entity resource', () =>
    <CreateEntityResource
      resourceName="Bar"
      // id="xxx"
      actions={{
        $create: 'Resource example',
      }}
    >
      {(entity, {$create}) =>
        <button onClick={() => $create()}>
          create
        </button>
      }
    </CreateEntityResource>
  )
  .add('Action resource', () => (
    <>
      <hr />
      <ActionsResource
        resourceName="Foo"
        actions={{ a: 'Action resource example', b: 'Resource example' }}
        id="xxx"
      >
        {(results, actions, tasks, { a, b }) => (
          <>
            <button onClick={() => a(123)}>resolve A</button>
            <button onClick={() => actions.a('reject')}>reject A</button>
            <button onClick={() => b(456)}>resolve B</button>
            <button onClick={() => actions.b('reject')}>reject B</button>
            <pre>{JSON.stringify({ a, b }, null, 2)}</pre>
            {/* <pre>{JSON.stringify({results, tasks, grouped}, null, 2)}</pre> */}
          </>
        )}
      </ActionsResource>
      <hr />
      <ActionResource name="Action resource example" id="aaa">
        {(result = 'no result yet', action, task) => (
          <>
            <button onClick={() => action(123)}>resolve</button>
            <button onClick={() => action('reject')}>reject</button>
            <pre>{JSON.stringify({ result, task }, null, 2)}</pre>
          </>
        )}
      </ActionResource>
      <ActionResource name="Action resource example" id="aaa" overlay={false}>
        {(result = 'no result yet', action, task) => (
          <>
            <button onClick={() => action(123)}>resolve</button>
            <button onClick={() => action('reject')}>reject</button>
            <pre>{JSON.stringify({ result, task }, null, 2)}</pre>
          </>
        )}
      </ActionResource>
    </>
  ))
