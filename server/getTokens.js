import { google } from "googleapis";
import readline from "readline";

const client_ID = "409445016980-hu62r4o1lhctnfgdkb5fpal5kqn90g1k.apps.googleusercontent.com";
const client_secret = "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";

const oauth2Client = new google.auth.OAuth2(
    client_ID,
    client_secret,
    "urn:ietf:wg:oauth:2.0:oob"
);

const scopes = [
    "https://www.googleapis.com/auth/calendar.events"
];

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope:scopes,
    prompt: "consent"
});

console.log("Authorize this app by visiting this url:");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the code from that page: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);

  console.log("\nRefresh Token:\n");
  console.log(tokens.refresh_token);

  rl.close();
});

//https://docs.cloud.google.com/storage/docs/oauth-scopes
//https://docs.cloud.google.com/docs/authentication/token-types