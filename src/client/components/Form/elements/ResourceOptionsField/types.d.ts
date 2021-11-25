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

export type CommonProps = {
  field: (props: any) => any,
  id?: string,
  resultToOptions?: (result: any) => {label: string, value: string | number}[],
  interceptOption?: (option: Option) => Option,
}

export type TaskPropsMixin = {
  taskName: string,
  id: string,
}

export type ResourcePropsMixin = {
  resource: (props: ResourceProps) => any,
}



export type Props = CommonProps & (TaskPropsMixin | ResourcePropsMixin)

export type ResourceOptionsField = (props: Props) => JSX.Element
