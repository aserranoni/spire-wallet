import { Pact } from "@kadena/client"
import { connect, sign } from "@kadena/spirekey-sdk"
import { IUnsignedCommand, PactCode } from "@kadena/types"
import React, { createContext, useContext, useEffect, useState } from "react"

interface WalletContextProps {
  account: any
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  signTransaction: (IUnsignedCommand) => Promise<any>
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [account, setAccount] = useState<any>(null)

  // Connect function
  const connectWallet = async () => {
    try {
      const connectedAccount = await connect("testnet04", "1")

      if (connectedAccount) {
        await connectedAccount.isReady()
        const accountData = {
          account: connectedAccount.accountName,
          balance: Number(connectedAccount.balance),
          chainId: connectedAccount.chainIds,
          publicKey: connectedAccount.devices[0].guard.keys[0]
        }
        setAccount(accountData)
        localStorage.setItem("walletAccount", JSON.stringify(accountData))
      } else {
        throw new Error("NoSpireKeyError")
      }
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  // Sign transaction function
  const signTransaction = async (transactionData: IUnsignedCommand) => {
    if (!account) {
      throw new Error("No connected account")
    }

    try {
      const signedTx = await sign(transactionData)
      console.log("Signed Transaction:", signedTx)
      return signedTx.transactions[0]
    } catch (error) {
      console.error("Transaction signing failed:", error)
      throw error
    }
  }

  // Disconnect function
  const disconnectWallet = () => {
    setAccount(null)
    localStorage.removeItem("walletAccount")
  }

  // Load account from localStorage on app load
  useEffect(() => {
    const savedAccount = localStorage.getItem("walletAccount")
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount))
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{ account, connectWallet, disconnectWallet, signTransaction }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
