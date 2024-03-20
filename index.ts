import { exit } from "process";
import * as dotenv from "dotenv"
dotenv.config()

const { ethers, Wallet, utils } = require("ethers");
const { FlashbotsBundleProvider, FlashbotsBundleResolution } = require("@flashbots/ethers-provider-bundle");
const FLASHBOTS_URL = "https://relay.flashbots.net";
const TOKEN_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; //USDC token address

const main = async () => {
    if (
        process.env.SPONSOR_KEY === undefined ||
        process.env.VICTIM_KEY === undefined
    ) {
        console.error("Please set both SPONSOR_KEY and VICTIM_KEY env");
        exit(1);
    }

    const provider = ethers.providers.getNetwork("homestead"); //Mainnet provider

    const authSigner = Wallet.createRandom();

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        FLASHBOTS_URL
    );

    const sponsor = new Wallet(process.env.SPONSOR_KEY).connect(provider); //Sponsor wallet that will pay the fees for the transaction
    const victim = new Wallet(process.env.VICTIM_KEY).connect(provider); //Victim hacked wallet

    const abi = ["function transfer(address, uint256) external"];
    const iface = new utils.Interface(abi);

    provider.on("block", async (blockNumber: any) => {
        console.log(blockNumber);
        const targetBlockNumber = blockNumber + 1;
        const resp = await flashbotsProvider.sendBundle([
            {
                signer: sponsor,
                transaction: {
                    chainId: 5,
                    type: 2,
                    to: victim.address,
                    value: utils.parseEther("0.0001"),
                    maxFeePerGas: utils.parseUnits("3", "gwei"),
                    maxPriorityFeePerGas: utils.parseUnits("2", "gwei")
                },
            },
            {
                signer: victim,
                transaction: {
                    chainId: 5,
                    type: 2,
                    to: TOKEN_ADDRESS,
                    gasLimit: "50000",
                    data: iface.encoderFunctionData("transfer", [
                        sponsor.address,
                        utils.parseEther("100", "USDC"),
                    ]),
                    maxFeePerGas: utils.parseUnits("3", "gwei"),
                    maxPriorityFeePerGas: utils.parseUnits("2", "gwei"),
                },
            },
        ], targetBlockNumber);

        if ("error" in resp) {
            console.log(resp.error.message);
            return;
        }

        const resolution = await resp.wait();
        if (resolution === FlashbotsBundleResolution.BundleIncluded) {
            console.log(`Congrats, included in ${targetBlockNumber}`);
            exit(0);
        } else if (resolution === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
            console.log(`Not included in ${targetBlockNumber}`);
        } else if (resolution === FlashbotsBundleResolution.AccountNonceTooHigh) {
            console.log("Nonce too high, bailing");
            exit(1);
        }

    });


};

main();