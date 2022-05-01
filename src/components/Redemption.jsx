import React, { useContext, useEffect, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import lending from "../images/lending.png";
import signing from "../images/signing.png";
import timeConverter from "../utils/timeConvert";
import { AiFillWarning } from "react-icons/ai";

const WithdrawDetails = ({
  isShow,
  withdrawDetails,
  setIsShowDetails,
  setWithdrawDetails,
}) => {
  const close = () => {
    setIsShowDetails(false);
    setWithdrawDetails("");
  };
  const { themeMode } = useContext(LendAndLoanContext);
  return (
    <div>
      {" "}
      <div
        className={
          "fixed left-[50%] top-[50%] min-w-[380px] w-[20%] -translate-x-[50%] -translate-y-[50%]  mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 " +
          (isShow ? (` scale-100 ${themeMode ? " bg-white text-black":" bg-[#191b1f]"}`) : "")
        }
      >
        <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
          <IoIosCloseCircleOutline
            className="text-4xl cursor-pointer hover:text-gray-400 transition"
            onClick={() => close()}
          />
        </div>
        {withdrawDetails != "" ? (
          <div>
            <div>
              <div>Transaction Hash: </div>
              <a
                title="Link to transaction"
                target="_blank"
                rel="nonreferrer nonopennner"
                href={"https://rinkeby.etherscan.io/tx/" + withdrawDetails.hash}
                className="my-2 break-words cursor-pointer "
              >
                {withdrawDetails.hash}
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-[50px] h-[50px] my-5 border-t-2 border-teal-600 animate-spin rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const LendList = ({
  data,
  updateLends,
  setWithdrawDetails,
  setIsShowDetails,
}) => {
  const {
    getLoanContract,
    library,
    account,
    getUserOngoingLend,
    contractUsdcLiquidity,
    contractUsdtLiquidity,
    contractWbtcLiquidity,
    setContractTotalLiquidity,
    themeMode,
  } = useContext(LendAndLoanContext);
  const [lendDate, setLendDate] = useState();
  const [lendDateGetInterest, setLendDateGetInterest] = useState();
  const [canWithDraw, setCanWithDraw] = useState();

  const handleWithdraw = async () => {
    const contract = getLoanContract(library.getSigner());
    if (account) {
      setIsShowDetails(true);
      const res = await contract
        .withdraw(data.lendId.toNumber())
        .catch((err) => setIsShowDetails(false));
      // console.log(res);
      const details = await res.wait();
      // console.log(details);
      const lendsData = await getUserOngoingLend();
      updateLends(lendsData);
      setWithdrawDetails({
        hash: details.transactionHash,
      });
    }
    setContractTotalLiquidity();
  };
  useEffect(() => {
    const timeLendDate = timeConverter(data.timeLend.toNumber());
    const timeCanGetInterestDate = timeConverter(
      data.timeCanGetInterest.toNumber()
    );
    setLendDate(timeLendDate.toString());
    setLendDateGetInterest(timeCanGetInterestDate.toString());
  });

  useEffect(() => {
    const token = Number(ethers.utils.formatEther(data.lendAmount.toString())).toFixed(3)
    if (data.mtype.toNumber() === 2) {
      if (contractUsdcLiquidity >= token) {
        setCanWithDraw(true)
      } else {
        setCanWithDraw(false)
      }
    }
    else if (data.mtype.toNumber() === 3) {
      if (contractUsdtLiquidity >= token) {
        setCanWithDraw(true)
      } else {
        setCanWithDraw(false)
      }
    }
    else if (data.mtype.toNumber() === 4) {
      if (contractWbtcLiquidity >= token) {
        setCanWithDraw(true)
      } else {
        setCanWithDraw(false)
      }
    }
  }, [data])
  return (
    <div className={"mt-4 transition px-4 py-3 rounded cursor-pointer " + (themeMode ? " bg-gray-100 text-black hover:bg-gray-300":" bg-[#33373f81] text-gray-300 hover:bg-gray-800")}>
      <div className="break-words">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Lender</p>
        <p>{data.lender}</p>
      </div>
      <div className="break-words">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Lend date</p>{" "}
        <p>{lendDate}</p>
      </div>
      <div className="break-words">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>
          Date can get interest
        </p>{" "}
        <p> {lendDateGetInterest}</p>
      </div>
      <div>
        <div className="">
          <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>
            After interest date payback amount
          </p>{" "}
          <p className="break-words">
            {data.paybackAmount.toString() / 10 ** 18}&nbsp;
            {data.mtype.toNumber() === 2 && "USDC"}
            {data.mtype.toNumber() === 3 && "USDT"}
            {data.mtype.toNumber() === 4 && "BTC"}
          </p>
        </div>
        <div className="">
          <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Lend&nbsp;
            {data.mtype.toNumber() === 2 && "USDC"}
            {data.mtype.toNumber() === 3 && "USDT"}
            {data.mtype.toNumber() === 4 && "BTC"}&nbsp;
            amount</p>{" "}
          <p className="break-words">
            {data.lendAmount.toString() / 10 ** 18}&nbsp;
            {data.mtype.toNumber() === 2 && "USDC"}
            {data.mtype.toNumber() === 3 && "USDT"}
            {data.mtype.toNumber() === 4 && "BTC"}
          </p>
        </div>
      </div>
      {
        canWithDraw ?
          <div
            onClick={() => handleWithdraw()}
            className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] hover:bg-[#007af7] text-white":" bg-[#153d6f70]  hover:bg-[#1f5ba370] text-blue-400")}
          >
            Withdraw
          </div> :
          <div
            className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] hover:bg-[#007af7] text-white":" bg-[#153d6f70]  hover:bg-[#1f5ba370] text-blue-400")}
          >
            Not enough balance
          </div>
      }
    </div>
  );
};

const LoanList = ({
  data,
  updateLoans,
  setWithdrawDetails,
  setIsShowDetails,
}) => {
  const {
    getLoanContract,
    library,
    themeMode,
    account,
    getLoansLTV,
    getUserOngoingLoan,
    getUsdcTokenContract,
    getUsdtTokenContract,
    getWbtcTokenContract,
    setContractTotalLiquidity,
    getAccUSDCBalance,
    getAccUSDTBalance,
    getAccWBTCBalance,
  } = useContext(LendAndLoanContext);
  const [loanDueDate, setLoanDueDate] = useState();
  const [loanDuration, setLoanDuration] = useState();
  const [canPayback, setCanPayback] = useState();
  const [currentLTV, setCurrentLTV] = useState();

  const handlePayback = async () => {
    setIsShowDetails(true);
    const loanContract = getLoanContract(library.getSigner());
    const loanContractAddress = loanContract.address;
    let tokenContract;
    if (data.mtype.toNumber() == 2) {
      tokenContract = getUsdcTokenContract(library.getSigner());
    } else if (data.mtype.toNumber() == 3) {
      tokenContract = getUsdtTokenContract(library.getSigner());
    } else if (data.mtype.toNumber() == 4) {
      tokenContract = getWbtcTokenContract(library.getSigner());
    }

    let value = ethers.utils.formatEther(data.paybackAmount.toString())
    const tokenres = await tokenContract
      .approve(
        loanContractAddress,
        ethers.utils.parseUnits(value, 18)
      )
      .catch((err) => setIsShowDetails(false));
    const detail = await tokenres.wait();

    if (account && detail) {
      setIsShowDetails(true);
      const res = await loanContract
        .payback(data.loanId.toNumber(), data.paybackAmount)
        .catch((err) => setIsShowDetails(false));
      const details = await res.wait();
      const loansData = await getUserOngoingLoan();
      updateLoans(loansData);
      setWithdrawDetails({
        hash: details.transactionHash,
      });
      setContractTotalLiquidity();
    }
  };
  useEffect(() => {
    const timeLoanDueDate = timeConverter(data.loanDueDate.toNumber());
    setLoanDueDate(timeLoanDueDate.toString());
    if (data.duration.toString() == "604800") {
      setLoanDuration(7);
    } else if (data.duration.toString() == "1209600") {
      setLoanDuration(14);
    } else {
      setLoanDuration(30);
    }
  });

  useEffect( async() => {
    let ltv = await getLoansLTV(data.loanId.toNumber())
    setCurrentLTV(ltv);
  }, [])

  useEffect(() => {
    if (data.mtype.toNumber() === 2) {
      if (getAccUSDCBalance() >= data.paybackAmount) {
        setCanPayback(true)
      } else {
        setCanPayback(false)
      }
    } else if (data.mtype.toNumber() === 3) {
      if (getAccUSDTBalance() >= data.paybackAmount) {
        setCanPayback(true)
      } else {
        setCanPayback(false)
      }
    } else if (data.mtype.toNumber() === 4) {
      if (getAccWBTCBalance() >= data.paybackAmount) {
        setCanPayback(true)
      } else {
        setCanPayback(false)
      }
    }
  }, data)
  return (
    <div className={"mt-4 transition px-4 py-3 rounded cursor-pointer" + (themeMode ? "  bg-gray-100 text-black hover:bg-gray-300":" bg-[#33373f81] hover:bg-gray-800 text-gray-300")}>
      <div className="">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Loan due date</p>{" "}
        <p className="break-words">{loanDueDate}</p>
      </div>
      <div className="">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Duration</p>{" "}
        <p className="break-words">{loanDuration} days</p>
      </div>
      <div className="">
        <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Current LTV</p>{" "}
        <p className="break-words">{currentLTV ? currentLTV : "Fetching..."} %</p>
      </div>
      {
        currentLTV && currentLTV > 80 &&
        <div className="p-0 flex justify-left items-center text-yellow-300">
          <AiFillWarning className="mr-2 text-2xl md:text-base" />
          <div className="text-sm md:text-base">
            you should payback loan to avoid liquidate!
          </div>
        </div>
      }
      <div>
        <div>
          <div className="">
            <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Loan &nbsp;{data.mtype.toNumber() === 2 && "USDC"}
              {data.mtype.toNumber() === 3 && "USDT"}
              {data.mtype.toNumber() === 4 && "BTC"} &nbsp;amount</p>{" "}
            <p className="break-words">
              {ethers.utils.formatEther(data.loanAmount.toString())}&nbsp;{data.mtype.toNumber() === 2 && "USDC"}
              {data.mtype.toNumber() === 3 && "USDT"}
              {data.mtype.toNumber() === 4 && "BTC"}
            </p>
          </div>
          <div className="">
            <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Payback amount</p>{" "}
            <p className="break-words">
              {ethers.utils.formatEther(data.paybackAmount.toString())} &nbsp; {data.mtype.toNumber() === 2 && "USDC"}
              {data.mtype.toNumber() === 3 && "USDT"}
              {data.mtype.toNumber() === 4 && "BTC"}
            </p>
          </div>
          <div className="">
            <p className={"font-bold underline" + (themeMode ? " text-black":" text-white")}>Collateral amount</p>{" "}
            <p className="break-words">
              {data.collateralAmount.toString() / 10 ** 18}&nbsp;
              {data.ctype.toNumber() === 1 && "ETH"}
              {data.ctype.toNumber() === 5 && "ODON"}
            </p>
          </div>
        </div>
      </div>
      {
        canPayback ?
          <div
            onClick={() => handlePayback()}
            className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] hover:bg-[#007af7] text-white":" bg-[#153d6f70]  hover:bg-[#1f5ba370] text-blue-400")}
          >
            Payback
          </div> :
          <div
            onClick={() => handlePayback()}
            className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] hover:bg-[#007af7] text-white":" bg-[#153d6f70]  hover:bg-[#1f5ba370] text-blue-400")}
          >
            Not enough balance
          </div>
      }
    </div>
  );
};

export default function Redemption() {
  const { getUserOngoingLend, getUserOngoingLoan, themeMode, account, connectWallet } =
    useContext(LendAndLoanContext);

  const [lends, setLends] = useState();
  const [loans, setLoans] = useState();
  const [loading, setLoading] = useState(true);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [withdrawDetails, setWithdrawDetails] = useState("");
  useEffect(async () => {
    setLoading(true);
    const lendsData = await getUserOngoingLend();
    const loansData = await getUserOngoingLoan();
    setLends(lendsData);

    const filterdLoans = loansData.filter((ele) =>  ele.borrower.toString() !=
    "0x0000000000000000000000000000000000000000")
    setLoans(filterdLoans);
    setLoading(false);
  }, [account]);

  return (
    <div className="mx-5 md:mx-auto mt-10 md:mt-24 mb-24 w-auto md:max-w-[550px]">
      <div className={"font-bold text-2xl mb-3" + (themeMode ? " text-black" : " text-white")}>Redemption</div>
      <WithdrawDetails
        isShow={isShowDetails}
        withdrawDetails={withdrawDetails}
        setIsShowDetails={setIsShowDetails}
        setWithdrawDetails={setWithdrawDetails}
      />
      <div className={"p-4 shadow-xl  h-auto rounded-xl" + (themeMode ? " bg-white text-black" : " bg-[#191b1fc2] text-white")}>
        {loading ? (
          <div>
            <div className={"w-[70%] mb-4 h-6 rounded-full animate-pulse" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            <div className={"w-[60%] mb-4 h-6 rounded-full animate-pulse" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            <div className={"w-full h-6 rounded-full animate-pulse" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            <div className="flex w-full my-4 animate-pulse">
              <div className={"w-[60%] mr-4 h-6 rounded-full" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
              <div className={"w-[40%] h-6 rounded-full" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            </div>
            <div className={"w-40% h-6 rounded-full animate-pulse" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            <div className={"my-4 w-[70%] mb-4 h-6 rounded-full animate-pulse" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            <div className="flex w-full mt-4 animate-pulse">
              <div className={"w-[40%] mr-4 h-6 rounded-full" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
              <div className={"w-[60%] h-6 rounded-full" + (themeMode ? " bg-gray-400" : " bg-gray-700")}></div>
            </div>
          </div>
        ) : account ? (
          <div>
            <div className="font-bold text-2xl">Loan ongoing requests</div>
            <div className="my-2 h-[2px] bg-line-loan rounded-full"></div>
            {loans && loans.length == 0 ? (
              <div className="my-5">
                <div className="flex justify-center flex-col items-center">
                  {" "}
                  <img className="w-[30%] select-none" src={signing} alt="" />
                  <p className="text-2xl select-none mt-3 font-courgette">
                    No ongoing loans...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {" "}
                {account &&
                  loans &&
                  loans.map((ele, index) => {
                    if (
                      ele.borrower.toString() !=
                      "0x0000000000000000000000000000000000000000"
                    ) {
                      return (
                        <LoanList
                          key={ele.loanId.toNumber() + ele}
                          data={ele}
                          updateLoans={setLoans}
                          setIsShowDetails={setIsShowDetails}
                          setWithdrawDetails={setWithdrawDetails}
                        />
                      );
                    }
                  })}
              </div>
            )}
            <div className="my-5"></div>
            <div className="font-bold text-2xl">Lend ongoing requests</div>
            <div className="my-2 h-[2px] bg-line-lend rounded-full"></div>
            {lends && lends.length == 0 ? (
              <div className="my-5">
                <div className="flex justify-center flex-col items-center">
                  {" "}
                  <img className="w-[30%] select-none" src={lending} alt="" />
                  <p className="text-2xl select-none mt-3 font-courgette">
                    No ongoing lends...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {account &&
                  lends &&
                  lends.map((ele, index) => {
                    return (
                      <LendList
                        key={ele.lendId.toNumber()}
                        data={ele}
                        updateLends={setLends}
                        setIsShowDetails={setIsShowDetails}
                        setWithdrawDetails={setWithdrawDetails}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>Please connect wallet to proceed...</div>
            <div
              onClick={() => connectWallet()}
              className={"mt-3 px-2 py-2 md:py-3 rounded-2xl text-center cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]" : " bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Connect Wallet
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
