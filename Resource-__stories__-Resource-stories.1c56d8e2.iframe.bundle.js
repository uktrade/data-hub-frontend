"use strict";(self.webpackChunkdata_hub_frontend=self.webpackChunkdata_hub_frontend||[]).push([[2496],{"./src/client/components/Resource/__stories__/Resource.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CustomProgressAndError:()=>CustomProgressAndError,Default:()=>Default,Inline:()=>Inline,MetadataFormFields:()=>MetadataFormFields,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_Form__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/client/components/Form/index.jsx"),_TabNav__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/client/components/TabNav/index.jsx"),_Contact__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/client/components/Resource/Contact.js"),_Company__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/client/components/Resource/Company.js"),_Resource__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/client/components/Resource/Resource.jsx"),_Task_stories_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/client/components/Task/__stories__/utils.jsx"),_Countries__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/client/components/Resource/Countries.js"),_BusinessPotential__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/client/components/Resource/BusinessPotential.js");const Json=({children})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,JSON.stringify(children,null,2)),__WEBPACK_DEFAULT_EXPORT__={title:"Resource",component:_Resource__WEBPACK_IMPORTED_MODULE_5__.Ay},Default=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_TabNav__WEBPACK_IMPORTED_MODULE_2__.Ay,{id:"resource-example",label:"Resource examples",selectedIndex:"Resource example",tabs:[{label:"Example resolved",content:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Resource__WEBPACK_IMPORTED_MODULE_5__.Ay,{name:"Resource example",id:"resource-example-resolve",payload:1234},(resource=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,resource)))},{label:"Example rejected",content:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Resource__WEBPACK_IMPORTED_MODULE_5__.Ay,{name:"Resource example",id:"resource-example-reject"},(resource=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,resource)))},{label:"Contact",content:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Contact__WEBPACK_IMPORTED_MODULE_3__.A,{id:"foo"},(contact=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,contact)))},{label:"Company",content:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Company__WEBPACK_IMPORTED_MODULE_4__.A,{id:"bar"},(company=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,company)))}]}),CustomProgressAndError=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Contact__WEBPACK_IMPORTED_MODULE_3__.A,{id:"foo",taskStatusProps:{renderProgress:()=>"loading...",renderError:({retry,dismiss,errorMessage,noun})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{border:"4px solid green",background:"gold",padding:10}},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,"Couldn't load ",noun," because:"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("pre",null,errorMessage),react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{onClick:retry},"retry"),react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{onClick:dismiss},"dismiss"))}},(contact=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,contact))),ContactName=props=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Contact__WEBPACK_IMPORTED_MODULE_3__.A.Inline,props,(({firstName,lastName})=>`${firstName} ${lastName}`)),Inline=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Task_stories_utils__WEBPACK_IMPORTED_MODULE_6__.C,{dismissable:react__WEBPACK_IMPORTED_MODULE_0__.createElement(ContactName,{id:"foo"}),noRetry:react__WEBPACK_IMPORTED_MODULE_0__.createElement(ContactName,{id:"foo",dismissable:!1,noRetry:!0})}),MetadataFormFields=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Form__WEBPACK_IMPORTED_MODULE_1__.A,{id:"my-form"},(({values})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Countries__WEBPACK_IMPORTED_MODULE_7__.A.FieldSelect,{name:"countrySelect",label:"Country"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Countries__WEBPACK_IMPORTED_MODULE_7__.A.FieldTypeahead,{name:"countryTypeahead",label:"Country"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BusinessPotential__WEBPACK_IMPORTED_MODULE_8__.A.FieldRadios,{name:"businessPotentialRadios",label:"Business potential"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BusinessPotential__WEBPACK_IMPORTED_MODULE_8__.A.FieldCheckboxes,{name:"businessPotentialCheckboxes",label:"Business potential"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(Json,null,values)))),__namedExportsOrder=["Default","CustomProgressAndError","Inline","MetadataFormFields"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:'() => <TabNav id="resource-example" label="Resource examples" selectedIndex={\'Resource example\'} tabs={[{\n  label: \'Example resolved\',\n  content: <Resource name="Resource example" id="resource-example-resolve" payload={1234}>\n            {resource => <Json>{resource}</Json>}\n          </Resource>\n}, {\n  label: \'Example rejected\',\n  content: <Resource name="Resource example" id="resource-example-reject">\n            {resource => <Json>{resource}</Json>}\n          </Resource>\n}, {\n  label: \'Contact\',\n  content: <Contact id="foo">{contact => <Json>{contact}</Json>}</Contact>\n}, {\n  label: \'Company\',\n  content: <Company id="bar">{company => <Json>{company}</Json>}</Company>\n}]} />',...Default.parameters?.docs?.source}}},CustomProgressAndError.parameters={...CustomProgressAndError.parameters,docs:{...CustomProgressAndError.parameters?.docs,source:{originalSource:"() => <Contact id=\"foo\" taskStatusProps={{\n  renderProgress: () => 'loading...',\n  renderError: ({\n    retry,\n    dismiss,\n    errorMessage,\n    noun\n  }) => <div style={{\n    border: '4px solid green',\n    background: 'gold',\n    padding: 10\n  }}>\n          <div>Couldn't load {noun} because:</div>\n          <pre>{errorMessage}</pre>\n          <button onClick={retry}>retry</button>\n          <button onClick={dismiss}>dismiss</button>\n        </div>\n}}>\n    {contact => <Json>{contact}</Json>}\n  </Contact>",...CustomProgressAndError.parameters?.docs?.source}}},Inline.parameters={...Inline.parameters,docs:{...Inline.parameters?.docs,source:{originalSource:'() => <InlineTemplate dismissable={<ContactName id="foo" />} noRetry={<ContactName id="foo" dismissable={false} noRetry={true} />} />',...Inline.parameters?.docs?.source}}},MetadataFormFields.parameters={...MetadataFormFields.parameters,docs:{...MetadataFormFields.parameters?.docs,source:{originalSource:'() => <Form id="my-form">\n    {({\n    values\n  }) => <>\n        <Countries.FieldSelect name="countrySelect" label="Country" />\n        <Countries.FieldTypeahead name="countryTypeahead" label="Country" />\n        <BusinessPotential.FieldRadios name="businessPotentialRadios" label="Business potential" />\n        <BusinessPotential.FieldCheckboxes name="businessPotentialCheckboxes" label="Business potential" />\n        <Json>{values}</Json>\n      </>}\n  </Form>',...MetadataFormFields.parameters?.docs?.source}}}},"./src/client/components/Task/__stories__/utils.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{C:()=>InlineTemplate});var _TabNav__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/client/components/TabNav/index.jsx"),_Layout_DefaultLayout__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/client/components/Layout/DefaultLayout.jsx"),InlineTemplate=function InlineTemplate(_ref){var dismissable=_ref.dismissable,noRetry=_ref.noRetry;return React.createElement(_Layout_DefaultLayout__WEBPACK_IMPORTED_MODULE_1__.A,{heading:React.createElement(React.Fragment,null,"In heading ",dismissable," foo bar baz"),localHeaderdismissable:React.createElement(React.Fragment,null,"In local header ",dismissable," foo bar baz"),breadcrumbs:[{text:"Foo"},{text:noRetry},{text:"Foo"}]},React.createElement(_TabNav__WEBPACK_IMPORTED_MODULE_0__.Ay,{id:"example",label:"Tab nav",selectedIndex:"bar",tabs:{foo:{label:"Foo",content:"Foo content"},bar:{label:React.createElement(React.Fragment,null,"Inside tab ",noRetry),content:"Bar content"},baz:{label:"Baz",content:"Baz content"}}}),React.createElement("h1",null,"Inside H1 ",dismissable," foo bar baz"),React.createElement("h2",null,"Inside H2 ",dismissable," foo bar baz"),React.createElement("h3",null,"Inside H3 ",dismissable," foo bar baz"),React.createElement("h4",null,"Inside H4 ",dismissable," foo bar baz"),React.createElement("h5",null,"Inside H5 ",dismissable," foo bar baz"),React.createElement("h6",null,"Inside H6 ",dismissable," foo bar baz"),React.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ultrices"," ",dismissable," odio at ultricies semper. Sed fermentum tortor quis ante blandit malesuada. Praesent vulputate eget dolor vel luctus. Pellentesque id molestie arcu, a eleifend justo."),React.createElement("ul",null,React.createElement("li",null,"Inside list item ",dismissable," foo bar baz"),React.createElement("li",null,"Inside list item ",dismissable," foo bar baz"),React.createElement("li",null,"Inside list item ",dismissable," foo bar baz")))};InlineTemplate.__docgenInfo={description:"",methods:[],displayName:"InlineTemplate"}}}]);