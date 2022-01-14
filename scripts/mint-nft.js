require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0xf04f276ac7De5BEf046FC58DF3Ad63a89F53E0d7";//"0xcEa99b980ed3Eb42516690F40680d5fe67896b39";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

const tokenURI = "https://gateway.pinata.cloud/ipfs/QmdY1cr3z7sWGZTTcXVeSj7qmCK7wfnbqduWy281BPGZyU"

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    const tokenId = nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    
    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': tokenId
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
    return tokenId
}

//mintNFT("https://gateway.pinata.cloud/ipfs/Qmemq1qHPdqT76CK38zGFwZHupsqWK3TkPsfnp86ogyoXZ");

async function mintToken(buyerAddress, tokenId, tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    
    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'value': 10000000000000000,
        'data': nftContract.methods.mintToken(buyerAddress, tokenId, tokenURI).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

const buyerAddress = "0x4935b168eA3481E52922fA3052586afcc7EbadBb"; // Account1
//const tokenURI = "https://gateway.pinata.cloud/ipfs/Qmemq1qHPdqT76CK38zGFwZHupsqWK3TkPsfnp86ogyoXZ"


mintNFT(tokenURI)

/*
async function main() {
    const mintedTokenID = await mintNFT(tokenURI)
    console.log("Minted tokenId: ", mintedTokenID)

    mintToken(buyerAddress, 12, tokenURI);
}

main()
*/


