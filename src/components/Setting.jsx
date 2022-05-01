import React, { useEffect, useRef, useState, useContext } from "react";
import { SetAPY } from "./SetAPY";
import { SetLendAPY } from "./SetLendAPY";
import { SetBorrowDuration } from "./SetBorrowBuration";
import { SetOdonPrice } from "./SetOdonPrice";

export default function Setting() {
  return (
    <div>
      <SetAPY/>
      <SetLendAPY/>
      <SetBorrowDuration/>
      <SetOdonPrice/>
    </div>
  )
}
