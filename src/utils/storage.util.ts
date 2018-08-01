import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import uuid from 'uuid/index.js'
import {Wallet, EosWallet} from '../models/wallet-model';
import {Contact} from '../models/contact-model';
import {Token} from '../models/token-model';

@Injectable()
export class StorageUtil {

  constructor (private storage: Storage) {

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

      this.storage.get('wallets').then((wallets: Wallet[]) => {
        wallet.id = uuid();
        wallets.push(wallet);
        this.storage.set('wallets', wallets);
        resolve();
      });

    });
  }

  public getWallet(walletId: string): Promise<Wallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('wallets').then((wallets: Wallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
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

            resolve(wallet);

            break;
          }
        }
      });
    });
  }


  public addEosWallet(wallet: EosWallet): Promise<any> {
    return new Promise((resolve, reject) => {

      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        wallet.id = uuid();
        wallets.push(wallet);
        this.storage.set('eosWallets', wallets);
        resolve();
      });

    });
  }

  public getEosWallet(walletId: string): Promise<EosWallet> {
    return new Promise((resolve, reject) => {
      this.storage.get('eosWallets').then((wallets: EosWallet[]) => {
        for (let wallet of wallets) {
          if (wallet.id === walletId) {
            resolve(wallet);

            break;
          }
        }
        reject();
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

            resolve(wallet);

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
