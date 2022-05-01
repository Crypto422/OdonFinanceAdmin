import { useContext, useEffect } from "react";
import {Manage} from "./components/Manage";
import Setting from "./components/Setting";
import Navbar from "./components/Navbar";
import Error from "./components/Error";
import Redemption from "./components/Analyse";
import { Routes, Route } from "react-router-dom";
import { LendAndLoanContext } from "./context/LendAndLoanContext";
import { ConnectWallet, DisConnectWallet } from "./components/ConnectWallet";

function App() {
  const { networkId, themeMode, setThemeMode, setIsShowDisConnectModal, isShowConnectModal, isShowDisConnectModal, setIsShowConnectModal,contractOdonLiquidity, contractUsdcLiquidity, contractUsdtLiquidity, contractBtcLiquidity, isSupportMetaMask } =
    useContext(LendAndLoanContext);

    useEffect(() => {
      var currentTheme = localStorage.getItem('themeMode');
      if (currentTheme === "false") {
        setThemeMode(false);
      } else {
        setThemeMode(true);
      }
    },[])

  return (
    <div className={"App min-h-screen text-white"}>
      <ConnectWallet
        isShow={isShowConnectModal}
        setIsShowConnectModal={setIsShowConnectModal}
      />
      <DisConnectWallet
        isShow={isShowDisConnectModal}
        setIsShowDisConnectModal={setIsShowDisConnectModal}
      />
      {isSupportMetaMask ? (
        networkId != undefined ? (
          networkId == 4 ? (
            <div>
              <div>
                <Navbar />
              </div>
              <Routes>
                <Route path="/" element={<Manage />} />
                <Route path="/manage" element={<Manage />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/analytics" element={<Redemption />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </div>
          ) : (
            <div className="translate-y-1/2">
              <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
                Sorry, our contract only run on rinkeby testnet, you have to
                switch your network to continue...
              </div>
            </div>
          )
        ) : (
          <div className="translate-y-1/2">
            <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
              Try to refresh the page ^_^
            </div>
          </div>
        )
      ) : (
        <div className="translate-y-1/2">
          <div className="text-center flex items-center justify-center shadow-xl w-[90%] md:max-w-[450px] h-[200px] bg-[#191b1fc2] mx-auto rounded-xl p-4">
            You should consider trying MetaMask!
          </div>
        </div>
      )}
      <div className={"fixed top-0 left-0 right-0 bottom-0 z-[-1] pointer-events-none w-[200vw] " + (themeMode ? "bg-shine-white bg-main-white" : "bg-shine bg-main")}></div>
      <div className="hidden md:flex  justify-center items-center fixed right-3 bottom-24 text-gray-300">
        <div className="h-[10px] w-[10px] rounded-full mr-1 bg-green-500"></div>
        <div className={(themeMode ? "text-black" : "")}>
          Finance liquidity
        </div>
      </div>
      <div className="hidden md:flex  justify-center items-center fixed right-3 bottom-16 text-gray-300">
        <div className={(themeMode ? "text-black" : "")}>
          {contractOdonLiquidity ? contractOdonLiquidity + " ODON" : "Fetching..."}
        </div>
      </div>
      <div className="hidden md:flex  justify-center items-center fixed right-3 bottom-12 text-gray-300">
        <div className={(themeMode ? "text-black" : "")}>
          {contractUsdcLiquidity ? contractUsdcLiquidity + " USDC" : "Fetching..."}
        </div>
      </div>
      <div className="hidden md:flex  justify-center items-center fixed right-3 bottom-8 text-gray-300">
        <div className={(themeMode ? "text-black" : "")}>
          {contractUsdtLiquidity ? contractUsdtLiquidity + " USDT" : "Fetching..."}
        </div>
      </div>
      <div className="hidden md:flex  justify-center items-center fixed right-3 bottom-4 text-gray-300">
        <div className={(themeMode ? "text-black" : "")}>
          {contractBtcLiquidity ? contractBtcLiquidity + " BTC" : "Fetching..."}
        </div>
      </div>
     
    </div >
  );
}

export default App;
