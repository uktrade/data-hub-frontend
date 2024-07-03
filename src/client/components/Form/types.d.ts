/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React from 'react'

type Values = Record<string, string>
type Errors = Record<string, string>
type FlashMessageHeading = string
type FlashMessageBody = string
type FlashMessageType = 'info' | 'success' | 'warning' | 'error' | 'muted'
type FlashMessage = FlashMessageBody | [FlashMessageHeading, FlashMessageBody, FlashMessageType?]

type ChildFn = ({
  errors: Errors,
  values: Values,
  // TODO: Type all the method injected by the context
}) => React.ReactNode
type Children = React.ReactNode | ChildFn

type OnSuccessActions = {
  hardRedirect: (to: string) => any,
  softRedirect: (to: string) => any,
  flashMessage: (message: FlashMessage) => any,
}

export type Props = {
  submissionTaskName: string,
  id: string,
  analyticsFormName: string,
  analyticsData?: (values: Values) => object,
  cancelRedirectTo?: () => string,
  cancelButtonLabel?: string | React.ReactNode,
  initialValuesTaskName?: string,
  initialValuesPayload?: any,
  initialValues?: Record<string, any>,
  redirectTo?: (successActionResult: any, values: Values) => string,
  redirectMode?: 'hard' | 'soft',
  flashMessage?: (successActionResult: any, values: Values) => FlashMessage,
  onSuccess?: (successActionResult: any, values: Values, actions: OnSuccessActions) => any,
  transformInitialValues?: (initialValuesTaskResult: any) => Values,
  transformPayload?: (values: Values) => any,
  submissionTaskResultToValues?: (result: any) => Values,
  children?: Children,
  submitButtonLabel?: string,
  submitButtonColour?: string,
  initialStepIndex?: number,
}

export type Form = (props: Props) => any
