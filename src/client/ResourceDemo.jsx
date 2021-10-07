/* eslint-disable prettier/prettier */
import React from 'react'
import styled from 'styled-components'

import multiInstance from './utils/multiinstance'
import Task from './components/Task'

const Label = styled.label({
  display: 'block',
})

const Pre = styled.pre({
  border: '1px solid',
  overflow: 'scroll',
  maxHeight: 200,
})

const Json = ({children}) =>
  <Pre>{JSON.stringify(children, null, 2)}</Pre>

export const InvestmentDetail = multiInstance({
  name: 'InvestmentDetails',
  reducer: (state = {}, action) => {
    switch (action.type) {
      case 'INVESTMENT__LOADED':
        return {
          investment: action.result,
        }
      default:
        return state
    }
  },
  component: ({investment}) =>
    <Task.Status
      name="Investment"
      id="addca042-5a00-412c-9d7c-acc04552756c"
      startOnRender={{
        onSuccessDispatch: 'INVESTMENT__LOADED',
      }}
    >
      {() =>
        investment && <Json>{investment}</Json>
      }
    </Task.Status>
})

// import Investment from './components/Resource/Investment'

// export default () =>
//   <Investment id="addca042-5a00-412c-9d7c-acc04552756c">
//     {(investment, {$update, audit}) =>
//       <>
//         <Json>{investment}</Json>

//         <form onSubmit={e => {
//           e.preventDefault()
//           $update(Object.fromEntries(new FormData(e.target)))
//         }}>
//           <Label>
//             Name
//             <input name="name" defaultValue={investment.name}/>
//           </Label>
//           <Label>
//             Description
//             <input name="description" defaultValue={investment.description}/>
//           </Label>
//           <input type="submit" value="Update" />
//         </form>
        
//         <button onClick={() => audit()}>Fetch audit</button>
//         <Json>{audit.result}</Json>
//       </>
//     }
//   </Investment>
