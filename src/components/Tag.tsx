import React from 'react'

interface TagProps {
  tagName: string
  children: any
  [key: string]: any
}

const Tag = ({ tagName, children, ...props }: TagProps) =>
  React.createElement(tagName, props, children)

export default Tag
