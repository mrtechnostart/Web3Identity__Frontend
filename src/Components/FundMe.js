import React, { useEffect, useState } from 'react'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abiFundMe } from '../Constants/index'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'
const FundMe = () => {
  const dispatch = useNotification()
  const [ethValue,setEthValue] = useState("0")
  const [deployer,setDeployer] = useState("0x0")
  const [amount,setAmount] = useState(0)
  const [currentAccount,setCurrentAccount] = useState("0x0")
  const {isWeb3Enabled,account} = useMoralis()
  const {runContractFunction:fundContract,isLoading,isFetching } = useWeb3Contract({
    abi:abiFundMe,
    contractAddress:"0x5646C6e33beEf243d8d60828408d4a3c5A63E6Dd",
    functionName:"fundContract",
    msgValue:ethValue
  })
  const {runContractFunction:withdrawFund,isLoading:Load,isFetching:Fetch } = useWeb3Contract({
    abi:abiFundMe,
    contractAddress:"0x5646C6e33beEf243d8d60828408d4a3c5A63E6Dd",
    functionName:"withdrawFund"
  })
  const {runContractFunction:getmineth} = useWeb3Contract({
    abi:abiFundMe,
    contractAddress:"0x5646C6e33beEf243d8d60828408d4a3c5A63E6Dd",
    functionName:"getmineth"
  })
  const {runContractFunction:getDeployer} = useWeb3Contract({
    abi:abiFundMe,
    contractAddress:"0x5646C6e33beEf243d8d60828408d4a3c5A63E6Dd",
    functionName:"getDeployer"
  })
  async function getbasicdata(){
    if (isWeb3Enabled){
      const mineth = await getmineth()
      setEthValue(mineth)
      const deployer = await getDeployer()
      setDeployer(deployer)
      setCurrentAccount(account)
    }
  }
  const changeHandler = (e) => {
    setAmount(e.target.value);
  };
  const handleSubmit = async(e) =>{
    e.preventDefault()
    await fundContract({
      onSuccess:handleSuccess,
      onError:(error)=>handleError(error)
    })
  }
  async function handleSuccess(tx) {
    await tx.wait(1);
    handleNotification();
  }
  function handleNotification() {
    dispatch({
      type: "info",
      message: "Transaction Completed",
      title: "Tx Notification",
      position: "topR",
    });
  }
  async function handleError(error) {
    dispatch({
      type: "error",
      message: error,
    });
  }
  async function withdraw(){
    await withdrawFund({
      onSuccess:handleSuccess,
      onError:(error)=>handleError(error)
    })
  }
  /* Correctly Assign Dependencies List */
  useEffect(()=>{
    getbasicdata()
  },[isWeb3Enabled,account])
  return (
    <div>
      {deployer.toLowerCase()===currentAccount.toLowerCase()?<>
      Hello You are the deployer, Withdraw Your Funds Here: <div className="btn btn-primary" onClick={withdraw} disabled={Load&&Fetch}>Withdraw</div></>:<><form className="container" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            How Much You Wanna Donate
          </label>
          <input
            type="number"
            className="form-control"
            value={amount}
            onChange={changeHandler}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading || isFetching || ethValue > ethers.utils.parseEther(amount.toString()===""?"0":amount.toString())}>
          Donate Now!
        </button>
      </form></>}      
    </div>
  )
}

export default FundMe


