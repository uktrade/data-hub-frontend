/* eslint-disable no-multiple-empty-lines */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable prettier/prettier */
import React, {useState} from 'react'

import TabNav from '../../TabNav'
import Task from '../../Task'
import Contact from '../Contact'
import Company from '../Company'
import Resource from '../Resource'
import DefaultLayout from '../../Layout/DefaultLayout'
import Err from '../../Task/Error'
import ProgressIndicator from '../../ProgressIndicator'

export default {
  title: "Peter's demos",
}

const ForceLoadButton = ({name, id}) => {
  const [counter, setCounter] = useState(0)

  return (
    <>
      <div style={{display: 'none'}}>
        <Resource name={name} id={id} key={counter}>
          {() => null}
        </Resource>
      </div>
      <button onClick={() => setCounter(x => x + 1)} style={{margin: 10}}>
        Start task {name}#{id}
      </button>
    </>
  )
}







export const Example_1_ResourceInLayout = () =>
  <DefaultLayout
    heading="Heading (how do I get contact name here??? 🤷)"
    pageTitle="Page title"
    breadcrumbs={[
      {text: 'Breadcrumb'}
    ]}
  >
    <Contact id="foo">
      {data => <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Contact>
  </DefaultLayout>






export const Example2LayoutInResource = () =>
  <Contact id="foo">
    {data => 
      <DefaultLayout
        heading={data.firstName + ' ' + data.lastName}
        pageTitle="Page title"
        breadcrumbs={[
          {text: 'Breadcrumb'}
        ]}
      >
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </DefaultLayout>
    }
  </Contact>








export const Example3LayoutInResourceWithOverlay = () =>
  <Contact id="foo" progressBox={true} >
    {data =>
      <DefaultLayout
        heading={data ? `${data.firstName} ${data.lastName}` : 'loading...'}
        pageTitle="Page title"
        breadcrumbs={[
          {text: 'Foo'},
          {text: data?.firstName || 'loading...'},
          {text: 'Bar'},
          {text: data?.lastName || 'loading...'},
          {text: 'Baz'},
        ]}
      >
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </DefaultLayout>
    }
  </Contact>











export const Example4MultipleResourcesButBrokenLayout = () =>
  <DefaultLayout
    heading={<Contact id="foo">{({firstName, lastName}) => `${firstName} ${lastName}`}</Contact>}
    pageTitle="Page title"
    breadcrumbs={[
      {text: 'Foo'},
      {text: <Contact id="foo">{data => data.firstName}</Contact>},
      {text: 'Bar'},
      {text: <Contact id="foo">{data => data.lastName}</Contact>},
      {text: 'Baz'},
    ]}
  >
    <Contact id="foo">
      {data =>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      }
    </Contact>
  </DefaultLayout>









export const Example5MultipleResourcesInlineProgressAndError = () =>
  <DefaultLayout
    heading={
      <>
      Contact name is:
        <Contact
        id="foo"
        taskStatusProps={{
          renderProgress: ProgressIndicator.Inline,
          renderError: Err.Inline,
        }}
      >
        {({firstName, lastName}) => `${firstName} ${lastName}`}
      </Contact>
      </>
    }
    pageTitle="Page title"
    breadcrumbs={[
      {text: 'Foo'},
      {text:
        <Contact
          id="foo"
          noRetry
          taskStatusProps={{
            renderProgress: ProgressIndicator.Inline,
            renderError: Err.Inline,
          }}
        >
          {data => data.firstName}
        </Contact>},
      {text: 'Bar'},
      {text:
        <Contact
          id="foo"
          noRetry
          taskStatusProps={{
            renderProgress: ProgressIndicator.Inline,
            renderError: Err.Inline,
          }}
        >
          {data => data.lastName}
        </Contact>},
      {text: 'Baz'},
    ]}
  >
    <Contact id="foo">
      {data =>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      }
    </Contact>
  </DefaultLayout>

export const Example6MultipleInlineResources = () =>
  <DefaultLayout
    heading={
      <Contact.Inline id="foo">
        {({firstName, lastName}) => `${firstName} ${lastName}`}
      </Contact.Inline>
    }
    pageTitle="Page title"
    breadcrumbs={[
      {text: 'Foo'},
      {text: <Contact.Inline id="foo" noRetry>{data => data.firstName}</Contact.Inline>},
      {text: 'Bar'},
      {text: <Contact.Inline id="foo" noRetry>{data => data.lastName}</Contact.Inline>},
      {text: 'Baz'},
    ]}
  >
    <Contact id="foo">
      {data =>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      }
    </Contact>
  </DefaultLayout>
