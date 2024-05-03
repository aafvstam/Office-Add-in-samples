/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

import { AccountManager } from "./authConfig";
import { makeGraphRequest } from "./msgraph-helper";

const accountManager = new AccountManager();
const sideloadMsg = document.getElementById("sideload-msg");
const appBody = document.getElementById("app-body");
const getUserDataButton = document.getElementById("getUserData");
const getUserFilesButton = document.getElementById("getUserFiles");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    if (sideloadMsg) sideloadMsg.style.display = "none";
    if (appBody) appBody.style.display = "flex";
    if (getUserDataButton) {
      getUserDataButton.onclick = getUserData;
    }
    if (getUserFilesButton) {
      getUserFilesButton.onclick = getUserFiles;
    }

    // Initialize MSAL. MSAL need's a loginHint for when running in a browser.

    accountManager.initialize();
  }
});

async function writeFileNames(fileNameList: string[]) {
  const item = Office.context.mailbox.item;
  let fileNameBody: string = "";
  fileNameList.map((item) => fileNameBody += "<br/>" + item);

  Office.context.mailbox.item.body.setAsync(
    fileNameBody,
    {
      coercionType: "html",
    }
  );
}

/**
 * Gets the user data such as name and email and displays it
 * in the task pane.
 */
async function getUserData() {
  const userDataElement = document.getElementById("userData");
  const userAccount = await accountManager.ssoGetUserIdentity(["user.read"]);
  const idTokenClaims = userAccount.idTokenClaims as { name?: string; preferred_username?: string };

  console.log(userAccount);

  if (userDataElement) {
    userDataElement.style.visibility = "visible";
  }
  if (userName) {
    userName.innerText = idTokenClaims.name ?? "";
  }
  if (userEmail) {
    userEmail.innerText = idTokenClaims.preferred_username ?? "";
  }
}

/**
 * Gets the first 10 item names (files or folders) from the user's OneDrive.
 * Inserts the item names into the document.
 */
async function getUserFiles() {
  try {
    const names = await getFileNames(10);

    writeFileNames(names);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Gets item names (files or folders) from the user's OneDrive.
 */
async function getFileNames(count = 10) {
  // Specify minimum scopes for the token needed.
  const accessToken = await accountManager.ssoGetToken(["Files.Read"]);
  const response: { value: { name: string }[] } = await makeGraphRequest(
    accessToken,
    "/me/drive/root/children",
    `?$select=name&$top=${count}`
  );

  const names = response.value.map((item: { name: string }) => item.name);
  return names;
}