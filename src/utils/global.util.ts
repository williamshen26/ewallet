'use strict';

/*************************ETH**********************************/
export const network = 'https://api.myetherapi.com/rop';
// export const network = 'https://api.myetherapi.com/eth';

// Smart contract that collects payment
export const contractAddress = '0x3c2110ae4a729c8f19479219d7263db3856d0e5e';

// export const contractGenerateApi = 'http://localhost:8080/';
// export const contractGenerateApi = 'http://108.172.199.241:8080/';
export const contractGenerateApi = 'http://ec2-52-33-149-46.us-west-2.compute.amazonaws.com:8080/';


/*************************EOS**********************************/
// export const eosNetwork = 'https://api1.eosdublin.io';
// export const eosNetwork = 'http://peer1.eos9cat.com:8888';
export const eosNetwork = 'http://jungle.eos9cat.com:8888';
// export const eosNetwork = 'http://jungle.cryptolions.io:38888';
export const eosChainId = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca';

// Default configuration (additional options below)
export const eosConfig = {
  chainId: eosChainId, // 32 byte (64 char) hex string
  keyProvider: [], // WIF string or array of keys..
  httpEndpoint: eosNetwork,
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
};
