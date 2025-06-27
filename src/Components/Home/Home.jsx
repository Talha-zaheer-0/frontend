import React from 'react'
import Collection from './Child/Collection'
import Men from "../Home/Child/Men"
import Kid from "../Home/Child/Kid"
import Women from "../Home/Child/Women"
// import Electric from './Child/Electric'
// import Cosmetics from './Child/Cosmatics'
import Sales from './Child/Sale'
const Home = () => {
  return (
    <div>
      <Sales />
      <Men />
      <Women />
      <Kid />
      {/* <Collection /> */}
      {/* <Electric /> */}
      {/* <Cosmetics /> */}
      
    </div>
  )
}

export default Home