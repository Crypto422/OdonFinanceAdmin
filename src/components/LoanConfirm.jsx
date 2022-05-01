import React, { useState, useContext } from "react";
import Confirm from "./Confirm";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LendAndLoanContext } from "../context/LendAndLoanContext";

export default function LoanConfirm({
  information,
  cancel,
  isShow,
  setIsProceeding,
  ethRef,
  odonRef,
}) {
  const [step, setStep] = useState(1);
  const [isApproved, setIsApproved] = useState(false);
  const [hash, setHash] = useState();
  const { themeMode } = useContext(LendAndLoanContext);
  const handleClose = async () => {
    cancel();
    setStep(1);
    setIsApproved(false);
    setIsProceeding(false)
    setHash("");
    ethRef.current.value = "";
    odonRef.current.value = "";
  };
  return (
    <div
      className={
        "absolute w-[90%] left-[50%] top-[50%] md:w-[500px] -translate-x-[50%] -translate-y-[50%]  mx-auto rounded-xl pb-8 pt-5 p-2 md:p-5 shadow-xl transition duration-200 scale-0 z-20 " +
        (isShow ? (`scale-100 ${themeMode ? ' bg-white text-black' : ' bg-[#191b1f]'}`) : "")
      }
    >
      <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
        <IoIosCloseCircleOutline
          className="text-2xl md:text-4xl cursor-pointer hover:text-gray-400 transition"
          onClick={() => handleClose()}
        />
      </div>
      <div>

        <Confirm
          information={information}
          setStep={setStep}
          stepNow={step}
          setIsProceeding={setIsProceeding}
          setHash={setHash}
          hash={hash}
        />
      </div>
    </div>
  );
}
