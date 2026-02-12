import React from 'react'
import { Clock } from 'feather-icons-react'

//need to link this to an id

const CreatedNoteDate = () => {

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})

  return (
    <div className = "flex flex-row justify-between">
            <div className = "flex flex-row gap-2 items-center">
                <Clock size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">Created at {formattedDate}</p>
            </div>
    </div>
  )
}

export default CreatedNoteDate