import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";

export default function Confirm({
  information,
  hash,
  setHash,
  setIsProceeding
}) {
  const { getLoanContract, library, account, themeMode, setContractTotalLiquidity } =
    useContext(LendAndLoanContext);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    if (account) {
      setIsConfirming(true);
      const contract = await getLoanContract(library.getSigner());
      let decimal;
      if (information.mtype === 2 ) {
        decimal = 6
      } else if(information.mtype === 3) {
        decimal = 6
      } else if (information.mtype === 4) {
        decimal = 8
      }
      const res = await contract
        .withDrawReserve(
          ethers.utils.parseUnits(information.loanAmount, decimal),
          information.mtype
        )
        .catch((err) => {
          setIsConfirming(false);
        });
      const data = await res.wait();
      setHash(data.transactionHash);
      setIsConfirming(false);
      setIsProceeding(false);
      setContractTotalLiquidity();
    }
  };
  return (
    <div className="p-3 mt-5">
      <div className="my-2">Confirm withdraw for {information.loanAmount} &nbsp;
      {information.mtype === 2 && "USDC"}
      {information.mtype === 3 && "USDT"}
      {information.mtype === 4 && "WBTC"}
      {information.mtype === 5 && "ODON"}
      </div>
      {!isConfirming ? (
        !hash ? (
          <div
            onClick={() => handleConfirm()}
            className={"rounded mx-auto mt-7 py-1 md:px-3 md:py-2 bg-3clr-gradient opacity-80 select-none w-40 text-center cursor-pointer text-2xl shadow font-bold hover:opacity-100 transition" + (themeMode ? " text-white":"")}
          >
            Confirm
          </div>
        ) : (
          <a
            target="_blank"
            rel="noopenner noreferrer"
            href={"https://moonriver.moonscan.io/tx/" + hash}
            className="block break-words md:mb-10"
          >
            Transaction hash: {hash}
          </a>
        )
      ) : (
        <div className="w-[50px] h-[50px] border-t-2 border-teal-600 animate-spin rounded-full my-10 mx-auto"></div>
      )}
    </div>
  );
}
