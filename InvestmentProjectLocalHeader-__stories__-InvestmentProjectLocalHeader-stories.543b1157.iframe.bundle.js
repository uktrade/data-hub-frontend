"use strict";(self.webpackChunkdata_hub_frontend=self.webpackChunkdata_hub_frontend||[]).push([[280],{"./src/client/components/InvestmentProjectLocalHeader/__stories__/InvestmentProjectLocalHeader.stories.jsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{CreatedByNoDbtTeam:()=>CreatedByNoDbtTeam,ProjectValuedFalse:()=>ProjectValuedFalse,ProjectValuedTrue:()=>ProjectValuedTrue,StageActive:()=>StageActive,StageAssignPm:()=>StageAssignPm,StageProspect:()=>StageProspect,StageVerifyWin:()=>StageVerifyWin,StageWon:()=>StageWon,StatusAbandoned:()=>StatusAbandoned,StatusDelayed:()=>StatusDelayed,StatusDormant:()=>StatusDormant,StatusLost:()=>StatusLost,StatusOngoing:()=>StatusOngoing,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/client/components/InvestmentProjectLocalHeader/index.jsx"),_lib_urls__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/lib/urls.js"),_lib_urls__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(_lib_urls__WEBPACK_IMPORTED_MODULE_2__),_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/client/modules/Investments/Projects/constants.js");const investment={id:"123",investor_company:{name:"Alphabet Inc.",id:"456"},project_code:"DHP-00000356",value_complete:!1,created_on:"2022-02-25T15:37:23.331204Z",created_by:{name:"Andy Pipkin",dit_team:{name:"Little Britain"}},stage:{name:_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__.sy},status:"ongoing"},breadcrumbs=[{link:_lib_urls__WEBPACK_IMPORTED_MODULE_2___default().dashboard.index(),text:"Home"},{link:_lib_urls__WEBPACK_IMPORTED_MODULE_2___default().investments.index(),text:"Investments"},{link:_lib_urls__WEBPACK_IMPORTED_MODULE_2___default().investments.index(),text:"Projects"},{link:_lib_urls__WEBPACK_IMPORTED_MODULE_2___default().investments.projects.details(investment.id),text:investment.investor_company.name}],__WEBPACK_DEFAULT_EXPORT__={title:"InvestmentProjectLocalHeader",parameters:{component:InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A}},StatusOngoing=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,status:"ongoing"},breadcrumbs});StatusOngoing.story={name:"Status: Ongoing"};const StatusDelayed=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,status:"delayed"},breadcrumbs});StatusDelayed.story={name:"Status: Delayed"};const StatusAbandoned=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,status:"abandoned"},breadcrumbs});StatusAbandoned.story={name:"Status: Abandoned"};const StatusLost=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,status:"lost"},breadcrumbs});StatusLost.story={name:"Status: Lost"};const StatusDormant=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,status:"dormant"},breadcrumbs});StatusDormant.story={name:"Status: Dormant"};const StageProspect=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment,breadcrumbs});StageProspect.story={name:"Stage: Prospect"};const StageAssignPm=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,stage:{name:_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__.Li}},breadcrumbs});StageAssignPm.story={name:"Stage: Assign PM"};const StageActive=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,stage:{name:_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__.aO}},breadcrumbs});StageActive.story={name:"Stage: Active"};const StageVerifyWin=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,stage:{name:_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__.Cb}},breadcrumbs});StageVerifyWin.story={name:"Stage: Verify win"};const StageWon=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,stage:{name:_modules_Investments_Projects_constants__WEBPACK_IMPORTED_MODULE_3__.c0}},breadcrumbs});StageWon.story={name:"Stage: Won"};const ProjectValuedFalse=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment,breadcrumbs});ProjectValuedFalse.story={name:"Project valued: false"};const ProjectValuedTrue=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,value_complete:!0},breadcrumbs});ProjectValuedTrue.story={name:"Project valued: true"};const CreatedByNoDbtTeam=()=>react__WEBPACK_IMPORTED_MODULE_0__.createElement(InvestmentProjectLocalHeader__WEBPACK_IMPORTED_MODULE_1__.A,{investment:{...investment,created_by:{}},breadcrumbs});CreatedByNoDbtTeam.story={name:"Created by: no DBT team"};const __namedExportsOrder=["StatusOngoing","StatusDelayed","StatusAbandoned","StatusLost","StatusDormant","StageProspect","StageAssignPm","StageActive","StageVerifyWin","StageWon","ProjectValuedFalse","ProjectValuedTrue","CreatedByNoDbtTeam"];StatusOngoing.parameters={...StatusOngoing.parameters,docs:{...StatusOngoing.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  status: 'ongoing'\n}} breadcrumbs={breadcrumbs} />",...StatusOngoing.parameters?.docs?.source}}},StatusDelayed.parameters={...StatusDelayed.parameters,docs:{...StatusDelayed.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  status: 'delayed'\n}} breadcrumbs={breadcrumbs} />",...StatusDelayed.parameters?.docs?.source}}},StatusAbandoned.parameters={...StatusAbandoned.parameters,docs:{...StatusAbandoned.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  status: 'abandoned'\n}} breadcrumbs={breadcrumbs} />",...StatusAbandoned.parameters?.docs?.source}}},StatusLost.parameters={...StatusLost.parameters,docs:{...StatusLost.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  status: 'lost'\n}} breadcrumbs={breadcrumbs} />",...StatusLost.parameters?.docs?.source}}},StatusDormant.parameters={...StatusDormant.parameters,docs:{...StatusDormant.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  status: 'dormant'\n}} breadcrumbs={breadcrumbs} />",...StatusDormant.parameters?.docs?.source}}},StageProspect.parameters={...StageProspect.parameters,docs:{...StageProspect.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={investment} breadcrumbs={breadcrumbs} />",...StageProspect.parameters?.docs?.source}}},StageAssignPm.parameters={...StageAssignPm.parameters,docs:{...StageAssignPm.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  stage: {\n    name: STAGE_ASSIGN_PM\n  }\n}} breadcrumbs={breadcrumbs} />",...StageAssignPm.parameters?.docs?.source}}},StageActive.parameters={...StageActive.parameters,docs:{...StageActive.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  stage: {\n    name: STAGE_ACTIVE\n  }\n}} breadcrumbs={breadcrumbs} />",...StageActive.parameters?.docs?.source}}},StageVerifyWin.parameters={...StageVerifyWin.parameters,docs:{...StageVerifyWin.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  stage: {\n    name: STAGE_VERIFY_WIN\n  }\n}} breadcrumbs={breadcrumbs} />",...StageVerifyWin.parameters?.docs?.source}}},StageWon.parameters={...StageWon.parameters,docs:{...StageWon.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  stage: {\n    name: STAGE_WON\n  }\n}} breadcrumbs={breadcrumbs} />",...StageWon.parameters?.docs?.source}}},ProjectValuedFalse.parameters={...ProjectValuedFalse.parameters,docs:{...ProjectValuedFalse.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={investment} breadcrumbs={breadcrumbs} />",...ProjectValuedFalse.parameters?.docs?.source}}},ProjectValuedTrue.parameters={...ProjectValuedTrue.parameters,docs:{...ProjectValuedTrue.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  value_complete: true\n}} breadcrumbs={breadcrumbs} />",...ProjectValuedTrue.parameters?.docs?.source}}},CreatedByNoDbtTeam.parameters={...CreatedByNoDbtTeam.parameters,docs:{...CreatedByNoDbtTeam.parameters?.docs,source:{originalSource:"() => <InvestmentProjectLocalHeader investment={{\n  ...investment,\n  created_by: {}\n}} breadcrumbs={breadcrumbs} />",...CreatedByNoDbtTeam.parameters?.docs?.source}}}}}]);