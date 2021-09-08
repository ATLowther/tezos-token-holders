## Setup

In the root directory you will need to create a `config.json` file that is in the shape of

    {
        "tokens": [
            {
                "name": "kUSD",
                "contractAddress": "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
                "decimals": 18,
                "tokenType": "FA1_2",
                "outputType": "csv"
            }
        ]
    }

Currently all properties are required and "csv" is the only available `outputType`. The script will take an array of tokens, so you can include any number of tokens as objects within the array `tokens` of the `config.json` file.

Available `tokenType`s are provided through an enum in `Token.ts` as:

    enum TokenType {
        FA1_2 = "FA1_2",
        FA2 = "FA2",
    }

After you have created your `config.json` file you will want to install dependencies:

    npm install
Then transpile all ts files

    tsc --resolveJsonModule *.ts
You can then run the script, which will generate a .csv for the token(s) provided in the config at `${token.name}.csv` in the root path of the project.

    node index.js