import React from 'react'
import FaqCard from './FaqCard'
import { faqs } from './../../assets/data/faqs'

const FaqList = () => {
  return (
    <div className="space-y-4">
      {faqs.map((item, index) => (
        <FaqCard key={index} item={item} index={index} />
      ))}
    </div>
  )
}

export default FaqList