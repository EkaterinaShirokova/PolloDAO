import Torus from "@toruslabs/torus-embed";
import { BscConnector } from '@binance-chain/bsc-connector'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

let torus = null;
let trust = null;
let bsc = null;

export const getTorusWallet = async () => {
    if (torus == null) {
        torus = new Torus({});
        await torus.init({
            enableLogging: false,
            showTorusButton: false
        });
    }
    return torus;
};

export const getBSCWallet = async () => {
    if (bsc == null) {
        bsc = new BscConnector({
            supportedChainIds: [56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
        })
    }
    return bsc;
}

export const getTrustWallet = async() => {
    if (trust == null) {
        trust = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
        qrcodeModal: QRCodeModal,
        });
    }
    return trust;
}