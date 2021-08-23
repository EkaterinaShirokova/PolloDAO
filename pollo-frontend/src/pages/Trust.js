import * as React from "react";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
// import { convertUtf8ToHex } from "@walletconnect/utils";
// import { IInternalEvent } from "@walletconnect/types";
import Button from '@material-ui/core/Button';
// import Column from "./components/Column";
// import Wrapper from "./components/Wrapper";
import Modal from '@material-ui/core/Modal';
// import Header from "./components/Header";
// import Loader from "./components/Loader";
// import { fonts } from "./styles";
import { Card, Typography } from "@material-ui/core";
// import { apiGetAccountAssets, apiGetGasPrices, apiGetAccountNonce } from "./helpers/api";
// import {
//   sanitizeHex,
//   verifySignature,
//   hashTypedDataMessage,
//   hashPersonalMessage,
// } from "./helpers/utilities";
// import { convertAmountToRawNumber, convertStringToHex } from "./helpers/bignumber";
// import { IAssetData } from "./helpers/types";
// import Banner from "./components/Banner";
// import AccountAssets from "./components/AccountAssets";
// import { eip712 } from "./helpers/eip712";

// const SLayout = styled.div`
//   position: relative;
//   width: 100%;
//   /* height: 100%; */
//   min-height: 100vh;
//   text-align: center;
// `;

// const SContent = styled(Wrapper as any)`
//   width: 100%;
//   height: 100%;
//   padding: 0 16px;
// `;

// const SLanding = styled(Column as any)`
//   height: 600px;
// `;

// const SButtonContainer = styled(Column as any)`
//   width: 250px;
//   margin: 50px 0;
// `;

// const SConnectButton = styled(Button as any)`
//   border-radius: 8px;
//   font-size: ${fonts.size.medium};
//   height: 44px;
//   width: 100%;
//   margin: 12px 0;
// `;

// const SContainer = styled.div`
//   height: 100%;
//   min-height: 200px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   word-break: break-word;
// `;

// const SModalContainer = styled.div`
//   width: 100%;
//   position: relative;
//   word-wrap: break-word;
// `;

// const SModalTitle = styled.div`
//   margin: 1em 0;
//   font-size: 20px;
//   font-weight: 700;
// `;

// const SModalParagraph = styled.p`
//   margin-top: 30px;
// `;

// // @ts-ignore
// const SBalances = styled(SLanding as any)`
//   height: 100%;
//   & h3 {
//     padding-top: 30px;
//   }
// `;

// const STable = styled(SContainer as any)`
//   flex-direction: column;
//   text-align: left;
// `;

// const SRow = styled.div`
//   width: 100%;
//   display: flex;
//   margin: 6px 0;
// `;

// const SKey = styled.div`
//   width: 30%;
//   font-weight: 700;
// `;

// const SValue = styled.div`
//   width: 70%;
//   font-family: monospace;
// `;

// const STestButtonContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-wrap: wrap;
// `;

// const STestButton = styled(Button as any)`
//   border-radius: 8px;
//   font-size: ${fonts.size.medium};
//   height: 44px;
//   width: 100%;
//   max-width: 175px;
//   margin: 12px;
// `;

// interface IAppState {
//   connector: WalletConnect | null;
//   fetching: boolean;
//   connected: boolean;
//   chainId: number;
//   showModal: boolean;
//   pendingRequest: boolean;
//   uri: string;
//   accounts: string[];
//   address: string;
//   result: any | null;
//   assets: IAssetData[];
// }

// const INITIAL_STATE: IAppState = {
//   connector: null,
//   fetching: false,
//   connected: false,
//   chainId: 1,
//   showModal: false,
//   pendingRequest: false,
//   uri: "",
//   accounts: [],
//   address: "",
//   result: null,
//   assets: [],
// };

class App extends React.Component {


