import React from 'react'
import { useRoutes } from 'react-router-dom'
import ViewAdvisor from './pages/ViewAdvisor'
import './App.css'

const App = () => {
  let element = useRoutes([
    // {
    //   path: '/',
    //   element: <Home title='' />
    // },
    {
      path:'/advisor/:id',
      element: <ViewAdvisor/>
    }
  ])

  return (
    <div className='app'>
      { element }
    </div>
  )
}

export default App
