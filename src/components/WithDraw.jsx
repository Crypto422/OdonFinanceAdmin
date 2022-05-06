import { ethers } from "ethers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { AiFillWarning } from "react-icons/ai";
import { HiArrowSmDown } from "react-icons/hi";
import { BsCoin } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import LoanConfirm from "./LoanConfirm";
import "react-toastify/dist/ReactToastify.css";

function WithDraw() {
  const {
    account,
    connectWallet,
    themeMode,
    getLoanContract,
    library
  } = useContext(LendAndLoanContext);

  const [isDropDown, setIsDropDown] = useState(false);
  const [mType, setLoanType] = useState(2);
  const [isValidLoanAmount, setIsValidLoanAmount] = useState(true);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isShowLoanDetails, setIsShowLoanDetails] = useState(false);
  const [loanInformation, setLoanInformation] = useState();
  const [validateLoanAmount, setValidateLoanAmount] = useState(0.1);
  const ethInputRef = useRef();
  const dropDownRef = useRef();

  const notify = () =>
    toast.error("Sorry, contract does not has enough liquidity!");

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setIsDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLoanProceed = async () => {
    if (ethInputRef.current.value < validateLoanAmount) {
      setIsValidLoanAmount(false);
    } else {
      setIsProceeding(true);
      setIsValidLoanAmount(true);
      const contract = getLoanContract(library.getSigner());

      let decimal;
      if (mType === 2) {
        decimal = 6
      } else if (mType === 3) {
        decimal = 6
      } else if (mType === 4) {
        decimal = 8
      }
      else if (mType === 5) {
        decimal = 18
      }

      const loanAmountToWei = ethers.utils.parseUnits(
        ethInputRef.current.value,
        decimal
      );
      const res = await contract.checkEnoughLiquidity(loanAmountToWei, mType);
      if (res) {
        // enough liquidity
        setIsShowLoanDetails(true);
        setIsValidLoanAmount(true);
        setLoanInformation({
          loanAmount: ethInputRef.current.value,
          mtype: mType
        });
      } else {
        notify();
        setIsProceeding(false);
      }

    }
  };

  const handleDropClick = (_type) => {
    setLoanType(() => _type);
    if (_type === 2) {
      setValidateLoanAmount(0.01);
    } else if (_type === 3) {
      setValidateLoanAmount(0.01);
    } else if (_type === 4) {
      setValidateLoanAmount(0.0001);
    }
    else if (_type === 5) {
      setValidateLoanAmount(0.5);
    }
  }

  return (
    <div className={"mt-10 md:mt-24 mb-24"}>
      <LoanConfirm
        ethRef={ethInputRef}
        cancel={() => setIsShowLoanDetails(false)}
        isShow={isShowLoanDetails}
        setIsProceeding={setIsProceeding}
        information={loanInformation ? loanInformation : {}}
      />

      <ToastContainer theme={themeMode ? "light" : "dark"} />
      <div className={"mx-5 md:mx-auto w-[fit-content]"}>
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>WithDraw</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          {" "}
          <div className="mt-3">
            <p className="my-1 mb-2">
              How much do you want to withdraw?
            </p>
            <div className={"flex items-center w-full rounded h-16 outline-none px-5  border-[1px] border-transparent hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]")}>
              <input
                name="eth"
                ref={ethInputRef}
                type="number"
                min="0"
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
                  {mType === 5 && (
                    <p className="px-2">ODON</p>
                  )}
                  <HiArrowSmDown className="text-2xl md:text-3xl" />
                </div>
                {isDropDown ? (
                  <div className={"absolute top-[110%] shadow shadow-gray-400 rounded z-30 hover:shadow-gray-600 overflow-hidden" + (themeMode ? " bg-white" : " bg-[#1a1c20c2]")}>
                    <div
                      onClick={() => handleDropClick(2)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      USDC{" "}
                    </div>
                    <div
                      onClick={() => handleDropClick(3)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      USDT{" "}
                    </div>
                    <div
                      onClick={() => handleDropClick(4)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      WBTC{" "}
                    </div>
                    <div
                      onClick={() => handleDropClick(5)}
                      className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      <BsCoin className="mr-2" />
                      ODON{" "}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>

          {!isValidLoanAmount && (
            <p className="p-0 flex justify-center items-center text-red-500">
              <AiFillWarning className="mr-2" />
              Minimum withdraw amount is {validateLoanAmount}&nbsp;
              {mType === 2 && "USDC"}
              {mType === 3 && "USDT"}
              {mType === 4 && "WBTC"}
              {mType === 5 && "ODON"}
            </p>
          )}

          {!account ? (
            <div
              onClick={() => connectWallet()}
              className={"mt-3 px-2  py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Connect Wallet
            </div>
          ) : !isProceeding ? (
            <div
              onClick={() => handleLoanProceed()}
              className={"mt-3 px-2 mt-8  py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              WithDraw
            </div>
          ) : (
            <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export { WithDraw }
