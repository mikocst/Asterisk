import React from 'react'
import { Clock } from 'feather-icons-react'

const CreatedNoteDate = () => {
  return (
    <div className = "flex flex-row justify-between">
            <div className = "flex flex-row gap-2">
                <Clock size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">Created at</p>
            </div>
    </div>
  )
}

export default CreatedNoteDate