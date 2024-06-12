// src/appwriteConfig.js
import { Client, Account } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66605760000452c7c002');

const account = new Account(client);

export { client, account };
