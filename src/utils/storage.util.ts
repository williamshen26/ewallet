import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import uuid from 'uuid/index.js'
import {Wallet, EosWallet} from '../models/wallet-model';
import {Contact} from '../models/contact-model';
import {Token, EosToken} from '../models/token-model';
import {EosContract} from "../models/eos-contract-model";

@Injectable()
export class StorageUtil {

  constructor (private storage: Storage, private secureStorage: SecureStorage) {

  }

  public resetEveryThing(): void {
    this.storage.get('wallets').then((wallets: Wallet[]) => {
      wallets = [];
      this.storage.set('wallets', wallets);
    });

    this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
      wallets = [];
      this.storage.set('eosWallets', wallets);
    });

    this.storage.get('tokens').then((tokens: Token[]) => {
      tokens = [];
      this.storage.set('tokens', tokens);
    });

    this.storage.get('contacts').then((contacts: Contact[]) => {
      contacts = [];
      this.storage.set('contacts', contacts);
    });

    this.secureStorage.create('key_store')
      .then((keyStorage) => {
        keyStorage.clear();
      })
  }

  public getWallets(): Promise<Wallet[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('wallets').then((wallets: Wallet[]) => {
        if (!wallets) {
          wallets = [];
          this.storage.set('wallets', wallets);
        }
        resolve(wallets);
      });
    });
  }

  public getEosWallets(): Promise<EosWallet[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        if (!wallets) {
          wallets = [];
          this.storage.set('eosWallets', wallets);
        }
        resolve(wallets);
      });
    });
  }

  public getTokens(): Promise<Token[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('tokens').then((tokens: Token[]) => {
        if (!tokens) {
          tokens = [];
          this.storage.set('tokens', tokens);
        }
        resolve(tokens);
      });
    });
  }

  public getContacts(): Promise<Contact[]> {
    return new Promise((resolve, reject) => {
      this.storage.get('contacts').then((contacts: Contact[]) => {
        if (!contacts) {
          contacts = [];
          this.storage.set('contacts', contacts);
        }
        resolve(contacts);
      });
    });
  }

  public addWallet(wallet: Wallet): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.id = uuid();

      let privateKey = wallet.privateKey;
      wallet.privateKey = null;

      this.storage.get('wallets').then((wallets: Wallet[]) => {
        wallets.push(wallet);
        this.storage.set('wallets', wallets);
        resolve();
      });

      this.secureStorage.create('key_storage').then((keyStorage) => {
        keyStorage.set(wallet.id + '_' + wallet.address, privateKey);
      });
    });
  }

  public getWallet(walletId: string): Promise<Wallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('wallets').then((wallets: Wallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            this.secureStorage.create('key_storage').then((keyStorage) => {
              keyStorage.get(wallet.id + '_' + wallet.address).then((key) => {
                wallet.privateKey = key;
              });
            });

            resolve(wallet);
            break;
          }
        }
        reject();
      });
    });
  }

  public removeWallet(walletId: string): Promise<Wallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('wallets').then((wallets: Wallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            let index = wallets.indexOf(wallet);
            wallets.splice(index, 1);

            this.storage.set('wallets', wallets);

            this.secureStorage.create('key_storage')
              .then((keyStorage) => {
                keyStorage.remove(wallet.id + '_' + wallet.address);
                resolve(wallet);
              });

            break;
          }
        }
      });
    });
  }


  public addEosWallet(wallet: EosWallet): Promise<any> {
    return new Promise((resolve, reject) => {
      wallet.id = uuid();

      let privateKey = wallet.privateKey;
      wallet.privateKey = null;

      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        wallets.push(wallet);
        this.storage.set('eosWallets', wallets);
        resolve();
      });

      this.secureStorage.create('key_storage').then((keyStorage) => {
        console.log('add wallet', wallet.id + '_' + wallet.address);
        keyStorage.set(wallet.id + '_' + wallet.address, privateKey);
      });

    });
  }

  public getEosWallet(walletId: string): Promise<EosWallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {

            this.secureStorage.create('key_storage').then((keyStorage) => {
              keyStorage.get(wallet.id + '_' + wallet.address).then((key) => {
                wallet.privateKey = key;
              });
              for (let contract of wallet.contracts) {
                keyStorage.get(contract.id + '_' + contract.activeAddress).then((key) => {
                  contract.activeKey = key;
                });
                keyStorage.get(contract.id + '_' + contract.ownerAddress).then((key) => {
                  contract.ownerKey = key;
                });
              }
            });

            setTimeout(()=>{    //<<<---    using ()=> syntax
              resolve(wallet);
            }, 1000);

            break;
          }
        }

        // reject();
      });
    });
  }

  public removeEosWallet(walletId: string): Promise<EosWallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            let index = wallets.indexOf(wallet);
            wallets.splice(index, 1);

            this.storage.set('eosWallets', wallets);

            this.secureStorage.create('key_storage')
              .then((keyStorage) => {
                keyStorage.remove(wallet.id + '_' + wallet.address);
                resolve(wallet);
              });

            break;
          }
        }
      });
    });
  }



  public addContact(contact: Contact): Promise<any> {
    return new Promise((resolve, reject) => {

      this.storage.get('contacts').then((contacts: Contact[]) => {
        contact.id = uuid();
        contacts.push(contact);
        this.storage.set('contacts', contacts);
        resolve();
      });

    });
  }

  public removeContact(contactId: string): Promise<Contact[]> {
    return new Promise((resolve, reject) => {

      this.storage.get('contacts').then((contacts: Contact[]) => {
        for (let contact of contacts) {
          if (contact.id === contactId) {
            let index = contacts.indexOf(contact);
            contacts.splice(index, 1);
            break;
          }
        }

        this.storage.set('contacts', contacts);

        resolve(contacts);
      });

    });
  }

  public addTokenToWallet(token: Token, walletId: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      let tokenInstant: Token = Object.assign({}, token);

      tokenInstant.id = uuid();

      this.storage.get('wallets').then((wallets: Wallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            wallet.tokens.push(tokenInstant);
          }
        }
        this.storage.set('wallets', wallets);

        let tokenInstant2: Token = Object.assign({}, token);
        tokenInstant2.id = uuid();

        this.storage.get('tokens').then((tokens: Token[]) => {
          let tokenExist: boolean = false;
          for (let token of tokens) {
            if (token.address === tokenInstant2.address) {
              tokenExist = true;
              break;
            }
          }

          if (!tokenExist) {
            tokens.push(tokenInstant2);
            this.storage.set('tokens', tokens);
          }

          resolve(tokenInstant);
        });

      });

    });
  }

  public removeTokenFromWallet(tokenId: string, walletId: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.storage.get('wallets').then((wallets: Wallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            for (let token of wallet.tokens) {
              if (token.id === tokenId) {
                let index = wallet.tokens.indexOf(token);
                wallet.tokens.splice(index, 1);

                this.storage.set('wallets', wallets);

                resolve(token);

                break;
              }
            }

            break;
          }
        }
      });
    });
  }

  public addEosTokenToWallet(token: EosToken, walletId: string): Promise<EosToken> {
    return new Promise((resolve, reject) => {
      let tokenInstant: EosToken = Object.assign({}, token);

      tokenInstant.id = uuid();

      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            wallet.tokens.push(tokenInstant);
          }
        }
        this.storage.set('eosWallets', wallets);

        resolve(tokenInstant);

      });

    });
  }

  public removeEosTokenFromWallet(tokenId: string, walletId: string): Promise<EosToken> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            for (let token of wallet.tokens) {
              if (token.id === tokenId) {
                let index = wallet.tokens.indexOf(token);
                wallet.tokens.splice(index, 1);

                this.storage.set('eosWallets', wallets);

                resolve(token);

                break;
              }
            }

            break;
          }
        }
      });
    });
  }

  public addEosContractToWallet(contract: EosContract, walletId: string): Promise<EosContract> {
    return new Promise((resolve, reject) => {
      let ownerKey = contract.ownerKey;
      contract.ownerKey = null;
      let activeKey = contract.activeKey;
      contract.activeKey = null;

      let contractInstant: EosContract = Object.assign({}, contract);

      contractInstant.id = uuid();

      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            wallet.contracts.push(contractInstant);
          }
        }
        this.storage.set('eosWallets', wallets);

        resolve(contractInstant);

      });

      this.secureStorage.create('key_storage')
        .then((keyStorage) => {
          keyStorage.set(contractInstant.id + '_' + contractInstant.ownerAddress, ownerKey);
          keyStorage.set(contractInstant.id + '_' + contractInstant.activeAddress, activeKey);
        });

    });
  }

  public removeEosContractFromWallet(contractId: string, walletId: string): Promise<EosContract> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            for (let contract of wallet.contracts) {
              if (contract.id === contractId) {
                let index = wallet.contracts.indexOf(contract);
                wallet.contracts.splice(index, 1);

                this.storage.set('eosWallets', wallets);

                this.secureStorage.create('key_storage')
                  .then((keyStorage) => {
                    keyStorage.remove(contract.id + '_' + contract.ownerAddress);
                    keyStorage.remove(contract.id + '_' + contract.activeAddress);
                    resolve(contract);
                  });

                break;
              }
            }

            break;
          }
        }
      });
    });
  }

  public updateContractTemplates(templates){

    this.storage.set('templates', templates);

  }

  public getContractTemplateById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('templates').then((templates: any) => {
        if (!templates) {
          reject();
        }
        for (let template of templates.templates) {
          if (template.id == id) {
            resolve(template);
          }
        }
        reject();
      })
    });
  }

  public getContractTemplates(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('templates').then((templates: any) => {
        if (!templates) {
          resolve({templates: []});
        }
        resolve(templates);
      })
    });
  }
}
