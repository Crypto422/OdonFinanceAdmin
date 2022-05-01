import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { IoIosCloseCircleOutline } from "react-icons/io";
import metamask from "../images/icon/metamask.png";
import wallectconnection from "../images/icon/walletConnectIcon.svg";
import coinbase from "../images/icon/coinbase.png";
const ConnectWallet = ({
    isShow,
    setIsShowConnectModal
}) => {
    const close = () => {
        setIsShowConnectModal(false);
    };

    return (
        <div>
            <div
                className={
                    "fixed shadow-gray-500 left-[50%] top-[50%] min-w-[380px] w-[20%] -translate-x-[50%] -translate-y-[50%] bg-[#191b1f] mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 " +
                    (isShow ? " scale-100" : "")
                }
            >
                <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
                    <IoIosCloseCircleOutline
                        className="text-4xl cursor-pointer hover:text-gray-400 transition"
                        onClick={() => close()}
                    />
                </div>
                <div
                  
                    className="mb-4 mt-8 flex items-center shadow shadow-gray-500 justify-between  w-[100%] mx-auto rounded-full shadow flex-1 h-full px-1 py-[5px] cursor-pointer hover:text-gray-300 hover:shadow-blue-500 transition focus:text-gray-900 select-none">
                    &nbsp;&nbsp;MetaMask
                    <img className="w-[10%] h-[10%]  mr-2" src={metamask} alt="" />
                </div>
                <div
                  
                    className="mb-4 mt-4 flex items-center shadow shadow-gray-500 justify-between  w-[100%] mx-auto rounded-full shadow flex-1 h-full px-1 py-[5px] cursor-pointer hover:text-gray-300 hover:shadow-blue-500 transition focus:text-gray-900 select-none">
                    &nbsp;&nbsp; WalletConnect
                    <img className="w-[10%] h-[10%]  mr-2" src={wallectconnection} alt="" />
                </div>
                <div
                    
                    className="mb-4 mt-4 flex items-center shadow shadow-gray-500 justify-between  w-[100%] mx-auto rounded-full shadow flex-1 h-full px-1 py-[5px] cursor-pointer hover:text-gray-300 hover:shadow-blue-500 transition focus:text-gray-900 select-none">
                    &nbsp;&nbsp;Coinbase Wallet
                    <img className="w-[10%] h-[10%] mr-2" src={coinbase} alt="" />
                </div>
            </div>
        </div>
    );
};


const DisConnectWallet = ({
    isShow,
    setIsShowDisConnectModal
}) => {
    const close = () => {
        setIsShowDisConnectModal(false);
    };
    const { disconnectWallet } =
        useContext(LendAndLoanContext);
    return (
        <div>
            <div
                className={
                    "fixed  shadow-gray-500 left-[50%] top-[50%] min-w-[380px] w-[20%] -translate-x-[50%] -translate-y-[50%] bg-[#191b1f] mx-auto rounded-xl p-5 shadow-xl transition duration-200 scale-0 z-20 " +
                    (isShow ? " scale-100" : "")
                }
            >
                <div className="flex items-center justify-center absolute -right-0 -top-0 rounded-full ">
                    <IoIosCloseCircleOutline
                        className="text-4xl cursor-pointer hover:text-gray-400 transition"
                        onClick={() => close()}
                    />
                </div>
                <div
                    onClick={disconnectWallet}
                    className="mb-4 mt-8 flex items-center shadow shadow-gray-500 justify-center  w-[100%] mx-auto rounded-full shadow flex-1 text-center h-full px-1 py-[5px] cursor-pointer hover:text-gray-300 hover:shadow-blue-500 transition focus:text-gray-900 select-none">
                    DisConnectWallet
                </div>
            </div>
        </div>
    );
};

export { ConnectWallet, DisConnectWallet }

