import type { ICommandResult } from "@kadena/client"
import { createClient, isSignedTransaction, Pact } from "@kadena/client"

interface ITransfer {
  accountFrom: string
  pubkey: string
  accountTo: string
  amount: number
  sign: (a: any) => Promise<any> // Add sign function as an argument
}

export default async function sendKDA({
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
    // Correcting "tranfer" to "transfer"
    const transactionBuilder = Pact.builder
      .execution(
        // @ts-ignore
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
      console.log(transactionDescriptor)
      console.log(response)
      if (response.result.status === "success") {
        return response
      } else {
        throw new Error(`Transaction failed: ${response.result.error}`)
      }
    } else {
      throw new Error("Failed to sign transaction")
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Transaction Error: ${e.message}`)
    } else {
      throw new Error("An unknown error occurred during the transaction.")
    }
  }
}
