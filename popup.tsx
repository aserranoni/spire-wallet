import React from "react"

import { WalletProvider } from "./contexts/walletContext"
import ConnectButton from "./features/connectButton"

const IndexPopup: React.FC = () => {
  return (
    <WalletProvider>
      <ConnectButton />
    </WalletProvider>
  )
}

export default IndexPopup
