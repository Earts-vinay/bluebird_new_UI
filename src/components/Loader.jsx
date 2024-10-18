import React from 'react'
const PublicUrl = process.env.PUBLIC_URL
const Loader = () => {
  return (
    <>
    <img src= {PublicUrl + "/assets/icons/loader.gif"} alt="" width="50px" height="50px" />
    </>
  )
}

export default Loader