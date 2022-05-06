import { ethers } from "ethers";
import React, { useContext, useRef, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillWarning } from "react-icons/ai";


function SetAPY() {
  const {
    account,
    connectWallet,
    themeMode,
    getLoanContract,
    library,
    setContractTotalLiquidity
  } = useContext(LendAndLoanContext);

  const [isProceeding, setIsProceeding] = useState(false);
  const USDCInputRef = useRef();
  const USDTInputRef = useRef();
  const BTCInputRef = useRef();
  const [isValidLendAPY, setIsValidLendAPY] = useState(true);

  const handleKeyDown = (e) => {
    if (e.keyCode == 189 || e.keyCode == 109 || e.keyCode == 107) {
      e
      e.preventDefault();
    }
  };

  const handleSetAPY = async () => {
    setIsProceeding(true);
    if (USDCInputRef.current.value > 0 && USDTInputRef.current.value > 0 && BTCInputRef.current.value > 0) {
      setIsValidLendAPY(true);
      const contract = await getLoanContract(library.getSigner());
      const res = await contract
        .setBorrowAPY(
          ethers.utils.parseUnits(USDCInputRef.current.value, 18),
          ethers.utils.parseUnits(USDTInputRef.current.value, 18),
          ethers.utils.parseUnits(BTCInputRef.current.value, 18),
        )
        .catch((err) => {
          setIsProceeding(false);
        });
      const data = await res.wait();
      if (data) {
        setIsProceeding(false);
        setContractTotalLiquidity();
        USDCInputRef.current.value = "";
        BTCInputRef.current.value = "";
        USDTInputRef.current.value = "";
      } else {
        setIsProceeding(false);
      }
    } else {
      setIsValidLendAPY(false);
      setIsProceeding(false);
    }
  };

  return (
    <div className={"mt-10 md:mt-24 "}>
      <ToastContainer theme={themeMode ? "light" : "dark"} />
      <div className={"mx-5 md:max-w-[635px] md:mx-auto"}>
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Set Borrow APY</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          {" "}
          <div className="mt-3">

            <p className="my-1 mb-2">
              Please set the APYs stand on shortest days!
            </p>

            <div className={"flex items-center w-full rounded h-16 outline-none px-5  border-[1px]  hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81] border-transparent")}>
              <input
                ref={USDCInputRef}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <div className="relative ml-5 group">
                <div
                  className={"cursor-pointer relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
                >
                  <p className="px-2">USDC</p>
                </div>
              </div>
            </div>

            <div className={"flex items-center w-full mt-1 rounded h-16 outline-none px-5  border-[1px]  hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]  border-transparent")}>
              <input
                ref={USDTInputRef}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <div className="relative ml-5 group">
                <div
                  className={"cursor-pointer relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
                >
                  <p className="px-2">USDT</p>
                </div>
              </div>
            </div>
            <div className={"flex items-center w-full mt-1 rounded h-16 outline-none px-5  border-[1px]  hover:border-gray-600 transition  font-inter" + (themeMode ? " bg-gray-100" : " bg-[#33373f81]  border-transparent")}>
              <input
                ref={BTCInputRef}
                onKeyDown={(e) => handleKeyDown(e)}
                type="number"
                className="w-full rounded h-16 outline-none bg-transparent w-[80%] font-medium text-3xl"
                placeholder="0.0"
                autoComplete="off"
              />
              <div className="relative ml-5 group">
                <div
                  className={"cursor-pointer relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
                >
                  <p className="px-2">WBTC</p>
                </div>
              </div>
            </div>

            {!isValidLendAPY && (
              <div className="p-0 flex justify-center items-center text-red-500">
                <AiFillWarning className="mr-2" />
                <div>
                  {"Invalid APY value detected!!!"}
                </div>
              </div>
            )}

          </div>
          {!account ? (
            <div
              onClick={() => connectWallet()}
              className={"mt-3 px-2 mt-4 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Connect Wallet
            </div>
          ) : !isProceeding ? (
            <div
              onClick={() => handleSetAPY()}
              className={"mt-3 px-2 mt-4  py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Submit
            </div>
          ) : (
            <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export { SetAPY }
