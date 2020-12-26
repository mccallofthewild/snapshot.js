global['fetch'] = require('cross-fetch');
const { JsonRpcProvider } = require('@ethersproject/providers');
const snapshot = require('../');
const networks = require('../src/networks.json');

/* 
  ## Usage
  `npm run test` // Tests default (erc20-balance-of)
  `npm run test --strategy=erc20-received`
  `npm run test --strategy=eth-balance`
*/

const strategyNameArgs = Object.keys(snapshot.strategies).map(
  (name) => `--strategy=${name}`
);
const testStrategy =
  process.argv
    .find((arg) => strategyNameArgs.includes(arg))
    ?.split('--strategy=')
    .join('') || 'erc20-balance-of';

const example = require(`../src/strategies/${testStrategy}/examples.json`)[0];

(async () => {
  console.log(example.name);
  console.time('getScores');
  try {
    const scores = await snapshot.utils.getScores(
      'yam',
      [example.strategy],
      example.network,
      new JsonRpcProvider(networks[example.network].rpc[0]),
      example.addresses,
      example.snapshot
    );
    console.log(scores);
  } catch (e) {
    console.log(`${example.name} failed`);
    console.error(e);
  }
  console.timeEnd('getScores');
})();
