import { Client, Databases, Account } from "appwrite";

export const PROJECT_ID = "66195a7163f56422a765";
export const DATABASE_ID = "66195aee881c9201cc57";
export const COLLECTION_ID_MESSAGE = "66195aff639073584d6e";

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);

export default client;
