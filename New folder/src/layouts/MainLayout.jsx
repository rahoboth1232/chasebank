import React from 'react'
import ChaseNavbar from '../components/MainNavbar'

const MainLayout = ({children}) => {
  return (
  <>
  <ChaseNavbar/>
   {children}
   </>
  )
}

export default MainLayout
