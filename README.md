
# Rescue tokens

This project demonstrates how to use Flashbots to send transactions on the Ethereum network. It uses two wallets: a sponsor wallet to pay the fees and a victim wallet to execute a specific action (in this case, transferring USDC tokens). The transactions are bundled and sent through Flashbots to prevent them from being visible in the public mempool before they are mined.

## Prerequisites

Before you start, ensure you have the following installed:
- Node.js (v12 or newer)
- npm (or yarn)

You will also need to have two Ethereum wallets ready:
- **SPONSOR_KEY**: The private key of the wallet that will pay for the transaction fees.
- **VICTIM_KEY**: The private key of the wallet from which the USDC tokens will be transferred.

**Warning**: Never commit private keys to your source code or public repositories for security reasons.

## Setup

1. Clone this repository to your local machine.

   ```bash
   git clone https://github.com/samukbg/rescue-tokens.git
   cd rescue-tokens
   ```

2. Install the required dependencies.

   ```bash
   npm install
   ```

   Or if you prefer yarn:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root of your project and add your Ethereum wallet private keys as environment variables.

   ```
   SPONSOR_KEY=<your-sponsor-wallet-private-key>
   VICTIM_KEY=<your-victim-wallet-private-key>
   ```

   Replace `<your-sponsor-wallet-private-key>` and `<your-victim-wallet-private-key>` with the actual private keys.

## Running the Code

To run the script, execute the following command in your terminal:

```bash
npx ts-node index.ts
```

## Notes

- This script is configured to interact with the Ethereum mainnet. Ensure you have enough ETH in your sponsor wallet to cover transaction fees.
- The script uses Flashbots to send a transaction bundle, which includes a payment from the victim wallet and covers the gas fees from the sponsor wallet.
- The USDC token address and the transaction details are hardcoded for demonstration purposes. You may need to adjust these according to your requirements.

## Disclaimer

This script is provided for educational purposes only. Be aware of the risks involved in sending transactions on the Ethereum network, and never use private keys that control significant assets in test scripts.
