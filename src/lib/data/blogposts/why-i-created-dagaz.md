---
published: true
featured: false
slug: motivation-behind-this-starter
title: The motivation behind this starter
description: 
created_at: '2023/8/24 11:29'
modified_at: '2023/9/10 11:00'
canonical_url: https://gebo-svelte-starter-demo.miozu.com/blog/motivation-behind-this-starter
domain: https://gebo-svelte-starter-demo.miozu.com
tabs:
  - coding
  - personal
tags:
  - hackathon
  - svelte
  - blockchain
  - cadence
  - javascript
  - web3
keywords:
  - Flow Blockchain Hackathon
  - smart contract development
  - Cadence programming language
  - fcl with svelte fullstack
  - transfer flow token flc javascript
  - flow client library project
  - blockchain app development
  - Svelte framework
  - sveltekit framework
  - serverless application
  - decentralized app dApp development
  - Flow client API usage
  - Firebase data storage integration
  - firebase svilte kit integration implementation
  - sveltekit cadence blockchain application development
  - Flow blockchain ecosystem
  - cryptocurrency hackathon
  - blockchain coding experience
  - programming for blockchain
  - blockchain technology insights
---

## Intro

My second hackathon was on the Flow chain. You might ask why I specifically chose Flow and not any other hackathon? The answer is quite simple. I was part of the community from the very beginning; during the ICO, when I first heard about the project and invested in Flow at 60 cents per coin. It was a good deal, especially when Flow's cost rose up to $40 per coin. At that time, all the coins were locked, making it impossible for ICO investors to sell any. I was only able to sell them at $17, which, in my opinion, was great. Since then, I've actively followed the community. I wanted to participate in hackathon season 1 but was busy with several other projects. So, when I heard about the upcoming hackathon season 2, I was very excited to participate in it with my charity idea that I had for a long time in my mind.

