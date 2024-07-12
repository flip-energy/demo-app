import React from 'react'

type ContainerProps = {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col min-h-screen py-4">{children}</div>
    </div>
  )
}

export default Container
