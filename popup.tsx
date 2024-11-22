import React from "react"

import "./style.css"

import { WalletProvider } from "./contexts/walletContext"
import MainComponent from "./features/mainComponent.tsx"

const IndexPopup: React.FC = () => {
  return (
    <WalletProvider>
      <MainComponent />
    </WalletProvider>
  )
}

export default IndexPopup
