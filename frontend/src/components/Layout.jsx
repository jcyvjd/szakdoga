import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
        {/* Your header content goes here */}
      </header>

      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer>
        {/* Your footer content goes here */}
      </footer>
    </div>
  )
}

export default Layout
