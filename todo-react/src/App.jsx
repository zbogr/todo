import React from 'react'
import TodoApp from "./components/TodoApp"
import './App.css'

function App() {


  return (
    <>
     <div className='min-h-screen bg-gray-100 flex flex-col items-center p-6'>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        ToDo App (React + Node)
      </h1>
      <TodoApp />
     </div>
    </>
  )
}


export default App
