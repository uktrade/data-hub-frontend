/* eslint-disable */
/* eslint-disable prettier/prettier */
import React from 'react'

type ResourceProps = {
  id: string,
  name?: string,
  payload?: any,
}

type Props = {
  resource: (props: ResourceProps) => any
} | {
  taskName: string,
  id: string,
} & {
  field: (props: any) => any,
  id?: string,
  resultToOptions?: (result: any) => {label: string, value: string | number}[],
}

export type ResourceOptionsField = (props: Props) => JSX.Element