Before diving any deeper, you can try project yourself by visiting [https://prayforua.com](https://prayforua.com) or you might also want to see the use case on YouTube:

<div class="flex iframe">
  <iframe class="w-full h-fit" src="https://www.youtube.com/embed/Zk6X8abE_BU?si=oTbHVwUwCbvBVlay&amp;controls=0" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

<!-- NOTE dev.to embeding (doesn't work with mdsvex)*-->
<!-- {% embed https://www.youtube.com/embed/Zk6X8abE_BU?si=oTbHVwUwCbvBVlay&amp;controls=0 %} -->

## Flow: Cadence, FCL Official Guide

Since it was my first time working with the Flow ecosystem, I decided to use the official guide to learn Cadence and [FCL - Flow Client Library](https://developers.flow.com/tooling/fcl-js/api), which we will talk about later.

The official guide helped me understand Cadence better, guiding me through the most common use cases. Although very useful, I found it a bit verbose, with many articles written so that readers could jump in at any point. This led to repetition and made it seem clunky. Other than that, it took me around 6-8 hours to finish, leading to a basic understanding of the language principles and architecture of blockchain projects using the Flow ecosystem. Both Cadence and FCL were developed by DapperLabs, providing a consistent developer experience. Their API also seemed mature to me, even tho It's a new language and API might change in the future, covering almost everything a developer might need, it might ever work for an enterprise-sized project.
My project was smaller, but it still required a lot of smart contracts, I'll describe that in Architecture section.

### Cadence Compared to Other Languages

For those who don't know, [Cadence](https://developers.flow.com/cadence/language) is a new programming language for smart contracts written by Dapper Labs.

I was very curious to try Cadence, having heard about this language a some time ago, with its resource-oriented nature akin to Rust. Compares it with the well-established Solidity that I've used.

#### Resource-Oriented Nature

One of the standout features of Cadence is its resource-oriented nature, drawing parallels with the programming language Rust. Rust gained prominence for its efficient resource allocation mechanism, centered around borrowing and lending. Similarly, Cadence employs a similar principle: resources can exist in only one location at a time. This fundamental concept guarantees resource safety, particularly for tokens and other critical resources within the smart contract ecosystem. This design choice not only enhances security but also contributes to the predictability and reliability of smart contracts.

#### Enhanced Security

Cadence's resource-oriented approach inherently addresses some of the security concerns that plagued Solidity-based contracts. By preventing resource duplication and enforcing strict ownership rules, Cadence minimizes the potential for vulnerabilities such as reentrancy attacks and unauthorized token transfers. This focus on security aligns with Dapper Labs vision of providing a robust platform for building decentralized applications without compromising on safety. On the other hand Solidity's design allowed for pitfalls such as reentrancy attacks, which posed a significant security threat.

## My Hackathon Project

**Let's briefly examine the app architecture and the main concept of my hackathon project.**

![project pitch](https://camo.githubusercontent.com/ee5dfcc51e41f4756d367910c69dc4d864d7f606e6d1a2504dec70d093d9da44/68747470733a2f2f646576666f6c696f2d70726f642e73332e61702d736f7574682d312e616d617a6f6e6177732e636f6d2f6861636b6174686f6e732f36333330363535303031393334323730393130333364326366633236323165362f70726f6a656374732f31333234326363343163656234323330386161306536616236666362316138342f39363133333065632d303435332d343132312d623131352d3932343236646164373764372e706e67)

### Tooling

For my own projects, Svelte is a no-brainer, so:

- **pnmp** for speed.
- **Svelte** as js framework.
- **SvelteKit** as an application framework.
  (For those unfamiliar with SvelteKit, you might think of it as similar to Next.js)
- **TailwindCSS/DaisyUI** - For quick prototyping.
  (TailwindCSS for styles and the Tailwind library of mixed styles DaisyUI for even more styles on top of tailwind shugar for basic components like buttons, ranges, etc.)

```json
//package.json
{
  ...,
  "devDependencies": {
    "@sveltejs/adapter-vercel": "^3.0.2",
    "@sveltejs/kit": "^1.22.1",
    "autoprefixer": "^10.4.14",
    "daisyui": "^3.1.11",
    "eslint": "^8.44.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-svelte": "^2.32.2",
    "postcss": "^8.4.25",
    "prettier": "^3.0.0",
    "prettier-plugin-svelte": "^2.10.1",
    "svelte": "^4.0.5",
    "tailwindcss": "^3.3.2",
    "vite": "^4.4.2"
  },
  "dependencies": {
    "@onflow/fcl": "^1.4.1",
    "firebase": "^10.0.0",
    "nanoid": "^4.0.2",
    "ramda": "^0.29.0"
  }
}
```

As you can see, there are 4 client libs i'm using:

- fcl - flow client api
- firebase - my user data storage solution + `onSnapshot` db real time updates
- nanoid - gen random id
- ramda - like lodash, but functional style library of utilities
  (Ramda helped take advantage of utility functions like pipe, combine, etc.)

Because svelte is a **compiler** at the first place, there is no real difference between devDependencies and dependencies, but I'm adding client libs as dependencies for the sake of concepts separation, so it's easier to read.

### Svelte store firebase simplified implementation

You might want to see [simple svelte store firebase api wrapper with localStorage sync](https://github.com/nicholasglazer/prayforua.com/blob/main/src/stores/dbStore.js)

```javascript
import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import {firebaseKeys} from '$lib/firebase/config';

const initialState = {};

function createDb(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  const {subscribe, set, update} = writable(initialValue);
  const ini = initializeApp(firebaseKeys);
  const db = getFirestore(ini);

  return {
    set,
    update,
    subscribe,
    getDbRef: () => db,
    getDoc: async (path, id) => {
      const docRef = doc(db, path, id);
      return await getDoc(docRef);
    },
    setDoc: async (path, id, payload) => {
      try {
        const docRef = doc(db, path, id);
        await setDoc(docRef, {...payload}, {merge: true});
        console.warn('Document added to Firestore:', document);
      } catch (error) {
        console.error('Error adding document to Firestore:', error);
      }
    },
    useLocalStorage: () => {
      subscribe((current) => {
        if (browser) {
          localStorage.setItem(key, JSON.stringify(current));
        }
      });
    }
  };
}

export const db = createDb('app-db');
```

I wrote this wrapper to simplify usage of firebase api across the app.

[Project store](https://github.com/nicholasglazer/prayforua.com/blob/main/src/stores/projectStore.js) migth look a bit complex, but the logic is similar to zustand.

## Svelte and cadence integration

One aspect I love the most is the ability to integrate smart contract transactions and scripts using FCL, very handy for creating a serverless app.
For example transfering tokens be like:

```javascript
...
export const transferFlow = async (amount, addr, cid) => {
  let transactionId = false;
  initTransactionState();

  try {
    transactionId = await fcl.mutate({
      cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868

        transaction(amount: UFix64, to: Address) {

           // The Vault resource that holds the tokens that are being transferred
           let sentVault: @FungibleToken.Vault

           prepare(signer: AuthAccount) {

               // Get a reference to the signer's stored vault
               let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

               // Withdraw tokens from the signer's stored vault
               self.sentVault <- vaultRef.withdraw(amount: amount)
           }

           execute {

               // Get a reference to the recipient's Receiver
               let receiverRef =  getAccount(to)
                   .getCapability(/public/flowTokenReceiver)
                   .borrow<&{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow receiver reference to the recipient's Vault")

               // Deposit the withdrawn tokens in the recipient's receiver
               receiverRef.deposit(from: <-self.sentVault)
           }
        }
      `,
      args: (arg, t) => [arg(amount, t.UFix64), arg(addr, t.Address)],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    });

    // store method
    txId.set(transactionId);

    // subscribe to svelte transactions
    fcl.tx(transactionId).subscribe((res) => {
      transactionStatus.set(res.status);
      if (res.status) {
        if (res.status === 4) {
          getAccountBalance(addr, cid);
          auth.addFlowTransaction({
            txId: transactionId,
            event: `${amount} Flow transferred to ${addr} at`,
            status: res.status,
            timestamp: new Date().getTime()
          });
          setTimeout(() => transactionInProgress.set(false), 2000);
        }
      }
    });
  } catch (e) {
    transactionStatus.set(99);
    console.warn(e);
  }
};
...

```

Here `fcl.mutate` method receiveing an object with key `cadence` and value will be valid cadence code, and this way you can write transactions and scripts easily from your js files.
See more examples of flc actions in [github](https://github.com/nicholasglazer/prayforua.com/blob/main/src/lib/flow/actions.js).

## Conclusion

Even tho I didn't won, the Flow ecosystem fullstack development was an interesting experience. It seems more concise and simplified to work with, when compared to the Ethereum ecosystem, which is not bad at all but I definitely like cadence more than solidity. However, to be fair, the last time I used the Solidity ecosystem was more than three years ago, so things might have changed, although I doubt it. 🥲

## Outro

I appreciate your engagement thus far. 🙏

**Whether you're a startup or an established enterprise, I'm here to help you build and enhance your digital products by offering my services.**

You can reach me by email at glazer.nicholas@gmail.com or find more contact information at https://nicholasglazer.com/man/ng
