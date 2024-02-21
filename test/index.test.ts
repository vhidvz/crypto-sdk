/* eslint-disable @typescript-eslint/no-explicit-any */
import { Web3 } from 'web3';

describe('test hello function', () => {
  it("should return 'Hello World...!'", async () => {
    const web3 = new Web3(process.env.GETBLOCKIO_TESTNET_BSC);

    const accounts = [
      {
        address: '0x158862eABe381fb2100830d3F6993E781620D24E',
        privateKey: '0xe87374f05b422e334f51b224f989845396c22863f96c6cbf81222cafcb7535be',
      },
      {
        address: '0x600e3DA2aa19bB4ed74BF1672786e22b16914a64',
        privateKey: '0xf70b99b5858df14912746caed461d690c8cc7cac903291d761fd5ff10e114eac',
      },
    ];

    // 1st - creating a new account
    const accountFrom = web3.eth.accounts.privateKeyToAccount(accounts[1].privateKey);
    // 2nd - add the account to the wallet
    const accountTo = web3.eth.accounts.privateKeyToAccount(accounts[0].privateKey);

    // امضای تراکنش
    const signTransaction = async (transactionObject: any): Promise<string> => {
      const signedTx = await web3.eth.accounts.signTransaction(
        transactionObject,
        accountFrom.privateKey,
      );
      return signedTx.rawTransaction;
    };

    // انتقال BNB
    const transferBNB = async () => {
      const transactionObject: any = {
        from: accountFrom.address,
        to: accountTo.address,
        value: web3.utils.toWei('0.1', 'ether'), // مقدار BNB را به واحد Wei تبدیل کنید
      };

      const gas = await web3.eth.estimateGas(transactionObject);

      transactionObject.gas = String(gas); // مقدار گاز مورد نیاز برای انتقال
      transactionObject.gasPrice = web3.utils.toWei('5', 'gwei'); // قیمت گاز به واحد Wei

      const signedTx = await signTransaction(transactionObject);

      // ارسال تراکنش به شبکه BSC
      const result = await web3.eth.sendSignedTransaction(signedTx);

      console.log(result);
    };

    await transferBNB();
  });
});
