"use strict";(self.webpackChunkdata_hub_frontend=self.webpackChunkdata_hub_frontend||[]).push([[8458],{"./src/client/components/Form/elements/__stories__/FieldSelect.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_FieldSelect__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/client/components/Form/elements/FieldSelect/index.jsx"),_FieldInput__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/client/components/Form/elements/FieldInput/index.jsx"),_Form__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/client/components/Form/index.jsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Form/Form Elements/Select",parameters:{component:_FieldSelect__WEBPACK_IMPORTED_MODULE_1__.A}},Default=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_3__.A,{id:"fieldSelectExample",analyticsFormName:"fieldSelectExample",submissionTaskName:"Submit Form example"},(form=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldSelect__WEBPACK_IMPORTED_MODULE_1__.A,{name:"testField",label:"Test select",hint:"Some hint",initialValue:"testOptionValue2",emptyOption:"Please select",options:[{label:"testOptionLabel1",value:"testOptionValue1"},{label:"testOptionLabel2",value:"testOptionValue2"}],required:"Select one of the options",validate:value=>"testOptionValue2"!==value?"You need to select testOptionValue2":null}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldSelect__WEBPACK_IMPORTED_MODULE_1__.A,{name:"testField2",label:"Test select with children",hint:"Some hint",emptyOption:"Please select",options:[{label:"Option 1",value:"o1"},{label:"Option 2",value:"o2"},{label:"Other",value:"other",children:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldInput__WEBPACK_IMPORTED_MODULE_2__.A,{type:"text",placeholder:"Define other",name:"other"})}],required:"Select one of the options",validate:value=>"testOptionValue2"!==value?"You need to select testOptionValue2":null}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FieldSelect__WEBPACK_IMPORTED_MODULE_1__.A,{name:"testField3",label:"Test full width select",hint:"Some hint",initialValue:"testOptionValue2",emptyOption:"Please select",options:[{label:"testOptionLabel1",value:"testOptionValue1"},{label:"testOptionLabel2",value:"testOptionValue2"}],required:"Select one of the options",fullWidth:!0}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(form,null,2))))),__namedExportsOrder=["Default"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"() => <Form id=\"fieldSelectExample\" analyticsFormName=\"fieldSelectExample\" submissionTaskName=\"Submit Form example\">\n    {form => <>\n        <FieldSelect name=\"testField\" label=\"Test select\" hint=\"Some hint\" initialValue={'testOptionValue2'} emptyOption={'Please select'} options={[{\n      label: 'testOptionLabel1',\n      value: 'testOptionValue1'\n    }, {\n      label: 'testOptionLabel2',\n      value: 'testOptionValue2'\n    }]} required=\"Select one of the options\" validate={value => value !== 'testOptionValue2' ? 'You need to select testOptionValue2' : null} />\n\n        <FieldSelect name=\"testField2\" label=\"Test select with children\" hint=\"Some hint\" emptyOption={'Please select'} options={[{\n      label: 'Option 1',\n      value: 'o1'\n    }, {\n      label: 'Option 2',\n      value: 'o2'\n    }, {\n      label: 'Other',\n      value: 'other',\n      children: <FieldInput type=\"text\" placeholder=\"Define other\" name=\"other\" />\n    }]} required=\"Select one of the options\" validate={value => value !== 'testOptionValue2' ? 'You need to select testOptionValue2' : null} />\n        <FieldSelect name=\"testField3\" label=\"Test full width select\" hint=\"Some hint\" initialValue={'testOptionValue2'} emptyOption={'Please select'} options={[{\n      label: 'testOptionLabel1',\n      value: 'testOptionValue1'\n    }, {\n      label: 'testOptionLabel2',\n      value: 'testOptionValue2'\n    }]} required=\"Select one of the options\" fullWidth={true} />\n        <pre>{JSON.stringify(form, null, 2)}</pre>\n      </>}\n  </Form>",...Default.parameters?.docs?.source}}}}}]);