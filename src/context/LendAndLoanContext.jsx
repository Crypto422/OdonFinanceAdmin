import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  loanAbi,
  loanContractAddress,
  odonAbi,
  odonTokenContractAddress,
  usdcAbi,
  usdcTokenContractAddress,
  usdtAbi,
  usdtTokenContractAddress,
  btcAbi,
  btcTokenContractAddress,
} from "../utils/constants";

export const LendAndLoanContext = createContext();

export const LendAndLoanProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [networkId, setNetworkId] = useState();
  const [themeMode, setTheme] = useState(false);
  const [contractOdonLiquidity, setOdonContractLiquidity] = useState();
  const [contractTotalLiquiditedAmount, setTotalContractLiquiditedAmount] = useState();
  const [contractOdonLiquidityInUsd, setOdonContractLiquidityInUsd] = useState();
  const [contractUsdcLiquidity, setUsdcContractLiquidity] = useState();
  const [contractUsdcLiquidityInUsd, setUsdcContractLiquidityInUsd] = useState();
  const [contractUsdtLiquidity, setUsdtContractLiquidity] = useState();
  const [contractUsdtLiquidityInUsd, setUsdtContractLiquidityInUsd] = useState();
  const [contractBtcLiquidity, setbtcContractLiquidity] = useState();
  const [contractBtcLiquidityInUsd, setBtcContractLiquidityInUsd] = useState();
  const [isShowConnectModal, setIsShowConnectModal] = useState();
  const [isSupportMetaMask, setIsSupportMetaMask] = useState(false);
  const [isShowDisConnectModal, setIsShowDisConnectModal] = useState();

  const [usdcLendApy, setUsdcLendApy] = useState();
  const [usdtLendApy, setUsdtLendApy] = useState();
  const [btcLendApy, setBtcLendApy] = useState();
  const [usdcBorrowApy, setUsdcBorrowApy] = useState();
  const [usdtBorrowApy, setUsdtBorrowApy] = useState();
  const [btcBorrowApy, setBtcBorrowApy] = useState();
  const [firstAddApy, setFirstAddApy] = useState();
  const [secondAddApy, setSecondAddApy] = useState();
  const [loanMode, setLoanMode] = useState();
  const [usdcLTV, setUsdcLTV] = useState();
  const [usdtLTV, setUsdtLTV] = useState();
  const [btcLTV, setBtcLTV] = useState();

  const [loanCount, setLoanCount] = useState();
  const [lendCount, setLendCount] = useState();

  const [usdcAccBalance, setUsdcAccBalance] = useState();
  const [odonAccBalance, setOdonAccBalance] = useState();
  const [usdtAccBalance, setUsdtAccBalance] = useState();
  const [wbtcAccBalance, setWbtcAccBalance] = useState();



  let library;
  if (window.ethereum) {
    library = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    library = undefined;
  }
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  const setThemeMode = (value) => {
    setTheme(value);
  }


  const disconnectWallet = async () => {
    setIsShowDisConnectModal(false);
  }

  const disconnect = () => {
    setIsShowDisConnectModal(true);
  }

  const getLoanContract = (providerOrSigner) => {
    const loanContract = new ethers.Contract(
      loanContractAddress,
      loanAbi,
      providerOrSigner
    );
    return loanContract;
  };
  const getOdonTokenContract = (providerOrSigner) => {
    const odonContract = new ethers.Contract(
      odonTokenContractAddress,
      odonAbi,
      providerOrSigner
    );
    return odonContract;
  };
  const getUsdcTokenContract = (providerOrSigner) => {
    const usdcContract = new ethers.Contract(
      usdcTokenContractAddress,
      usdcAbi,
      providerOrSigner
    );
    return usdcContract;
  };
  const getUsdtTokenContract = (providerOrSigner) => {
    const usdtContract = new ethers.Contract(
      usdtTokenContractAddress,
      usdtAbi,
      providerOrSigner
    );
    return usdtContract;
  };
  const getBtcTokenContract = (providerOrSigner) => {
    const btcContract = new ethers.Contract(
      btcTokenContractAddress,
      btcAbi,
      providerOrSigner
    );
    return btcContract;
  };
  const getAccBalance = async () => {
    if (library) {
      if (account) {
        let balance = await library.getBalance(account);
        return Number(ethers.utils.formatEther(balance.toString()));
      }
    }
  };

  const getAccODONBalance = async () => {
    if (library) {
      if (account) {
        const contract = getOdonTokenContract(library);
        const res = await contract.balanceOf(account);
        return Number(ethers.utils.formatEther(res.toString()));
      }
    }
  }

  const getAccUSDCBalance = async () => {
    if (library) {
      if (account) {
        const contract = getUsdcTokenContract(library);
        const res = await contract.balanceOf(account);
        return Number(res.toString() / 10 ** 6);
      }
    }
  }

  const getAccUSDTBalance = async () => {
    if (library) {
      if (account) {
        const contract = getUsdtTokenContract(library);
        const res = await contract.balanceOf(account);
        return Number(res.toString() / 10 ** 6);
      }
    }
  }
  const getAccBTCBalance = async () => {
    if (library) {
      if (account) {
        const contract = getBtcTokenContract(library);
        const res = await contract.balanceOf(account);
        return Number(res.toString() / 10 ** 8)
      }
    }
  }


  const getUserOngoingLoan = async () => {
    if (library) {
      const contract = getLoanContract(library.getSigner());
      if (account) {
        const loans = await contract.getUserOngoingLoans();
        return loans;
      }
    }
  };
  const getUserUnHealthLoans = async () => {
    if (library) {
      const contract = getLoanContract(library.getSigner());
      if (account) {
        const loans = await contract.getUserUnHealthLoans();
        return loans;
      }
    }
  };
  const getUserOverdueLoans = async () => {
    if (library) {
      const contract = getLoanContract(library.getSigner());
      if (account) {
        const loans = await contract.getUserOverdueLoans();
        return loans;
      }
    }
  };

  const setContractTotalLiquidity = async () => {
    if (library) {
      const contract = getLoanContract(library);

      const loancount = await contract.loanCount();
      const lendcount = await contract.lendCount();

      const totalLiquidatedAmount = await contract.totalLiquidatedAmount();
      const odon = await contract.odonTotalLiquidity();
      const usdc = await contract.usdcTotalLiquidity();
      const usdt = await contract.usdtTotalLiquidity();
      const btc = await contract.btcTotalLiquidity();

      const odonInusd = await contract.getTotalLiquidityInUSD(5);
      const usdcInusd = await contract.getTotalLiquidityInUSD(2);
      const usdtInusd = await contract.getTotalLiquidityInUSD(3);
      const btcInusd = await contract.getTotalLiquidityInUSD(4);

      const usdcbalance = await getAccUSDCBalance();
      const usdtbalance = await getAccUSDTBalance();
      const wbtcbalance = await getAccBTCBalance();
      const odonbalance = await getAccODONBalance();

      setUsdcAccBalance(usdcbalance);
      setUsdtAccBalance(usdtbalance);
      setWbtcAccBalance(wbtcbalance);
      setOdonAccBalance(odonbalance);

      setLoanCount(
        loancount.toString()
      )
      setLendCount(
        lendcount.toString()
      )

      setTotalContractLiquiditedAmount(
        Number(totalLiquidatedAmount.toString() / 10 ** 18).toFixed(3)
      );
      setOdonContractLiquidity(
        Number(ethers.utils.formatEther(odon.toString())).toFixed(3)
      );
      setUsdcContractLiquidity(
        Number(usdc.toString() / 10 ** 6).toFixed(3)
      );
      setUsdtContractLiquidity(
        Number(usdt.toString() / 10 ** 6).toFixed(3)
      );
      setbtcContractLiquidity(
        Number(btc.toString() / 10 ** 8).toFixed(3)
      );


      setOdonContractLiquidityInUsd(
        Number(odonInusd.toString() / 10 ** 18)
      );
     
      setUsdcContractLiquidityInUsd(
        Number(usdcInusd.toString() / 10 ** 6)
      );
      setUsdtContractLiquidityInUsd(
        Number(usdtInusd.toString() / 10 ** 6)
      );
      setBtcContractLiquidityInUsd(
        Number(btcInusd.toString() / 10 ** 8)
      );
    }
  };

  const setContractApy = async () => {
    if (library) {
      const contract = getLoanContract(library);
      const loanMode = await contract.loanMode();
      const usdclendapy = await contract.usdcLendAPY();
      const usdtlendapy = await contract.usdtLendAPY();
      const btclendapy = await contract.btcLendAPY();
      const usdcborrowapy = await contract.usdcBorrowAPY();
      const usdtborrowapy = await contract.usdtBorrowAPY();
      const btcborrowapy = await contract.btcBorrowAPY();
      const firstaddapy = await contract.firstAddAPY();
      const secondaddapy = await contract.secondAddAPY();
      const usdcLTV = await contract.usdcLTV();
      const usdtLTV = await contract.usdtLTV();
      const btcLTV = await contract.btcLTV();

      setUsdcBorrowApy(
        Number(ethers.utils.formatEther(usdcborrowapy.toString()))
      );
      setUsdtBorrowApy(
        Number(ethers.utils.formatEther(usdtborrowapy.toString()))
      );
      setBtcBorrowApy(
        Number(ethers.utils.formatEther(btcborrowapy.toString()))
      );
      setUsdcLendApy(
        Number(ethers.utils.formatEther(usdclendapy.toString()))
      );
      setUsdtLendApy(
        Number(ethers.utils.formatEther(usdtlendapy.toString()))
      );
      setBtcLendApy(
        Number(ethers.utils.formatEther(btclendapy.toString()))
      );
      setFirstAddApy(
        Number(ethers.utils.formatEther(firstaddapy.toString()))
      );
      setSecondAddApy(
        Number(ethers.utils.formatEther(secondaddapy.toString()))
      );
      setUsdcLTV(
        Number(ethers.utils.formatEther(usdcLTV.toString()))
      );
      setUsdtLTV(
        Number(ethers.utils.formatEther(usdtLTV.toString()))
      );
      setBtcLTV(
        Number(ethers.utils.formatEther(btcLTV.toString()))
      );


      setLoanMode(loanMode)

    }
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      library = new ethers.providers.Web3Provider(window.ethereum);
      setIsSupportMetaMask(true);
    } else {
      setIsSupportMetaMask(false);
    }
  };
  const handleStartUp = async () => {
    if (typeof window.ethereum != undefined) {
      const acc = await library.listAccounts();
      if (acc) {
        setAccount(acc[0]);
      }
      setContractTotalLiquidity();
      setContractApy();
      setNetworkId(window.ethereum.networkVersion);
      window.ethereum.on("chainChanged", function (networkId) {
        // Time to reload your interface with the new networkId
        setNetworkId(networkId);
      });
      window.ethereum.on("accountsChanged", async function (acc) {
        if (acc) {
          // changed account
          setAccount(acc[0]);
        } else {
          // disconnect
          setAccount([]);
        }
      });
    }
  };

  const getLoansLTV = async (id) => {
    if (library) {
      const contract = getLoanContract(library.getSigner());
      if (account) {
        const ltv = await contract.getLoansLTV(account, id);

        return Number(ethers.utils.formatEther(ltv.toString()));
      }
    }
  }


  useEffect(async () => {
    await loadWeb3();
    await handleStartUp();
    await getAccBalance();
  }, [account]);
  return (
    <LendAndLoanContext.Provider
      value={{
        themeMode,
        account,
        library,
        networkId,
        isSupportMetaMask,
        contractTotalLiquiditedAmount,
        contractOdonLiquidity,
        contractOdonLiquidityInUsd,
        contractUsdcLiquidity,
        contractUsdcLiquidityInUsd,
        contractUsdtLiquidity,
        contractUsdtLiquidityInUsd,
        contractBtcLiquidity,
        contractBtcLiquidityInUsd,
        usdcBorrowApy,
        usdtBorrowApy,
        btcBorrowApy,
        usdcLendApy,
        usdtLendApy,
        btcLendApy,
        firstAddApy,
        secondAddApy,
        loanMode,
        isShowConnectModal,
        isShowDisConnectModal,
        usdcLTV,
        usdtLTV,
        btcLTV,
        loanCount,
        lendCount,
        usdcAccBalance,
        usdtAccBalance,
        wbtcAccBalance,
        odonAccBalance,
        connectWallet,
        disconnectWallet,
        disconnect,
        setThemeMode,
        getLoanContract,
        getOdonTokenContract,
        getUsdcTokenContract,
        getUsdtTokenContract,
        getBtcTokenContract,
        getAccBalance,
        getAccODONBalance,
        getAccUSDCBalance,
        getAccUSDTBalance,
        getAccBTCBalance,
        getUserOngoingLoan,
        getUserUnHealthLoans,
        getUserOverdueLoans,
        setContractTotalLiquidity,
        setContractApy,
        setIsShowDisConnectModal,
        setIsShowConnectModal,
        getLoansLTV
      }}
    >
      {children}
    </LendAndLoanContext.Provider>
  );
};