    walletConnectInit = async () => {
        // bridge url
        const bridge = "https://bridge.walletconnect.org";

        // create new connector
        const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
        await this.setState({ connector });

        // check if already connected
        if (!connector.connected) {
            // create new session
            await connector.createSession();
        }

        // subscribe to events
        await this.subscribeToEvents();
    };
    subscribeToEvents = () => {
        const { connector } = this.state;

        if (!connector) {
            return;
        }

        connector.on("session_update", async (error, payload) => {
            console.log(`connector.on("session_update")`);

            if (error) {
                throw error;
            }

            const { chainId, accounts } = payload.params[0];
            this.onSessionUpdate(accounts, chainId);
        });

        connector.on("connect", (error, payload) => {
            console.log(`connector.on("connect")`);

            if (error) {
                throw error;
            }

            this.onConnect(payload);
        });

        connector.on("disconnect", (error, payload) => {
            console.log(`connector.on("disconnect")`);

            if (error) {
                throw error;
            }

            this.onDisconnect();
        });

        if (connector.connected) {
            const { chainId, accounts } = connector;
            const address = accounts[0];
            this.setState({
                connected: true,
                chainId,
                accounts,
                address,
            });
            this.onSessionUpdate(accounts, chainId);
        }

        this.setState({ connector });
    };

    killSession = async () => {
        const { connector } = this.state;
        if (connector) {
            connector.killSession();
        }
        this.resetApp();
    };

    resetApp = async () => {
        await this.setState({});
    };

    onConnect = async () => {
        // const { chainId, accounts } = payload.params[0];
        // const address = accounts[0];
        await this.setState({
            connected: true,
            //   chainId,
            //   accounts,
            //   address,
        });
        this.getAccountAssets();
    };

    onDisconnect = async () => {
        this.resetApp();
    };

    onSessionUpdate = async () => {
        // const address = accounts[0];
        // await this.setState({ chainId, accounts, address });
        await this.getAccountAssets();
    };

    getAccountAssets = async () => {
        const { address, chainId } = this.state;
        this.setState({ fetching: true });
        try {
            // get account balances
            //   const assets = await apiGetAccountAssets(address, chainId);

            await this.setState({ fetching: false, address, });
        } catch (error) {
            console.error(error);
            await this.setState({ fetching: false });
        }
    };

    toggleModal = () => this.setState({ showModal: !this.state.showModal });

    testSendTransaction = async () => {
        const { connector, address, chainId } = this.state;

        if (!connector) {
            return;
        }

        // from
        const from = address;

        // to
        const to = address;

        // nonce
        // const _nonce = await apiGetAccountNonce(address, chainId);
        // const nonce = sanitizeHex(convertStringToHex(_nonce));

        // gasPrice
        // const gasPrices = await apiGetGasPrices();
        // const _gasPrice = gasPrices.slow.price;
        // const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));

        // gasLimit
        const _gasLimit = 21000;
        // const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

        // value
        const _value = 0;
        // const value = sanitizeHex(convertStringToHex(_value));

        // data
        const data = "0x";
        console.log(connector);
        // test transaction
        const tx = {
            from,
            to,

            data,
        };

        try {
            // open modal
            this.toggleModal();

            // toggle pending request indicator
            this.setState({ pendingRequest: true });

            // send transaction
            const result = await connector.sendTransaction(tx);

            // format displayed result
            const formattedResult = {
                method: "eth_sendTransaction",
                txHash: result,
                from: address,
                to: address,
                value: "0 ETH",
            };

            // display result
            this.setState({
                connector,
                pendingRequest: false,
                result: formattedResult || null,
            });
        } catch (error) {
            console.error(error);
            this.setState({ connector, pendingRequest: false, result: null });
        }
    };

