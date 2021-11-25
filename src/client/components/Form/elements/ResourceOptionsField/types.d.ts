/* eslint-disable */
/* eslint-disable prettier/prettier */
import React from 'react'

type ResourceProps = {
  id: string,
  name?: string,
  payload?: any,
}

type Option = {
  value: string,
  label: string,
  children?: React.ReactNode,
  hint: string,
}

type Props = {
  resource: (props: ResourceProps) => any,
  resultToOptions?: (result: any) => {label: string, value: string | number}[],
  interceptOption?: (option: Option) => Option,
} | {
  taskName: string,
  id: string,
} & {
  field: (props: any) => any,
  id?: string,
}

export type ResourceOptionsField = (props: Props) => JSX.Element
