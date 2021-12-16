/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React from 'react'

type GovukReactLinkProps = {
  href: string,
  children: React.ReactChild,
}
type ReactRouterLinkProps = {
  to: string,
  children: React.ReactChild,
}
type LinkProps = GovukReactLinkProps | ReactRouterLinkProps

type Values = Record<string, string>
type Errors = Record<string, string>
type FlashMessageHeading = string
type FlashMessageBody = string
type FlashMessage = FlashMessageBody | [FlashMessageHeading, FlashMessageBody]

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
  actionLinks?: LinkProps[],
  children?: Children,
  submitButtonLabel?: string,
  submitButtonColour?: string,
  initialStepIndex?: number,
}

export type TaskForm = (props: Props) => any
