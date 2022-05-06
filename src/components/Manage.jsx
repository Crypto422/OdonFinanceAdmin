import React, { useEffect, useRef, useState, useContext } from "react";
import { HiArrowSmDown } from "react-icons/hi";
import { BsCoin } from "react-icons/bs";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { AiFillWarning } from "react-icons/ai";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BiHappyBeaming } from "react-icons/bi";
import { WithDraw } from "./WithDraw";
// import { AutoLiquidate } from "./AutoLiquidate";

const LendDetail = ({
  isShow,
  setIsShow,
  information,
  mType,
  setIsProceeding,
  lendRef,
}) => {
  const {
    getUsdcTokenContract,
    getUsdtTokenContract,
    getBtcTokenContract,
    library,
    themeMode,
    getLoanContract,
    getAccUSDCBalance,
    getAccUSDTBalance,
    getAccBTCBalance,
    setContractTotalLiquidity
  } =
    useContext(LendAndLoanContext);
  const [isApproving, setIsApproving] = useState(false);
  const [goingToConfirm, setGoingToConfirm] = useState(false);
  const [approveTransactionDetail, setApproveTransactionDetail] = useState();
  const [lendTokenHash, setLendTokenHash] = useState();
  const [isConfirm, setIsConfirm] = useState();
  const [isDone, setIsDone] = useState(false);
  const [loanContractAddress, setContractAddress] = useState('');

  const close = () => {
    setIsShow(false);
    setTimeout(() => {
      setIsApproving(false);
      setGoingToConfirm(false);
      setIsConfirm(false);
      setIsDone(false);
      setIsProceeding(false);
      setApproveTransactionDetail({});
      lendRef.current.value = "";
    }, 300);
  };

  useEffect(() => {
    if(library){
      const loanContract = getLoanContract(library.getSigner());
      setContractAddress(loanContract.address);
    }
  }, [library])
  const handleApprove = async () => {
    setIsApproving(true);
    let contract;
    if (mType === 2) {
      contract = getUsdcTokenContract(library.getSigner());
    } else if (mType === 3) {
      contract = getUsdtTokenContract(library.getSigner());
    } else if (mType === 4) {
      contract = getBtcTokenContract(library.getSigner());
    }


    const res = await contract
      .approve(
        loanContractAddress,
        ethers.utils.parseUnits(information.amount, 18)
      )
      .catch((err) => setIsApproving(false));
    const data = await res.wait();
    setApproveTransactionDetail({
      hash: data.transactionHash,
    });
    setGoingToConfirm(true);
  };
  const handleLendToken = async () => {
    setIsConfirm(true);
    const contract = getLoanContract(library.getSigner());
    const res = await contract
      .depositToken(ethers.utils.parseUnits(information.amount, 18), mType)
      .catch((err) => {
        setIsConfirm(false)
        console.log("err", err)
      });
    const data = await res.wait();
    setLendTokenHash(data.transactionHash);
    setContractTotalLiquidity();
    setIsConfirm(false);
    setIsDone(true);
  };
  return (
    <div
      className={
        `absolute left-[50%] top-[50%] w-[90%] md:max-w-[380px] -translate-x-[50%] -translate-y-[50%] ${themeMode ? ' bg-gray-200':'  bg-[#191b1f]'} mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 ` +
        (isShow ? "scale-100" : "")
      }
    >
      <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full text-black">
        <IoIosCloseCircleOutline
          className={"text-4xl cursor-pointer hover:text-gray-400 transition" + (themeMode ? "":" text-white")}
          onClick={() => close()}
        />
      </div>

      {isDone ? (
        <div className={(themeMode ? " text-black" : "")}>
          <div className="text-2xl flex items-center">
            Deposite status:{" "}
            <b className="ml-1 text-green-500 flex items-center">
              Success <BiHappyBeaming className="ml-1" />
            </b>
          </div>
          <div className="break-words mt-5">
            Transaction Hash:
            <a
              rel="noreferrer noopenner"
              target="_blank"
              href={"https://moonriver.moonscan.io/tx/" + lendTokenHash}
            >
              {lendTokenHash}
            </a>
          </div>
        </div>
      ) : goingToConfirm ? (
        <div className={(themeMode ? " text-black" : "")}>
          <div>Deposite amount: {information.amount}&nbsp;
            {mType === 2 && "USDC"}
            {mType === 3 && "USDT"}
            {mType === 4 && "WBTC"}
          </div>
          <div className="break-words">
            Approve Transaction Hash:{" "}
            <a
              target="_blank"
              rel="noopenner noreferrer"
              href={
                "https://moonriver.moonscan.io/tx/" +
                approveTransactionDetail.hash
              }
            >
              {approveTransactionDetail.hash}
            </a>
          </div>
          {isConfirm ? (
            <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
          ) : (
            <div
              onClick={() => handleLendToken()}
              className={"rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-fit text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition" + (themeMode ? " text-white":"")}
            >
              Confirm Deposite
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className={"break-words my-2" + (themeMode ? " text-black":"")}>
            Approve spender address:{" "}
            <a
              title="Open contract"
              target="_blank"
              rel="noopenner noreferrer"
              href={
                "https://moonriver.moonscan.io/address/" +
                loanContractAddress
              }
            >
              {loanContractAddress}
            </a>
          </div>
          <div className={"my-2" + (themeMode ? " text-black":"")}>
            Approve amount: {information.amount}&nbsp;
            {mType === 2 && "USDC"}
            {mType === 3 && "USDT"}
            {mType === 4 && "WBTC"}
          </div>
          <div className="my-2">
            {" "}
            {mType === 2 ? (getAccUSDCBalance() >= information.amount ? (
              isApproving ? (
                <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
              ) : (
                <div
                  onClick={() => handleApprove()}
                  className={"rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"  + (themeMode ? " text-white":"")}
                >
                  Approve
                </div>
              )
            ) : (
              <div className="flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                Not enough balance!
              </div>
            )) : <></>}

            {mType === 3 ? (getAccUSDTBalance() >= information.amount ? (
              isApproving ? (
                <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
              ) : (
                <div
                  onClick={() => handleApprove()}
                  className="rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"
                >
                  Approve
                </div>
              )
            ) : (
              <div className="flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                Not enough balance!
              </div>
            )) : <></>}

            {mType === 4 ? (getAccBTCBalance() >= information.amount ? (
              isApproving ? (
                <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full  mx-auto"></div>
              ) : (
                <div
                  onClick={() => handleApprove()}
                  className="rounded mx-auto my-5 px-3 py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-xl md:text-2xl shadow font-bold hover:opacity-100 transition"
                >
                  Approve
                </div>
              )
            ) : (
              <div className="flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                Not enough balance!
              </div>
            )) : <></>}
          </div>
        </div>
      )}
    </div>
  );
};

function Manage() {
  const {
    account,
    connectWallet,
    themeMode,
    setContractTotalLiquidity,
  } = useContext(LendAndLoanContext);

  const [isDropDown, setIsDropDown] = useState(false);
  const [mType, setLendType] = useState(2);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isValidLendAmount, setIsValidLendAmount] = useState(true);
  const [isShowLendDetail, setIsShowLendDetail] = useState(false);
  const [lendSuccessInformation, setLendSuccessInformation] = useState();
  const dropDownRef = useRef();
  const lendInputRef = useRef();

  const handleKeyDown = (e) => {
    if (e.keyCode == 189 || e.keyCode == 109 || e.keyCode == 107) {
      e.preventDefault();
    }
  };

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setIsDropDown(false);
    }
  };

  const handleLend = async () => {
    let validateValue;
    if (mType === 2) {
      validateValue = 0.01;
    } else if (mType === 3) {
      validateValue = 0.01;
    } else if (mType === 4) {
      validateValue = 0.001;
    } 
    if (lendInputRef.current.value >= validateValue) {
      setIsProceeding(true);
      //const res = await contract.lendToken(lendInputRef.current.value);
      setLendSuccessInformation({
        lender: account,
        amount: lendInputRef.current.value,
      });
      setIsShowLendDetail(true);
    } else {
      setIsValidLendAmount(false);
    }
    setContractTotalLiquidity();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDropButtonClick = (id) => {
    if (id === 2) {
      setLendType(2);
    } else if (id === 3) {
      setLendType(3);
    } else if (id === 4) {
      setLendType(4);
    }
  }

  return (
    <>
    {/* <AutoLiquidate/> */}
    <div className="mt-10 md:mt-24">
      <LendDetail
        lendRef={lendInputRef}
        setIsProceeding={setIsProceeding}
        mType={mType}
        isShow={isShowLendDetail}
        setIsShow={setIsShowLendDetail}
        information={lendSuccessInformation ? lendSuccessInformation : {}}
      />

      <div className="mx-5 md:mx-auto w-[fit-content]">
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Deposite</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          <div>
            <p className="my-1 mb-2">How much do you want to deposite?</p>
            <div className={"flex items-center w-full rounded h-16 outline-none px-5  border-[1px] border-transparent hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]")}>
              <input
                ref={lendInputRef}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <div className="relative ml-5 group">
                <div
                  ref={dropDownRef}
                  onClick={() => {
                    isDropDown ? setIsDropDown(false) : setIsDropDown(true);
                  }}
                  className={"cursor-pointer relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
                >
                  {mType === 2 && (
                    <p className="px-2">USDC</p>
                  )}
                  {mType === 3 && (
                    <p className="px-2">USDT</p>
                  )}
                  {mType === 4 && (
                    <p className="px-2">WBTC</p>
                  )}
                  <HiArrowSmDown className="text-2xl md:text-3xl" />
                </div>
                {isDropDown ? (
                  <div className={"absolute top-[110%] shadow shadow-gray-400 rounded hover:shadow-gray-600 overflow-hidden" + (themeMode ? " bg-white" : " bg-[#1a1c20c2]")}>
                    <div
                      onClick={() => handleDropButtonClick(2)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      USDC{" "}
                    </div>
                    <div
                      onClick={() => handleDropButtonClick(3)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      USDT{" "}
                    </div>
                    <div
                      onClick={() => handleDropButtonClick(4)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      WBTC{" "}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="my-4 text-right text-sm cursor-auto select-none">
       
            </div>
            {!isValidLendAmount && (
              <div className="p-0 flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                <div>
                  {mType === 2 && "Minimum lend amount 0.01 USDC"}
                  {mType === 3 && "Minimum lend amount 0.01 USDT"}
                  {mType === 4 && "Minimum lend amount 0.001 WBTC"}
                </div>
              </div>
            )}

            <div className={"p-0 flex justify-center items-center" + (themeMode ? " text-[#a78913]":" text-yellow-300")}>
            </div>
            {!account ? (
              <div
                onClick={() => connectWallet()}
                className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
              >
                Connect Wallet
              </div>
            ) : isProceeding ? (
              <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
            ) : (
              <div
                onClick={() => handleLend()}
                className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
              >
                Deposite
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <WithDraw/>
    </>
    
  );
}


export { Manage }
