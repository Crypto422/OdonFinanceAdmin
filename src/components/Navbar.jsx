import React, { useState, useEffect, useContext, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FiTrendingUp } from "react-icons/fi";
import { FaFaucet } from "react-icons/fa";
import { Link } from "react-router-dom";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { shortenAddress } from "../utils/shortenAddress";
import { BsSun } from "react-icons/bs";
import { BsFillMoonStarsFill } from "react-icons/bs";

let commonCss =
  "font-bold px-2 md:px-4 py-1 cursor-pointer rounded-2xl hover:text-gray-500 transition duration-200 flex ";

const NavItem = ({ active, content,handleOnClick }) => {
  const { getLoanContract,themeMode, library} = useContext(LendAndLoanContext);
  return content == "Contract" && library !== undefined ? (
    <a
      className={commonCss + (themeMode ? "text-gray-600":"text-gray-300")}
      href={`https://moonriver.moonscan.io/address/${getLoanContract(library.getSigner()).address}`}
      target="_blank"
      rel="noopenner noreferrer"
    >
      {content} <FiTrendingUp className="ml-1 text-bold" />
    </a>
  ) : (
    <Link to={"/" + (content == "Loan" ? "" : content)}>
      <div
        onClick={handleOnClick}
        className={
          commonCss +
          (active == content
            ? (`${!themeMode ? 'bg-[#212429] text-white hover:text-gray-600':'bg-[#0095e8] hover:text-gray-200 text-white'} `)
            : (`${!themeMode ? 'text-gray-300':'text-gray-600'}`))
        }
      >
        {content}
      </div>
    </Link>
  );
};

