import React, { useContext, useEffect, useState } from "react";
import { BsCoin } from "react-icons/bs";
import { LendAndLoanContext } from "../context/LendAndLoanContext";
import { ethers } from "ethers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import lending from "../images/lending.png";
import signing from "../images/signing.png";
import timeConverter from "../utils/timeConvert";
import { AiFillWarning } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { PieChart } from '@rsuite/charts';


export default function Analyse() {
    const {
        themeMode,
        account,
        contractOdonLiquidity,
        contractOdonLiquidityInUsd,
        connectWallet,
        contractUsdcLiquidity,
        contractUsdcLiquidityInUsd,
        contractUsdtLiquidity,
        contractUsdtLiquidityInUsd,
        contractBtcLiquidity,
        contractBtcLiquidityInUsd,
        loanCount,
        lendCount
    } =
        useContext(LendAndLoanContext);

    const [usdcPercent, setUsdcPercent] = useState();
    const [usdtPercent, setUsdtPercent] = useState();
    const [btcPercent, setBtcPercent] = useState();
    const [odonPercent, setOdonPercent] = useState();

    const [totalLiquidityInusd, setTotalLiquidity] = useState();

    useEffect(() => {
        if (contractOdonLiquidityInUsd >= 0 && contractUsdcLiquidityInUsd >= 0 && contractUsdtLiquidityInUsd >= 0 && contractBtcLiquidityInUsd >= 0) {

            let total = contractOdonLiquidityInUsd + contractUsdcLiquidityInUsd + contractUsdtLiquidityInUsd + contractBtcLiquidityInUsd;

            let usdcp = contractUsdcLiquidityInUsd / total * 100;
            let usdtp = contractUsdtLiquidityInUsd / total * 100;
            let btcp = contractBtcLiquidityInUsd / total * 100;
            let odonp = contractOdonLiquidityInUsd / total * 100;

            setTotalLiquidity(total);
            setUsdcPercent(usdcp);
            setUsdtPercent(usdtp);
            setBtcPercent(btcp);
            setOdonPercent(odonp);
        }
    }, [contractOdonLiquidityInUsd, contractUsdcLiquidityInUsd, contractUsdtLiquidityInUsd, contractBtcLiquidityInUsd])

    const sampleData = [
        ['USDC', 0],
        ['USDT', 0],
        ['BTC', 0],
        ['ODON', 0],
    ];

    const realeDate = [
        ['USDC', usdcPercent],
        ['USDT', usdtPercent],
        ['BTC', btcPercent],
        ['ODON', odonPercent],
    ]

    return (
        <div className="mt-10 md:mt-24">
            <ToastContainer theme="dark" />

            <PieChart name="PieChart" data={totalLiquidityInusd ? realeDate : sampleData} />

            <div className="w-auto mx-5 md:max-w-[600px] text-center md:mx-auto mb-20">
                <div className="text-white font-bold text-2xl mb-3"><span className={themeMode ? "text-black" : "text-white"}>Total $ <span>
                    {
                        totalLiquidityInusd >= 0 ? totalLiquidityInusd : "Fetching..."
                    }
                </span></span></div>
                <div className={"p-10 shadow-xl  h-auto rounded-xl " + (themeMode ? "bg-white text-black" : "bg-[#191b1fc2]")}>
                    {" "}
                    <div className="mt-3 " style={{"overflow": "auto"}}>
                        <table style={{ "width": "100%" , "minWidth": "450px"}}>
                            <thead>
                                <tr></tr>
                                <tr></tr>
                            </thead>
                            <tbody className="">
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6" style={{ "width": "18%" }}>
                                        <div
                                            className="flex items-center cursor-pointer text-xl  transition"
                                        >
                                            Loan&nbsp;count
                                        </div>
                                    </td>
                                    <td className="pt-6" style={{ "width": "18%" }}>
                                        <div
                                            className="flex items-center cursor-pointer text-xl  transition"
                                        >
                                            {
                                                loanCount ? loanCount : "Fetching..."
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6" style={{ "width": "18%" }}>
                                        <div
                                            className="flex items-center cursor-pointer text-xl  transition"
                                        >
                                            Lend&nbsp;count
                                        </div>
                                    </td>
                                    <td className="pt-6" style={{ "width": "18%" }}>
                                        <div
                                            className="flex items-center cursor-pointer text-xl  transition"
                                        >
                                            {
                                                lendCount ? lendCount : "Fetching..."
                                            }
                                        </div>
                                    </td>
                                </tr>
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition "
                                        >
                                            ODON&nbsp;Liquidity
                                        </div>
                                    </td>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition "
                                        >
                                            {
                                                contractOdonLiquidity ? contractOdonLiquidity : "Fetching..."
                                            }&nbsp;ODON ($&nbsp;
                                            {
                                                contractOdonLiquidityInUsd  >= 0 ? contractOdonLiquidityInUsd : "Fetching..."
                                            })
                                        </div>
                                    </td>
                                </tr>
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition"
                                        >
                                            USDC&nbsp;Liquidity
                                        </div>
                                    </td>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition "
                                        >
                                            {
                                                contractUsdcLiquidity ? contractUsdcLiquidity : "Fetching..."
                                            }&nbsp;USDC ($&nbsp;
                                            {
                                                contractUsdcLiquidityInUsd >= 0 ? contractUsdcLiquidityInUsd : "Fetching..."
                                            })
                                        </div>
                                    </td>
                                </tr>
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition"
                                        >
                                            USDT&nbsp;Liquidity
                                        </div>
                                    </td>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition "
                                        >
                                            {
                                                contractUsdtLiquidity ? contractUsdtLiquidity : "Fetching..."
                                            }&nbsp;USDT ($&nbsp;
                                            {
                                                contractUsdtLiquidityInUsd >= 0 ? contractUsdtLiquidityInUsd : "Fetching..."
                                            })
                                        </div>
                                    </td>
                                </tr>
                                <tr style={themeMode ? { "overflowWrap": "anyWhere", "borderBottom": "1px solid black" } : { "overflowWrap": "anyWhere", "borderBottom": "1px solid white" }}>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition"
                                        >
                                            BTC&nbsp;Liquidity
                                        </div>
                                    </td>
                                    <td className="pt-6">
                                        <div
                                            className="flex items-center cursor-pointer text-xl transition "
                                        >
                                            {
                                                contractBtcLiquidity ? contractBtcLiquidity : "Fetching..."
                                            }&nbsp;BTC ($&nbsp;
                                            {
                                                contractBtcLiquidityInUsd >= 0 ? contractBtcLiquidityInUsd : "Fetching..."
                                            })
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
