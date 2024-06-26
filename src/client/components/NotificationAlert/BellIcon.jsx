import React from 'react'

export default ({ id, ...props }) => {
  const titleId = `${props.id}-title`
  const descId = `${props.id}-desc`
  return (
    <svg
      role="img"
      id={id}
      {...props}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 18 18"
      width="18"
      height="18"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>
        An image of a bell with the notification count overlaid
      </title>
      <desc id={descId}>
        An image of a bell with the notification count overlaid
      </desc>
      <path
        fill="#FFF"
        d="M6.9,15.9C6.9,15.9,6.9,15.9,6.9,15.9c0,1.2,1,2.1,2.1,2.1s2.1-1,2.1-2.1c0,0,0,0,0,0H6.9L6.9,15.9z M15.8,13.2
    l-1.9-2.8V6.8c0-2.4-1.7-4.4-3.9-4.8V1c0-0.5-0.4-1-1-1C8.5,0,8,0.4,8,1V2C5.8,2.5,4.1,4.5,4.1,6.8v3.5l-1.9,2.8
    c-0.3,0.4-0.2,1,0.3,1.3c0.2,0.1,0.4,0.2,0.5,0.2h12c0.5,0,1-0.4,1-1C16,13.5,15.9,13.3,15.8,13.2z"
      />
    </svg>
  )
}
