// const ethers = require("ethers")
// const fs = require("fs-extra")
// require("dotenv").config()
import {ethers} from "ethers";

import * as fs from "fs-extra";
import "dotenv/config";

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf-8")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD!,
    // )
    // wallet = await wallet.connect(provider)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8",
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8",
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

    console.log("Deploying , please wait...")

    const contract = await contractFactory.deploy()
    const deploymentReceipt = await contract.deployTransaction.wait(1)
    console.log(deploymentReceipt)

    const currentFavoriteNumber = await contract.retrieve()
    console.log(currentFavoriteNumber.toString())
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(updatedFavoriteNumber.toString())
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
// 6:51:01
