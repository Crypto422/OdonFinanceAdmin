import React, { useContext, useEffect, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import lending from "../images/lending.png";
import signing from "../images/signing.png";
import timeConverter from "../utils/timeConvert";
import { AiFillWarning } from "react-icons/ai";


export default function Analyse() {
  const {themeMode, account, connectWallet } =
    useContext(LendAndLoanContext);
 

  return (
   <></>
  );
}