    testSignPersonalMessage = async () => {
        const { connector, address, chainId } = this.state;

        if (!connector) {
            return;
        }

        // test message
        const message = "My email is john@doe.com - 1537836206101";

        // encode message (hex)
        // const hexMsg = convertUtf8ToHex(message);

        // personal_sign params
        // const msgParams = [hexMsg, address];

        try {
            // open modal
            this.toggleModal();

            // toggle pending request indicator
            this.setState({ pendingRequest: true });

            // send message
            const result = await connector.signPersonalMessage();

            // verify signature
            //   const hash = hashPersonalMessage(message);
            //   const valid = await verifySignature(address, result, hash, chainId);

            // format displayed result
            const formattedResult = {
                method: "personal_sign",
                address,
                // valid,
                result,
            };

            // display result
            this.setState({
                connector,
                pendingRequest: false,
                result: formattedResult || null,
            });
        } catch (error) {
            console.error(error);
            this.setState({ connector, pendingRequest: false, result: null });
        }
    };

    testSignTypedData = async () => {
        const { connector, address, chainId } = this.state;

        if (!connector) {
            return;
        }

        const message = JSON.stringify();

        // eth_signTypedData params
        const msgParams = [address, message];

        try {
            // open modal
            this.toggleModal();

            // toggle pending request indicator
            this.setState({ pendingRequest: true });

            // sign typed data
            const result = await connector.signTypedData(msgParams);

            // verify signature
            //   const hash = hashTypedDataMessage();
            //   const valid = await verifySignature();

            // format displayed result
            const formattedResult = {
                method: "eth_signTypedData",
                address,
                // valid,
                result,
            };

            // display result
            this.setState({
                connector,
                pendingRequest: false,
                result: formattedResult || null,
            });
        } catch (error) {
            console.error(error);
            this.setState({ connector, pendingRequest: false, result: null });
        }
    };

    render = () => {
        const {
            assets,
            address,
            connected,
            chainId,
            fetching,
            showModal,
            pendingRequest,
            result,
        } = this.state;
        return (
            <div>
                <div maxWidth={1000} spanHeight>
                    <Card
                        connected={connected}
                        address={address}
                        chainId={chainId}
                        killSession={this.killSession}
                    />
                    <div>
                        {!address && !assets.length ? (
                            <div>
                                {/* <h3>
                  {`Try out WalletConnect`}
                  <br />
                  <span>{`v${process.env.REACT_APP_VERSION}`}</span>
                </h3> */}
                                <Card>
                                    <Button left onClick={this.walletConnectInit} fetching={fetching}>
                                        {"Connect"}
                                    </Button>
                                </Card>
                            </div>
                        ) : (
                            <div>
                                {/* <Banner /> */}
                                <h3>Actions</h3>
                                <div>
                                    <Card>
                                        <Button left onClick={this.testSendTransaction}>
                                            {"eth_sendTransaction"}
                                        </Button>

                                        <Button left onClick={this.testSignPersonalMessage}>
                                            {"personal_sign"}
                                        </Button>

                                        <Button left onClick={this.testSignTypedData}>
                                            {"eth_signTypedData"}
                                        </Button>
                                    </Card>
                                </div>
                                <h3>Balances</h3>
                                {!fetching ? (
                                    <Card chainId={chainId} assets={assets} />
                                ) : (
                                    <div>
                                        <Card>
                                            {/* <Loader /> */}
                                        </Card>
                                        <h3> {console.log(this.testSignPersonalMessage)}</h3>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Modal show={showModal} toggleModal={this.toggleModal}>
                    {pendingRequest ? (
                        <Card>
                            <Typography>{"Pending Call Request"}</Typography>
                            <Card>
                                {/* <Loader /> */}
                                <Typography>{"Approve or reject request using your wallet"}</Typography>
                            </Card>
                        </Card>
                    ) : result ? (
                        <Card>
                            <Typography>{"Call Request Approved"}</Typography>
                            <Card>
                                {Object.keys(result).map(key => (
                                    <Card key={key}>
                                        <Typography>{key}</Typography>
                                        <Typography>{result[key].toString()}</Typography>
                                    </Card>
                                ))}
                            </Card>
                        </Card>
                    ) : (
                        <Card>
                            <Typography>{"Call Request Rejected"}</Typography>
                        </Card>
                    )}
                </Modal>
            </div>
        );
    };
}

export default App;
