import React, { useEffect, useState } from 'react'
import FundMe from './FundMe'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const MultiPage = () => {
    const {addr} = useParams()    
    const [contract,setContract ] = useState("0x0")
    useEffect(()=>{
        async function getData(){
            const data = await axios.get("http://localhost:4004/postdata/"+addr)
            setContract(data["data"]["task"]["contract"])
        }
        getData()
    })
  return (
    <div>
      <FundMe/>
      {contract}
    </div>
  )
}

export default MultiPage
