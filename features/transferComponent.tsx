import type { ICommandResult } from "@kadena/client"
import { createClient, isSignedTransaction, Pact } from "@kadena/client"
import React, { useState } from "react"

import { Button } from "../components/ui/button.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"

interface ITransfer {
  accountFrom: string
  pubkey: string
  accountTo: string
  amount: number
  sign: (a: any) => Promise<any>
}

async function sendKDA({
  accountFrom,
  pubkey,
  accountTo,
  amount,
  sign
}: ITransfer): Promise<ICommandResult> {
  if (!accountFrom) {
    throw new Error("No connected account.")
  }

  try {
    const transactionBuilder = Pact.builder
      .execution(
        Pact.modules["coin"]["transfer"](accountFrom, accountTo, {
          decimal: amount.toString()
        })
      )
      .addSigner(
        {
          pubKey: pubkey,
          scheme: "WebAuthn"
        },
        (withCapability) => [
          withCapability("coin.GAS"),
          withCapability("coin.TRANSFER", accountFrom, accountTo, {
            decimal: amount.toString()
          })
        ]
      )
      .setMeta({ chainId: "1", senderAccount: accountFrom })
      .setNetworkId("testnet04")
      .createTransaction()

    const signedTx = await sign(transactionBuilder)
    const client = createClient(
      "https://testnet.mindsend.xyz/chainweb/0.0/testnet04/chain/1/pact"
    )

    if (isSignedTransaction(signedTx)) {
      const transactionDescriptor = await client.submit(signedTx)
      const response = await client.listen(transactionDescriptor)

      if (response.result.status === "success") {
        return response
      } else {
        throw new Error(`Transaction failed: ${response.result.error}`)
      }
    } else {
      throw new Error("Failed to sign transaction.")
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Transaction Error: ${e.message}`)
    } else {
      throw new Error("An unknown error occurred during the transaction.")
    }
  }
}

export interface ITransferComponentProps {
  account: {
    account: string
    publicKey: string
  }
  signTransaction: (transaction: any) => Promise<any>
}

const TransferComponent: React.FC<ITransferComponentProps> = ({
  account,
  signTransaction
}) => {
  const [recipient, setRecipient] = useState<string>("")
  const [amount, setAmount] = useState<string>("") // Keep as string for controlled input handling
  const [transferResult, setTransferResult] = useState<string | null>(null)

  const handleTransfer = async () => {
    if (!recipient || !amount || isNaN(Number(amount))) {
      setTransferResult("Please enter a valid recipient and amount.")
      return
    }

    try {
      const transferResponse = await sendKDA({
        accountFrom: account.account,
        pubkey: account.publicKey,
        accountTo: recipient,
        amount: Number(amount),
        sign: signTransaction
      })

      if (transferResponse.result.status === "success") {
        setTransferResult("Transfer successful!")
      } else {
        setTransferResult(`Transfer failed: ${transferResponse.result.error}`)
      }
    } catch (error) {
      setTransferResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  return (
    <div className="flex p-8 items-center">
      <Card className="p-4 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-200 text-lg">Transfer KDA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            className="bg-gray-500"
            type="text"
            placeholder="Recipient Account"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Input
            className="bg-gray-500"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleTransfer}
            variant="destructive"
            className="w-full bg-gray-200 text-gray-900">
            Send
          </Button>
          {transferResult && (
            <p
              className={`text-sm ${
                transferResult.startsWith("Error")
                  ? "text-destructive"
                  : "text-green-500"
              }`}>
              {transferResult}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TransferComponent
