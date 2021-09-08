import axios from "axios";
import BigNumber from "bignumber.js";
import determineOutputFile from "./determineOutputFile";

const TZKT = "https://api.tzkt.io/v1/contracts";

interface Account {
  address: string;
  balance: BigNumber;
}

enum TokenType {
  FA1_2 = "FA1_2",
  FA2 = "FA2",
}

export default class Token {
  name: string;
  contractAddress: string;
  decimals: number;
  tokenType: string;
  outputType: string;

  tokenHolders: Array<Account>;

  constructor(
    name: string,
    contractAddress: string,
    decimals: number,
    tokenType: string,
    outputType: string
  ) {
    this.name = name;
    this.contractAddress = contractAddress;
    this.decimals = decimals;
    this.tokenType = tokenType;
    this.tokenHolders = [];
    try {
      this.outputType = determineOutputFile(outputType);
    } catch {
      throw new Error(`No output type defined for ${this.name}`);
    }

    this.export();
  }

  async getHolders() {
    if (this.tokenType !== TokenType.FA1_2 && this.tokenType !== TokenType.FA2)
      throw new Error(`Invalid tokenType for ${this.name}`);

    let ledger =
      this.tokenType === TokenType.FA1_2
        ? await (
            await axios.get(
              `${TZKT}/${this.contractAddress}/bigmaps/balances/keys?limit=10000`
            )
          ).data
        : await (
            await axios.get(
              `${TZKT}/${this.contractAddress}/bigmaps/ledger/keys?limit=10000`
            )
          ).data;

    ledger.forEach((account) => {
      let address = account.key;
      let balance =
        this.tokenType === TokenType.FA1_2
          ? account.value.balance
          : account.value;
      balance = new BigNumber(balance).div(Math.pow(10, this.decimals));
      this.tokenHolders.push({ address, balance });
    });
  }

  async export() {
    await this.getHolders();
    let that = this;
    const { default: output } = await import("./" + that.outputType);
    output({ data: this.tokenHolders, fileName: this.name });
  }
}
