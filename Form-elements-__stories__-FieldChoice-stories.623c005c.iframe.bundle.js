"use strict";(self.webpackChunkdata_hub_frontend=self.webpackChunkdata_hub_frontend||[]).push([[7163],{"./src/client/components/Form/elements/__stories__/FieldChoice.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Boolean:()=>Boolean,BooleanCustomOptionLabels:()=>BooleanCustomOptionLabels,BooleanInline:()=>BooleanInline,BooleanLabel:()=>BooleanLabel,BooleanLabelAndHint:()=>BooleanLabelAndHint,BooleanRequired:()=>BooleanRequired,CheckboxPreselected:()=>CheckboxPreselected,Checkboxes:()=>Checkboxes,CheckboxesLabel:()=>CheckboxesLabel,CheckboxesLabelAndHint:()=>CheckboxesLabelAndHint,CheckboxesLegend:()=>CheckboxesLegend,CheckboxesRequired:()=>CheckboxesRequired,Radios:()=>Radios,RadiosInline:()=>RadiosInline,RadiosLabel:()=>RadiosLabel,RadiosLabelAndHint:()=>RadiosLabelAndHint,RadiosLegend:()=>RadiosLegend,RadiosPreselected:()=>RadiosPreselected,RadiosRequired:()=>RadiosRequired,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_FieldChoice__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/client/components/Form/elements/FieldChoice/index.jsx"),___WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/client/components/Form/index.jsx");const getGDSDocsUrl=component=>`<a href="https://design-system.service.gov.uk/components/${component}" target="_blank" rel="noopener noreferrer">GOV.UK Design System docs - ${component}</a>`,GDS_DOCS_RADIOS_URL=getGDSDocsUrl("radios"),GDS_DOCS_CHECKBOXES_URL=getGDSDocsUrl("checkboxes"),inline=styled_components__WEBPACK_IMPORTED_MODULE_3__.AH`
  fieldset div {
    display: flex;
  }
  fieldset div label {
    margin-right: 10px;
  }
`,FieldChoiceRadioInline=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_FieldChoice__WEBPACK_IMPORTED_MODULE_1__.A.Radio)`
  ${inline}
`,FieldChoiceBooleanInline=(0,styled_components__WEBPACK_IMPORTED_MODULE_3__.Ay)(_FieldChoice__WEBPACK_IMPORTED_MODULE_1__.A.Boolean)`
  ${inline}
`,countryOptions=[{value:"0",label:"England"},{value:"1",label:"Wales"},{value:"2",label:"Scotland"},{value:"3",label:"Northern Ireland"}],countryOptionsSubset=countryOptions.slice(0,2),__WEBPACK_DEFAULT_EXPORT__={title:"Form/Form Elements/FieldChoice",component:_FieldChoice__WEBPACK_IMPORTED_MODULE_1__.A,args:{options:countryOptions,name:"country",component:_FieldChoice__WEBPACK_IMPORTED_MODULE_1__.A},argTypes:{type:"string",initialValues:{control:"object"}},parameters:{docs:{description:{component:'The <b>FieldChoice</b> component renders a group of radio buttons or checkboxes by setting the prop type to either "radio" or "checkbox".\n                    The component sets the entire selected option to the form\'s state which is helpful on user journeys where the final page is a summary page\n                    and you need to extract a label (or any other field) from a previous selection to display to the user. Instead of using FieldChoice directly,\n                    favour <b>FieldChoice.Radio</b>, <b>FieldChoice.Checkbox</b>, or <b>FieldChoice.Boolean</b> where the type is set for you.'}}}},Template=({component:Component,initialValues,...args},{id})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(___WEBPACK_IMPORTED_MODULE_2__.A,{id,analyticsFormName:"formRadio",submissionTaskName:"SUBMISSION",initialValues},(state=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component,args),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(state,null,2))))),generateFormCode=({comments=[],componentName,props:{options=countryOptions,...restProps}})=>{let formCode="";return comments.forEach((comment=>{formCode+=`// ${comment}\n`})),formCode+=`\n<Form\n  id={id}\n  analyticsFormName="formRadio"\n  submissionTaskName="SUBMISSION"\n>\n  {(state) => (\n    <>\n      <${componentName}`,Object.keys(restProps).forEach((key=>{const value=restProps[key];value&&(formCode+=`\n        ${key}="${value}"`)})),options.length&&(formCode+="\n        options: [",options.forEach(((option,index)=>{formCode+=`\n          {\n            value: '${option.value}',\n            label: '${option.label}',\n          }${index<options.length-1?",":""}`})),formCode+="\n        ]"),formCode+="\n      />\n      <pre>{JSON.stringify(state, null, 2)}</pre>\n    </>\n  )}\n</Form>\n",formCode},formatCountry=country=>`{ value: '${country.value}', label: '${country.label}' }`,Radios=Template.bind({});Radios.args={type:"radio"},Radios.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Radio",props:{name:"country"}})}}};const RadiosLabel=Template.bind({});RadiosLabel.storyName="Radios and label",RadiosLabel.args={...Radios.args,label:"Where do you live"},RadiosLabel.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Radio",props:{name:"country",label:"Where do you live"}})}}};const RadiosLabelAndHint=Template.bind({});RadiosLabelAndHint.storyName="Radios with label and hint",RadiosLabelAndHint.args={...Radios.args,label:"Where do you live",hint:"Select one option"},RadiosLabelAndHint.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Radio",props:{name:"country",label:"Where do you live",hint:"Select one option"}})}}};const RadiosLegend=Template.bind({});RadiosLegend.storyName="Radios and legend",RadiosLegend.args={...Radios.args,legend:react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"H1 legend")},RadiosLegend.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Radio",props:{name:"country",legend:"{<h1>H1 legend</h1>}"}})}}};const RadiosInline=Template.bind({});RadiosInline.storyName="Radios inline",RadiosInline.args={...Radios.args,component:FieldChoiceRadioInline,options:countryOptionsSubset},RadiosInline.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoiceRadioInline",props:{name:"country",options:countryOptionsSubset}})}}};const RadiosRequired=Template.bind({});RadiosRequired.storyName="Radios selection required",RadiosRequired.args={...Radios.args,required:"Select at least one country"},RadiosRequired.parameters={docs:{description:{story:`Radio button group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_RADIOS_URL}`},source:{code:generateFormCode({componentName:"FieldChoice.Radio",props:{name:"country",required:"Select at least one country"}})}}};const RadiosPreselected=Template.bind({});RadiosPreselected.storyName="Radios preselected";const country=countryOptions[0];RadiosPreselected.args={...Radios.args,initialValues:{country}},RadiosPreselected.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Radio",comments:["The form will automatically set the initial values providing the name","field is set within the object that's returned by a transformer.",`For example: { country: ${formatCountry(country)} }`],props:{name:"country"}})}}};const Checkboxes=Template.bind({});Checkboxes.args={type:"checkboxes"},Checkboxes.parameters={docs:{description:{story:GDS_DOCS_CHECKBOXES_URL},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",props:{name:"country"}})}}};const CheckboxesLabel=Template.bind({});CheckboxesLabel.storyName="Checkboxes and label",CheckboxesLabel.args={...Checkboxes.args,label:"Where do you live"},CheckboxesLabel.parameters={docs:{description:{story:GDS_DOCS_CHECKBOXES_URL},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",props:{name:"country",label:"Where do you live"}})}}};const CheckboxesLabelAndHint=Template.bind({});CheckboxesLabelAndHint.storyName="Checkboxes label and hint";const checkboxLabelAndHint={label:"Where do you live",hint:"Select all that apply"};CheckboxesLabelAndHint.args={...Checkboxes.args,...checkboxLabelAndHint},CheckboxesLabelAndHint.parameters={docs:{description:{story:GDS_DOCS_CHECKBOXES_URL},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",props:{name:"country",...checkboxLabelAndHint}})}}};const CheckboxesLegend=Template.bind({});CheckboxesLegend.storyName="Checkboxes and legend",CheckboxesLegend.args={...Checkboxes.args,legend:react__WEBPACK_IMPORTED_MODULE_0__.createElement("h1",null,"H1 legend")},CheckboxesLegend.parameters={docs:{description:{story:GDS_DOCS_CHECKBOXES_URL},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",props:{name:"country",legend:"{<h1>H1 legend</h1>}"}})}}};const CheckboxesRequired=Template.bind({});CheckboxesRequired.storyName="Checkboxes selection required",CheckboxesRequired.args={...Checkboxes.args,required:"Select at least one country"},CheckboxesRequired.parameters={docs:{description:{story:`Checkbox group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_CHECKBOXES_URL}`},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",props:{name:"country",required:"Select at least one country"}})}}};const CheckboxPreselected=Template.bind({});CheckboxPreselected.storyName="Checkboxes preselected",CheckboxPreselected.args={...Checkboxes.args,initialValues:{country:[countryOptions[0],countryOptions[1]]}},CheckboxPreselected.parameters={docs:{description:{story:GDS_DOCS_CHECKBOXES_URL},source:{code:generateFormCode({componentName:"FieldChoice.Checkbox",comments:["The form will automatically set the initial values providing the name","field is set within the object that's returned by a transformer.",`For example: { country: [${formatCountry(countryOptions[0])}, ${formatCountry(countryOptions[1])}] }`],props:{name:"country"}})}}};const BOOLEAN_COMMENT="There's no need to set the options as the component does this internally.",Boolean=Template.bind({});Boolean.storyName="Boolean radios",Boolean.args={name:"has_changed_name",component:_FieldChoice__WEBPACK_IMPORTED_MODULE_1__.A.Boolean},Boolean.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Boolean",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",options:[]}})}}};const BooleanLabel=Template.bind({});BooleanLabel.storyName="Boolean radios with label",BooleanLabel.args={...Boolean.args,label:"Have you changed your name?"},BooleanLabel.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Boolean",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",label:"Have you changed your name?",options:[]}})}}};const BooleanLabelAndHint=Template.bind({});BooleanLabelAndHint.storyName="Boolean radios with label and hint";const labelAndHint={label:"Have you changed your name?",hint:"This includes changing your last name or spelling your name differently."};BooleanLabelAndHint.args={...Boolean.args,...labelAndHint},BooleanLabelAndHint.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Boolean",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",...labelAndHint,options:[]}})}}};const BooleanCustomOptionLabels=Template.bind({});BooleanCustomOptionLabels.storyName="Boolean radios with custom labels";const customOptionLabels={label:"Have you changed your name?",yesLabel:"Agree",noLabel:"Disagree"};BooleanCustomOptionLabels.args={...Boolean.args,...customOptionLabels},BooleanCustomOptionLabels.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoice.Boolean",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",...customOptionLabels,options:[]}})}}};const BooleanRequired=Template.bind({});BooleanRequired.storyName="Boolean radios selection required",BooleanRequired.args={...Boolean.args,required:"Select at least one option"},BooleanRequired.parameters={docs:{description:{story:`A boolean radio group where a selection is required. Click "Save" to view an error. ${GDS_DOCS_RADIOS_URL}`},source:{code:generateFormCode({componentName:"FieldChoice.Boolean",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",required:"Select at least one option",options:[]}})}}};const BooleanInline=Template.bind({});BooleanInline.storyName="Boolean radios inline",BooleanInline.args={...Boolean.args,component:FieldChoiceBooleanInline},BooleanInline.parameters={docs:{description:{story:GDS_DOCS_RADIOS_URL},source:{code:generateFormCode({componentName:"FieldChoiceBooleanInline",comments:[BOOLEAN_COMMENT],props:{name:"has_changed_name",options:[]}})}}};const __namedExportsOrder=["Radios","RadiosLabel","RadiosLabelAndHint","RadiosLegend","RadiosInline","RadiosRequired","RadiosPreselected","Checkboxes","CheckboxesLabel","CheckboxesLabelAndHint","CheckboxesLegend","CheckboxesRequired","CheckboxPreselected","Boolean","BooleanLabel","BooleanLabelAndHint","BooleanCustomOptionLabels","BooleanRequired","BooleanInline"];Radios.parameters={...Radios.parameters,docs:{...Radios.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...Radios.parameters?.docs?.source}}},RadiosLabel.parameters={...RadiosLabel.parameters,docs:{...RadiosLabel.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosLabel.parameters?.docs?.source}}},RadiosLabelAndHint.parameters={...RadiosLabelAndHint.parameters,docs:{...RadiosLabelAndHint.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosLabelAndHint.parameters?.docs?.source}}},RadiosLegend.parameters={...RadiosLegend.parameters,docs:{...RadiosLegend.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosLegend.parameters?.docs?.source}}},RadiosInline.parameters={...RadiosInline.parameters,docs:{...RadiosInline.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosInline.parameters?.docs?.source}}},RadiosRequired.parameters={...RadiosRequired.parameters,docs:{...RadiosRequired.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosRequired.parameters?.docs?.source}}},RadiosPreselected.parameters={...RadiosPreselected.parameters,docs:{...RadiosPreselected.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...RadiosPreselected.parameters?.docs?.source}}},Checkboxes.parameters={...Checkboxes.parameters,docs:{...Checkboxes.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...Checkboxes.parameters?.docs?.source}}},CheckboxesLabel.parameters={...CheckboxesLabel.parameters,docs:{...CheckboxesLabel.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesLabel.parameters?.docs?.source}}},CheckboxesLabelAndHint.parameters={...CheckboxesLabelAndHint.parameters,docs:{...CheckboxesLabelAndHint.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesLabelAndHint.parameters?.docs?.source}}},CheckboxesLegend.parameters={...CheckboxesLegend.parameters,docs:{...CheckboxesLegend.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesLegend.parameters?.docs?.source}}},CheckboxesRequired.parameters={...CheckboxesRequired.parameters,docs:{...CheckboxesRequired.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxesRequired.parameters?.docs?.source}}},CheckboxPreselected.parameters={...CheckboxPreselected.parameters,docs:{...CheckboxPreselected.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...CheckboxPreselected.parameters?.docs?.source}}},Boolean.parameters={...Boolean.parameters,docs:{...Boolean.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...Boolean.parameters?.docs?.source}}},BooleanLabel.parameters={...BooleanLabel.parameters,docs:{...BooleanLabel.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...BooleanLabel.parameters?.docs?.source}}},BooleanLabelAndHint.parameters={...BooleanLabelAndHint.parameters,docs:{...BooleanLabelAndHint.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...BooleanLabelAndHint.parameters?.docs?.source}}},BooleanCustomOptionLabels.parameters={...BooleanCustomOptionLabels.parameters,docs:{...BooleanCustomOptionLabels.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...BooleanCustomOptionLabels.parameters?.docs?.source}}},BooleanRequired.parameters={...BooleanRequired.parameters,docs:{...BooleanRequired.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...BooleanRequired.parameters?.docs?.source}}},BooleanInline.parameters={...BooleanInline.parameters,docs:{...BooleanInline.parameters?.docs,source:{originalSource:'({\n  component: Component,\n  initialValues,\n  ...args\n}, {\n  id\n}) => <Form id={id} analyticsFormName="formRadio" submissionTaskName="SUBMISSION" initialValues={initialValues}>\n    {state => <>\n        <Component {...args} />\n        <pre>{JSON.stringify(state, null, 2)}</pre>\n      </>}\n  </Form>',...BooleanInline.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=Form-elements-__stories__-FieldChoice-stories.623c005c.iframe.bundle.js.map