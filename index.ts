import * as config from "./config.json";
import Token from "./Token";

const { tokens } = config;

(async function parseTokens() {
  tokens.forEach((coin) => {
    new Token(
      coin.name,
      coin.contractAddress,
      coin.decimals,
      coin.tokenType,
      coin.outputType
    );
  });
})();
