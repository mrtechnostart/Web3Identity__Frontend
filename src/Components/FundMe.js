import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import { abi, abiFundMe, contractAddress } from "../Constants/index";
const FundMe = (props) => {
  const dispatch = useNotification();
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const DeployerContractAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  const [contract, setContract] = useState("0x0");
  const [amount, setAmount] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("0x0");
  const {
    runContractFunction: fundContract,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abiFundMe,
    contractAddress: contract,
    functionName: "fundContract",
    msgValue: ethers.utils.parseEther(amount.toString()),
  });
  const {
    runContractFunction: withdrawFund,
    isLoading: Load,
    isFetching: Fetch,
  } = useWeb3Contract({
    abi: abiFundMe,
    contractAddress: contract,
    functionName: "withdrawFund",
    params: {
      _owner: currentAccount,
    },
  });
  const { runContractFunction: getmineth } = useWeb3Contract({
    abi: abiFundMe,
    contractAddress: contract,
    functionName: "getmineth",
  });

  const { runContractFunction: getContracts } = useWeb3Contract({
    abi: abi,
    contractAddress: DeployerContractAddress,
    functionName: "getContracts",
    params: {
      _addr: props.deployerAddress,
    },
  });
  async function getbasicdata() {
    if (isWeb3Enabled) {
      const contractAddr = await getContracts();
      const mineth = await getmineth();
      setContract(contractAddr);
      setCurrentAccount(account);
    }
  }
  const changeHandler = (e) => {
    const amt = e.target.value;
    if (amt === "") setAmount("0");
    else setAmount(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      `Entered Handle Submit ${ethers.utils.parseEther(amount.toString())}`
    );
    await fundContract({
      onSuccess: handleSuccess,
      onError: (error) => handleError(error),
    });
  };

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
  async function withdraw() {
    await withdrawFund({
      onSuccess: handleSuccess,
      onError: (error) => handleError(error),
    });
  }
  /* Correctly Assign Dependencies List */
  useEffect(() => {
    getbasicdata();
  }, [isWeb3Enabled, account]);
  return (
    <>
      {!isWeb3Enabled ? (
        "Loading"
      ) : (
        <div>
          {props.deployerAddress.toLowerCase() ===
          currentAccount.toLowerCase() ? (
            <>
              {contract && contract.toString()}
              <br />
              Hello You are the deployer, Withdraw Your Funds Here:{" "}
              <button
                className="btn btn-primary"
                onClick={withdraw}
                disabled={Load || Fetch}
              >
                Withdraw
              </button>
            </>
          ) : (
            <>
              <form className="container" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    How Much You Wanna Donate
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={amount}
                    onChange={changeHandler}
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || isFetching}
                >
                  Donate Now!
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FundMe;