export default function Navbar() {
  const { connectWallet, account,themeMode, odonAccBalance ,setThemeMode, library,getEthTokenContract, getOdonTokenContract } =
    useContext(LendAndLoanContext);
  const [isActive, setIsActive] = useState("Loan");
  const [isDropDown, setIsDropDown] = useState(false);
  const [isShowingToken, setIsShowingToken] = useState(true);
  const [userBalance, setUserBalance] = useState();
  const dropdownRef = useRef();
  const navMenu = ["Manage", "Setting", "Analytics", "Contract"];

  useEffect(async () => {
    const url = window.location.href;
    let param = url.substring(url.lastIndexOf("/") + 1);
    param == "" ? setIsActive("Manage") : setIsActive(param);
    if (account) {
      let odonTokenBalance = getOdonTokenContract(library);
      const tokenAmount = await odonTokenBalance.balanceOf(account);
      setUserBalance(tokenAmount.toString() / 10 ** 18);
    }
  }, [account]);

  const changeBalance = async () => {
    let statusNow = !isShowingToken;
    setIsShowingToken(!isShowingToken);
    if (statusNow) {
      let odonTokenBalance = getOdonTokenContract(library);
      const tokenAmount = await odonTokenBalance.balanceOf(account);
      setUserBalance(tokenAmount.toString() / 10 ** 18);
    } else {
      let ethTokenBalance = getEthTokenContract(library);
      const tokenAmount = await ethTokenBalance.balanceOf(account);
      setUserBalance(tokenAmount.toString() / 10 ** 18);
    }
  };

  const handleThemeChange = () => {
    let value = !themeMode;
    localStorage.setItem('themeMode', value);
    setThemeMode(value);
  }

  return (
    <div className={!themeMode ? `grid grid-cols-2 md:grid-cols-3 p-5`: `grid grid-cols-2 md:grid-cols-3 p-5 text-[#191b1f]`}>
      <div className={`w-[fit-content] font-festive text-3xl cursor-pointer hover:scale-125 transition duration-200`}>
        Odon Finance
      </div>
      <div className={"fixed bottom-5 z-50 left-[50%] translate-x-[-50%] md:static md:translate-x-[%] p-[3px]  flex rounded-full md:w-[fit-content] place-self-center" + (!themeMode ? " bg-[#191b1f]" : " bg-gray-200")}>
        {navMenu.map((item, index) => (
          <NavItem
            key={item + index}
            active={isActive}
            content={item}
            handleOnClick={() => setIsActive(item)}
          />
        ))}
      </div>
      <div className="flex justify-self-end  md:justify-self-end  items-center justify-center">
        {/* <a
          href="https://moonriver.moonscan.io/"
          className="min-w-[170px] hidden 2xl:flex items-center mr-2 px-4 py-2 rounded-2xl bg-[#191b1f] cursor-pointer"
          target="_blank"
          rel="noopenner noreferrer"
        >
          <div className="w-[9px] h-[9px] bg-yellow-500 mr-2 rounded-full"></div>
          Rinkeby testnet
        </a> */}
        {!account ? (
          <div
              onClick={() => connectWallet()}
              className={"text-center w-[130px] text-sm md:text-base md:w-auto px-2 md:px-4 py-2 rounded-2xl cursor-pointer transition text-xl" + (themeMode ? " bg-[#009ef7] text-white hover:bg-[#007af7]":" bg-[#153d6f70] text-[#5090ea] hover:bg-[#1f5ba370]")}
            >
              Connect Wallet
            </div>
        ) : (
          <div className={"flex items-center rounded-2xl p-[1px]" + (!themeMode ? " bg-[#191b1f]": " bg-gray-200")}>
            <div
              title={odonAccBalance + " " + (isShowingToken ? "ODON" : "MOVR")}
              // onClick={() => changeBalance()}
              className="hidden lg:flex rounded-tl-2xl rounded-bl-2xl py-2  cursor-pointer hover:border-gray-600 border-r-[0px] border-l-[1px] border-y-[1px] border-transparent transition duration-200"
            >
              <p className="px-3 select-none max-w-[120px] truncate">
                {odonAccBalance}
              </p>
              <p className="mr-2">{isShowingToken ? "ODON" : "rETH"}</p>
            </div>
            <a
              target="_blank"
              rel="noopenner noreferrer"
              // onClick={disconnect}
              href={`https://moonriver.moonscan.io/address/${account}`}
              className={"px-4 py-2 rounded-2xl  cursor-pointer hover:border-gray-600 border-[1px] border-transparent transition duration-200" + (!themeMode ? " bg-[#222529]" : " bg-[#009ef7] text-white hover:bg-[#007af7]")}
            >
              {shortenAddress(account)}
            </a>
          </div>
        )}
        <div
          className="relative"
          ref={dropdownRef}
          onClick={() => {
            isDropDown ? setIsDropDown(false) : setIsDropDown(true);
          }}
        >
          <div className={"flex items-center h-10 px-3 rounded-xl cursor-pointer ml-2 border-[1px] border-transparent transition duration-200 hover:border-gray-600" + (!themeMode ? " bg-[#191b1f]":" bg-gray-200")}>
            <BsThreeDots className="text-2xl" />
          </div>
          {isDropDown ? (
            <div className={"absolute right-0 top-[100%] mt-2 w-48 px-5 py-3 shadow rounded-md shadow-lg font-semibold select-none" + (!themeMode ? " bg-[#212429] text-gray-300":" bg-white text-gray-900")}>
              {/* <a
                href="https://google.com/"
                target="_blank"
                rel="noopenner noreferrer"
                className="flex justify-between items-center py-1 "
              >
                <div className="">ODON Faucet</div>
                <FaFaucet className="text-xl" />
              </a> */}
              <a  onClick={handleThemeChange}
                rel="noopenner noreferrer"
                className="flex justify-between items-center py-1 hover:cursor-pointer"
              >
                <div className="">
                  {
                    !themeMode ? "Light" : "Dark"
                  } mode
                </div>
                {
                  !themeMode ?
                      <BsSun className="text-2xl hover:cursor-pointer" />
                      :
                      <BsFillMoonStarsFill className="text-2xl dark:text-black hover:cursor-pointer"  />
                }
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
