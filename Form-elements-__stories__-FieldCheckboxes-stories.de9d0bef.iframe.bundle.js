"use strict";(self.webpackChunkdata_hub_frontend=self.webpackChunkdata_hub_frontend||[]).push([[8141],{"./src/client/components/Form/elements/__stories__/FieldCheckboxes.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CheckboxesExclusive:()=>CheckboxesExclusive,CheckboxesHint:()=>CheckboxesHint,CheckboxesLegend:()=>CheckboxesLegend,Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_govuk_react_heading__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@govuk-react/heading/dist/govuk-react-heading.esm.js"),govuk_react__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/govuk-react/dist/govuk-react.esm.js"),styled_components__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/client/components/Form/elements/FieldCheckboxes/index.jsx"),_Form__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/client/components/Form/index.jsx");const StyledDetails=(0,styled_components__WEBPACK_IMPORTED_MODULE_5__.Ay)(govuk_react__WEBPACK_IMPORTED_MODULE_2__.B_)({margin:0}),options=[{label:"Italy",value:"it"},{label:"Poland",value:"pl"},{label:"United Kingdom",value:"gb"},{label:"United States",value:"us",hint:"Hints are supported!"}],__WEBPACK_DEFAULT_EXPORT__={title:"Form/Form Elements/Checkboxes",parameters:{component:_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__.A}},Default=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_4__.A,{id:"fieldCheckboxExample",analyticsFormName:"fieldCheckboxExample",submissionTaskName:"Submit Form example"},(form=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__.A,{name:"countries",label:"What are your favourite countries?",required:"Select at least one country",options}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(form,null,2))))),CheckboxesHint=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_4__.A,{id:"fieldCheckboxExample",analyticsFormName:"fieldCheckboxExample",submissionTaskName:"Submit Form example"},(form=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__.A,{name:"countries",label:"What are your favourite countries?",hint:"Some hint",required:"Select at least one country",options}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(form,null,2)))));CheckboxesHint.story={name:"Checkboxes - hint"};const CheckboxesLegend=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_4__.A,{id:"fieldCheckboxExample",analyticsFormName:"fieldCheckboxExample",submissionTaskName:"Submit Form example"},(form=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__.A,{name:"countries2",legend:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_govuk_react_heading__WEBPACK_IMPORTED_MODULE_1__.H1,null,"Using H1 as legend"),hint:"Some hint",required:"Select at least one country",options}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(form,null,2)))));CheckboxesLegend.story={name:"Checkboxes - legend"};const CheckboxesExclusive=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_4__.A,{id:"fieldCheckboxExample",analyticsFormName:"fieldCheckboxExample",submissionTaskName:"Submit Form example"},(form=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldCheckboxes__WEBPACK_IMPORTED_MODULE_3__.A,{name:"countries",label:"Estimated land date notification preferences",hint:"Select all that apply",required:"Select at least one country or select 'No, ...'",exclusive:!0,initialValue:["no"],options:[{label:"France",value:"fr"},{label:"Portugal",value:"pr"},{label:"Spain",value:"sp"},{label:"No, I will not be travelling to any of these countries",value:"no"},{label:"Yes, I will travelling to any of these countries",value:"yes",link:react__WEBPACK_IMPORTED_MODULE_0__.createElement(StyledDetails,{summary:"Is included a territorial independent countries?","data-test":"some-list-of-territorial-countries"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",null,"List of territorial countries:"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(govuk_react__WEBPACK_IMPORTED_MODULE_2__.Xy,{listStyleType:"bullet"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(govuk_react__WEBPACK_IMPORTED_MODULE_2__.ck,null,"French Guiana"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(govuk_react__WEBPACK_IMPORTED_MODULE_2__.ck,null,"Madeira and Azores"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(govuk_react__WEBPACK_IMPORTED_MODULE_2__.ck,null,"Balearic Islands(Ibiza, Formentera, Mallorca and Canary Islands)")))}]}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(form,null,2)))));CheckboxesExclusive.story={name:"Checkboxes - exclusive"};const __namedExportsOrder=["Default","CheckboxesHint","CheckboxesLegend","CheckboxesExclusive"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:'() => <Form id="fieldCheckboxExample" analyticsFormName="fieldCheckboxExample" submissionTaskName="Submit Form example">\n    {form => <>\n        <FieldCheckboxes name="countries" label="What are your favourite countries?" required="Select at least one country" options={options} />\n        <pre>{JSON.stringify(form, null, 2)}</pre>\n      </>}\n  </Form>',...Default.parameters?.docs?.source}}},CheckboxesHint.parameters={...CheckboxesHint.parameters,docs:{...CheckboxesHint.parameters?.docs,source:{originalSource:'() => <Form id="fieldCheckboxExample" analyticsFormName="fieldCheckboxExample" submissionTaskName="Submit Form example">\n    {form => <>\n        <FieldCheckboxes name="countries" label="What are your favourite countries?" hint="Some hint" required="Select at least one country" options={options} />\n        <pre>{JSON.stringify(form, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesHint.parameters?.docs?.source}}},CheckboxesLegend.parameters={...CheckboxesLegend.parameters,docs:{...CheckboxesLegend.parameters?.docs,source:{originalSource:'() => <Form id="fieldCheckboxExample" analyticsFormName="fieldCheckboxExample" submissionTaskName="Submit Form example">\n    {form => <>\n        <FieldCheckboxes name="countries2" legend={<H1>Using H1 as legend</H1>} hint="Some hint" required="Select at least one country" options={options} />\n        <pre>{JSON.stringify(form, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesLegend.parameters?.docs?.source}}},CheckboxesExclusive.parameters={...CheckboxesExclusive.parameters,docs:{...CheckboxesExclusive.parameters?.docs,source:{originalSource:"() => <Form id=\"fieldCheckboxExample\" analyticsFormName=\"fieldCheckboxExample\" submissionTaskName=\"Submit Form example\">\n    {form => <>\n        <FieldCheckboxes name=\"countries\" label=\"Estimated land date notification preferences\" hint=\"Select all that apply\" required=\"Select at least one country or select 'No, ...'\" exclusive={true} initialValue={['no']} options={[{\n      label: 'France',\n      value: 'fr'\n    }, {\n      label: 'Portugal',\n      value: 'pr'\n    }, {\n      label: 'Spain',\n      value: 'sp'\n    }, {\n      label: 'No, I will not be travelling to any of these countries',\n      value: 'no'\n    }, {\n      label: 'Yes, I will travelling to any of these countries',\n      value: 'yes',\n      link: <StyledDetails summary=\"Is included a territorial independent countries?\" data-test=\"some-list-of-territorial-countries\">\n                  <p>List of territorial countries:</p>\n                  <UnorderedList listStyleType=\"bullet\">\n                    <ListItem>French Guiana</ListItem>\n                    <ListItem>Madeira and Azores</ListItem>\n                    <ListItem>\n                      Balearic Islands(Ibiza, Formentera, Mallorca and Canary\n                      Islands)\n                    </ListItem>\n                  </UnorderedList>\n                </StyledDetails>\n    }]} />\n        <pre>{JSON.stringify(form, null, 2)}</pre>\n      </>}\n  </Form>",...CheckboxesExclusive.parameters?.docs?.source}}}}}]);