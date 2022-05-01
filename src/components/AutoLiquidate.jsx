import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AutoLiquidate() {
  const {
    account,
    connectWallet,
    themeMode,
    getLoanContract,
    library
  } = useContext(LendAndLoanContext);

  const [isProceeding, setIsProceeding] = useState(false);

  const handleLoanProceed = async () => {
    setIsProceeding(true);
    const contract = await getLoanContract(library.getSigner());
    const res = await contract
      .AutoLiquidate()
      .catch((err) => setIsProceeding(false));
    const data = await res.wait();
    if (data) {
      setIsProceeding(false);
    } else {
      setIsProceeding(false);
    }
  };


  return (
    <div className={"mt-10 md:mt-24 "}>
      <ToastContainer theme={themeMode ? "light" : "dark"} />
      <div className={"mx-5 md:max-w-[635px] md:mx-auto"}>
        <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Liquidate</div>
        <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
          {" "}
          <div className="mt-3">
            {
              isProceeding ? <p className="my-1 mb-2">
                Liquidating now...
              </p> :
                <p className="my-1 mb-2">
                  Do you want liquidate expired and risk loans?
                </p>
            }


          </div>
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
              className={"mt-3 px-2   py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Liquidate
            </div>
          ) : (
            <div className="my-10 w-20 h-20 animate-spin rounded-full border-blue-700 border-b-2 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export { AutoLiquidate }
