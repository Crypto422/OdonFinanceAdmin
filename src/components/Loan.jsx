import { ethers } from "ethers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { FaEthereum } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import { HiArrowSmDown } from "react-icons/hi";
import { BsCoin } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import LoanConfirm from "./LoanConfirm";
import "react-toastify/dist/ReactToastify.css";


const DaySelection = ({ content, isActive, handleOnClick }) => {
  const { themeMode } =
    useContext(LendAndLoanContext);
  const commonCss =
    (`flex-1 text-center h-full px-1 py-[5px] cursor-pointer ${themeMode ? " hover:text-gray-600" : " hover:text-gray-300"} transition focus:text-gray-900 select-none rounded-full `);
  return (
    <div
      onClick={handleOnClick}
      className={
        commonCss +
        (isActive == content
          ? (`${themeMode ? 'text-gray-800' : 'text-white'} shadow shadow-blue-500 duration-100`)
          : "")
      }
    >
      {content} days
    </div>
  );
};

export default function Loan() {
  const {
    account,
    connectWallet,
    themeMode,
    usdcBorrowApy,
    usdtBorrowApy,
    btcBorrowApy,
    firstAddApy,
    secondAddApy,
    loanModeFirst,
    getLoanContract,
    library,
    usdcLTV,
    usdtLTV,
    btcLTV
  } = useContext(LendAndLoanContext);

  const [isActive, setIsActive] = useState(30);
  const [isDropDown, setIsDropDown] = useState(false);
  const [isCDropDown, setIsCDropDown] = useState(false);
  const [currentTarget, setTarget] = useState('eth');
  const [mType, setLoanType] = useState(2);
  const [cType, setCollateralType] = useState(5);
  const [isFetchingAmont, setIsFetchingAmount] = useState(false);
  const [isValidLoanAmount, setIsValidLoanAmount] = useState(true);
  const [isProceeding, setIsProceeding] = useState(false);
  const [isShowLoanDetails, setIsShowLoanDetails] = useState(false);
  const [loanInformation, setLoanInformation] = useState();
  const [loanAPY, setLoanAPY] = useState(usdcBorrowApy);
  const [validateLoanAmount, setValidateLoanAmount] = useState(0.1);
  const [apy, setAPY] = useState();
  const ethInputRef = useRef();
  const dropDownRef = useRef();
  const cdropDownRef = useRef();
  const odonInputRef = useRef();
  const interval = 700;
  let typingTimer;

  const notify = () =>
    toast.error("Sorry, contract does not has enough liquidity!");

  const handleKeyDown = (e) => {
    if (e.keyCode == 189 || e.keyCode == 109 || e.keyCode == 107) {
      setIsFetchingAmount(false);
      e.preventDefault();
    }
  };

  const handleClickOutside = (e) => {
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setIsDropDown(false);
    }
  };

  const handleClickCOutside = (e) => {
    if (cdropDownRef.current && !cdropDownRef.current.contains(e.target)) {
      setIsCDropDown(false);
    }
  };

  const handleKeyUp = (e) => {
    clearTimeout(typingTimer);
    setTarget(e.target.name);
    typingTimer = setTimeout(() => handleOnChange(e.target.name, mType, cType), interval);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickCOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleClickCOutside);
    };
  }, []);



  const handleOnChange = async (target, mtype, ctype) => {
    const contract = getLoanContract(library);
    if (target == "eth") {
      if (ethInputRef.current.value) {
        setIsFetchingAmount(true);
        const convertedToWei = ethers.utils.parseUnits(
          ethInputRef.current.value,
          18
        );
        const res = await contract.collateralAmount(convertedToWei, mtype, ctype);
        odonInputRef.current.value = ethers.utils.formatUnits(res, 18);
        setIsFetchingAmount(false);
      } else {
        odonInputRef.current.value = "";
      }
    } else {
      // odon
      if (odonInputRef.current.value) {
        setIsFetchingAmount(true);
        const convertedToWei = ethers.utils.parseUnits(
          odonInputRef.current.value,
          18
        );
        let res = await contract.loanAmount(convertedToWei, mtype, ctype);
        ethInputRef.current.value = ethers.utils.formatUnits(res, 18);
        setIsFetchingAmount(false);
      } else {
        ethInputRef.current.value = "";
      }
    }
  };

  const handleLoanProceed = async () => {
    if (ethInputRef.current.value < validateLoanAmount) {
      setIsValidLoanAmount(false);
    } else {
      setIsProceeding(true);
      const contract = getLoanContract(library.getSigner());
      const loanAmountToWei = ethers.utils.parseUnits(
        ethInputRef.current.value,
        18
      );
      const res = await contract.checkEnoughLiquidity(loanAmountToWei, mType);
      if (res) {
        // enough liquidity
        setIsShowLoanDetails(true);
        let date = new Date();
        date.setDate(date.getDate() + isActive);
        setIsValidLoanAmount(true);
        setLoanInformation({
          lender: account,
          loanAmount: ethInputRef.current.value,
          collateralAmount: odonInputRef.current.value,
          duration: isActive,
          dateNow: date,
          rate: apy,
          mtype: mType,
          ctype: cType
        });
        // const res = await contract.loanEther(loanAmountToWei, isActive);
        // console.log(res);
      } else {
        notify();
      }
      setIsProceeding(false);
    }
  };

  const handleDropClick = (_type) => {
    setLoanType(() => _type);
    handleOnChange(currentTarget, _type, cType);
    let loanapy;
    if (_type === 2) {
      loanapy = usdcBorrowApy;
      setLoanAPY(usdcBorrowApy);
      setValidateLoanAmount(0.1);
    } else if (_type === 3) {
      loanapy = usdtBorrowApy;
      setLoanAPY(usdtBorrowApy);
      setValidateLoanAmount(0.05);
    } else if (_type === 4) {
      loanapy = btcBorrowApy;
      setLoanAPY(btcBorrowApy);
      setValidateLoanAmount(0.03);
    }

    if (isActive === 7 || isActive === 30) {
      setAPY(loanapy);
    } else if (isActive === 14 || isActive === 60) {
      let apy = loanapy + firstAddApy;
      setAPY(apy);
    } else if (isActive === 30 || isActive === 90) {
      let apy = loanapy + secondAddApy
      setAPY(apy)
    }
  }

  useEffect(() => {
    if (isActive === 7 || isActive === 30) {
      setAPY(loanAPY);
    } else if (isActive === 14 || isActive === 60) {
      let apy = loanAPY + firstAddApy;
      setAPY(apy);
    } else if (isActive === 30 || isActive === 90) {
      let apy = loanAPY + secondAddApy
      setAPY(apy)
    }
  }, [isActive])

  const handleCDropClick = (_type) => {
    setCollateralType(() => _type);
    handleOnChange(currentTarget, mType, _type);
  }

  useEffect(() => {
    if (usdcBorrowApy) {
      setLoanAPY(usdcBorrowApy);
      setAPY(usdcBorrowApy);
    }
  }, [usdcBorrowApy])

  return (
    <div className={"mt-10 md:mt-24"}>
      <LoanConfirm
        ethRef={ethInputRef}
        odonRef={odonInputRef}
        cancel={() => setIsShowLoanDetails(false)}
        isShow={isShowLoanDetails}
        information={loanInformation ? loanInformation : {}}
      />

      <ToastContainer theme={themeMode ? "light" : "dark"} />
      <div className={"w-auto mx-5 md:max-w-[450px] md:mx-auto "}>
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Loan</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          {" "}
          <div className="mt-3">
            <p className="my-1 mb-2">
              How much do you want to borrow?
            </p>
            <div className={"flex items-center w-full rounded h-16 outline-none px-5  border-[1px] border-transparent hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]")}>
              <input
                name="eth"
                ref={ethInputRef}
                onKeyUp={(e) => handleKeyUp(e)}
                onKeyDown={(e) => handleKeyDown(e)}
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
                  {/* {mType === 1 && (
                    <p className="px-2">ETH</p>
                  )} */}
                  {mType === 2 && (
                    <p className="px-2">USDC</p>
                  )}
                  {mType === 3 && (
                    <p className="px-2">USDT</p>
                  )}
                  {mType === 4 && (
                    <p className="px-2">BTC</p>
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
                      BTC{" "}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className={"mt-5 z-[-1] flex items-center w-full rounded h-16 outline-none px-5  border-[1px] border-transparent hover:border-gray-600 transition" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]")}>
            <input
              name="odon"
              ref={odonInputRef}
              onKeyUp={(e) => handleKeyUp(e)}
              onKeyDown={(e) => handleKeyDown(e)}
              type="number"
              className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
              placeholder="0.0"
              autoComplete="off"
            />
            <div className="relative ml-5 group">
              <div
                ref={cdropDownRef}
                // onClick={() => {
                //   isCDropDown ? setIsCDropDown(false) : setIsCDropDown(true);
                // }}
                className={"cursor-pointer relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
              >
                {/* {cType === 1 && (
                  <p className="px-2">ETH</p>
                )} */}
                {cType === 5 && (
                  <p className="px-2">ODON</p>
                )}
                {/* <HiArrowSmDown className="text-2xl md:text-3xl" /> */}
              </div>
              {isCDropDown ? (
                <div className={"absolute top-[110%] shadow shadow-gray-400 rounded hover:shadow-gray-600 overflow-hidden" + (themeMode ? " bg-white" : " bg-[#1a1c20c2]")}>
                  <div
                    onClick={() => handleCDropClick(1)}
                    className="flex items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                  >
                    <FaEthereum className="mr-2" />
                    ETH{" "}
                  </div>
                  <div
                    onClick={() => handleCDropClick(5)}
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
          <p className="my-1 mb-2">Specify collateral to deposit</p>
          {!isValidLoanAmount && (
            <p className="font-light text-red-500 flex items-center select-none">
              <AiFillWarning className="mr-2" />
              Minumum loan amount is {validateLoanAmount}&nbsp;
              {mType === 2 && "USDC"}
              {mType === 3 && "USDT"}
              {mType === 4 && "BTC"}
            </p>
          )}
          {isFetchingAmont && (
            <div className="mt-4 flex items-center">
              <div className="w-5 h-5 border-t-2 border-blue-700 rounded-full animate-spin "></div>
              <div className="ml-3 text-sm animate-pulse">
                Fetching best price...
              </div>
            </div>
          )}
          {
            mType === 2 &&
            <p className={"text-right text-sm select-none cursor-auto my-1 mb-2" + (themeMode ? " text-black" : " text-gray-200")}>
              Standard LTV:{" "}
              {usdcLTV ? usdcLTV : "Fetching..."}&nbsp;%
            </p>
          }
          {
            mType === 3 &&
            <p className={"text-right text-sm select-none cursor-auto my-1 mb-2" + (themeMode ? " text-black" : " text-gray-200")}>
              Standard LTV:{" "}
              {usdcLTV ? usdtLTV : "Fetching..."}&nbsp;%
            </p>
          }
          {
            mType === 4 &&
            <p className={"text-right text-sm select-none cursor-auto my-1 mb-2" + (themeMode ? " text-black" : " text-gray-200")}>
              Standard LTV:{" "}
              {usdcLTV ? btcLTV : "Fetching..."}&nbsp;%
            </p>
          }

          <p className={"text-right text-sm select-none cursor-auto my-1 mb-2" + (themeMode ? " text-black" : " text-gray-200")}>
            Borrow Rate:{" "}
            {apy ? apy : "Fetching..."}&nbsp;%
          </p>
          <div className={"mb-4 mt-2 flex items-center shadow shadow-gray-500 justify-center w-[80%] mx-auto rounded-full shadow"}>
            {
              loanModeFirst ? (
                <>
                  {[7, 14, 30].map((element, index) => (
                    <DaySelection
                      key={element + index}
                      content={element}
                      themeMode={themeMode}
                      handleOnClick={() => setIsActive(element)}
                      isActive={isActive}
                    />
                  ))}
                </>
              ) : (
                <>
                  {[30, 60, 90].map((element, index) => (
                    <DaySelection
                      key={element + index}
                      content={element}
                      themeMode={themeMode}
                      handleOnClick={() => setIsActive(element)}
                      isActive={isActive}
                    />
                  ))}
                </>
              )
            }

          </div>
          {!account ? (
            <div
              onClick={() => connectWallet()}
              className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Connect Wallet
            </div>
          ) : !isProceeding ? (
            <div
              onClick={() => handleLoanProceed()}
              className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Proceed
            </div>
          ) : (
            <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}
