import React, { useEffect, useState } from "react";
import { abi, contractAddress } from "../Constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import axios from "axios";
const Web3Caller = () => {
  const [username, setUsername] = useState("Username Here");
  const [contractAddressed, setContractAddress] = useState("0x0");
  const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ContractAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const mineth = ethers.utils.parseEther("0.001");

  const { runContractFunction: deployFundMe } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "deployFundMe",
    params: {
      mineth: mineth,
    },
  });
  const { runContractFunction: getContracts } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "getContracts",
    params: {
      _addr: account,
    },
  });

  const changeHandler = (e) => {
    setUsername(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const contractAddress = await getContracts();
    try {
      await deployFundMe();
    } catch (error) {}
    setContractAddress(contractAddress);
    await axios.post("http://localhost:4004/postdata", {
      deployer: account,
      contract: contractAddressed,
      name: username,
    });
    setUsername("");
  };
  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="email"
            className="form-control"
            value={username}
            onChange={changeHandler}
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Web3Caller;
