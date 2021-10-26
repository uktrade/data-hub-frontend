/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import React from 'react'

type GovukReactLinkProps = {
  href: string,
  children: React.ReactChild
}
type ReactRouterLinkProps = {
  to: string,
  children: React.ReactChild
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

export type Props = {
  submissionTaskName: string,
  id: string,
  analyticsFormName: string,
  initialValuesTaskName?: string,
  redirectTo: (successActionResult: any, values: Values) => string,
  flashMessage: (successActionResult: any, values: Values) => FlashMessage,
  transformInitialValues?: (initialValuesTaskResult: any) => Values,
  transformPayload?: (values: Values) => any,
  actionLinks?: LinkProps[],
  children?: Children,
}

export type TaskForm = (props: Props) => any
