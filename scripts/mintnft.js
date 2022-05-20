require("dotenv").config();
const API_URL = process.env.API_URL;


const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
console.log(API_URL,PUBLIC_KEY,PRIVATE_KEY);
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const address='0x281a0f6EfC691d618Db98EC824DB94bc99E6c755';
const check1=web3.utils.toChecksumAddress(address);
console.log(check1);
const check2=web3.utils.toChecksumAddress(PUBLIC_KEY);
console.log(check2);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const nthcontract=new web3.eth.Contract(contract.abi,address);
async function mintNFT(tokenuri){
  const nonce=await web3.eth.getTransactionCount(check2,"latest");
  const txt={
    'from':check2,
    'to':check1,
    'nonce':nonce,
    'gas':500000,
    'data':nthcontract.methods.mintNFT(PUBLIC_KEY,tokenuri).encodeABI(),



  };
  const signPromise = web3.eth.accounts.signTransaction(txt, PRIVATE_KEY);
   console.log("ok");
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
mintNFT( "https://gateway.pinata.cloud/ipfs/QmaXXHGj6mDc6ujFsEEj4rPFpjH6xLxqVenbhoxFQBKFVj");

