import { encodeAddress as eA } from 'algosdk';
import { algod } from './algod.js';

const roundStr = process.argv[2];

const round = Number(roundStr);

if (!roundStr || isNaN(round)) {
    die('Expected round number');
}

function die(msg) {
    console.error(msg);
    process.exit(1);
}

const { block, cert: { prop: { oprop }, vote } } = await algod.block(round).do();

const txCount = block.txns?.length ?? 0;

console.log(`Round ${block.rnd} Tx # ${txCount}`);

const proposer = eA(oprop);
console.log(`Proposer: ${proposer}`);

const voters = vote.map(({ snd }) => eA(snd));
console.log(`Voters: (${vote.length})`);
voters.forEach(v => console.log(v));

if (process.argv[3]) {
    const interest = process.argv[3];
    const voted = voters.includes(interest);
    console.log(`\n${interest} did ${voted?'':'NOT '}vote!`);
}
