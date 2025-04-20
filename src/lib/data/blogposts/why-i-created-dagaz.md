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

