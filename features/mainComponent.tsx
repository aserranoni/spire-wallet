import React, { useState } from "react"

import { useWallet } from "../contexts/walletContext.tsx"
import AccountInfo from "./accountInfo.tsx"
import ConnectButton from "./connectButton.tsx"
import TransferComponent from "./transferComponent.tsx"

const MainComponent: React.FC = () => {
  const {
    account,
    signData,
    connectWallet,
    disconnectWallet,
    signTransaction
  } = useWallet()

  return (
    <div className="container flex items-center bg-green-200">
      {account ? (
        <div>
          <AccountInfo account={account} disconnectWallet={disconnectWallet} />
          <TransferComponent signTransaction={signTransaction} />
        </div>
      ) : (
        <div>
          <ConnectButton connectWallet={connectWallet} />
        </div>
      )}
    </div>
  )
}

export default MainComponent
