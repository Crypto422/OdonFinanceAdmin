import { ethers } from "ethers";
import React, { useContext, useRef, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowSmDown } from "react-icons/hi";


function SetBorrowDuration() {
  const {
    account,
    connectWallet,
    themeMode,
    getLoanContract,
    library
  } = useContext(LendAndLoanContext);

  const [isProceeding, setIsProceeding] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);
  const [mType, setLendType] = useState(2);
  const dropDownRef = useRef();

  const handleSetDuration = async () => {
    setIsProceeding(true);
      const contract = await getLoanContract(library.getSigner());
      const res = await contract
        .setLoanDurationMode(
          mType
        )
        .catch((err) => {
          setIsProceeding(false);
        });
      const data = await res.wait();
      if (data) {
        setIsProceeding(false);
      } else {
        setIsProceeding(false);
      }
    
  };

  const handleDropButtonClick = (id) => {
    if (id === 1) {
      setLendType(1);
    } else if (id === 2) {
      setLendType(2);
    }
  }

  return (
    <div className={"mt-10 md:mt-24 mb-10"}>
      <ToastContainer theme={themeMode ? "light" : "dark"} />
      <div className={"mx-5 md:max-w-[635px] md:mx-auto"}>
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Set Borrow Duration</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          {" "}
          <div className="mt-3">

            <p className="my-1 mb-2">
              Please set the borrow durations mode
            </p>

            <div className="relative group">
              <div
                ref={dropDownRef}
                onClick={() => {
                  isDropDown ? setIsDropDown(false) : setIsDropDown(true);
                }}
                className={"cursor-pointer justify-between relative flex items-center px-2 py-2 md:px-3 rounded-2xl cursor-pointer transition text-xl md:text-2xl select-none text-center" + (themeMode ? " bg-gray-300  hover:bg-gray-400" : " bg-[#1a1c20c2]")}
              >
                {mType === 1 && (
                  <p className="px-2">7, 14, 30 days</p>
                )}
                {mType === 2 && (
                  <p className="px-2">30, 60, 90 days</p>
                )}
                {
                  !isDropDown ? 
                  <HiArrowSmDown className="text-2xl md:text-3xl" /> : <></>
                }
                {isDropDown ? (
                  <div className={"relative flexshadow shadow-gray-400 rounded hover:shadow-gray-600 overflow-hidden" + (themeMode ? " bg-white" : " bg-[#1a1c20c2]")}>
                    <div
                      onClick={() => handleDropButtonClick(1)}
                      className="relative flex  border-b-2 border-teal-600 items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      7, 14, 30 days{" "}
                    </div>
                    <div
                      onClick={() => handleDropButtonClick(2)}
                      className="relative flex   border-b-2 border-teal-600 items-center cursor-pointer text-xl hover:bg-gray-500 px-6 py-1 transition"
                    >
                      30, 60, 90 days{" "}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

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
              onClick={() => handleSetDuration()}
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

export { SetBorrowDuration }
