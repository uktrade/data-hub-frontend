/* eslint-disable */
import React from 'react'

type PushAnalytics = (
  category: string,
  action: string,
  label: string,
  extra?: Record<string, any>,
) => void

export type Props = {
  children: (pushAnalytics: PushAnalytics) => JSX.Element
}

export type Analytics = (props: Props) => JSX.Element
