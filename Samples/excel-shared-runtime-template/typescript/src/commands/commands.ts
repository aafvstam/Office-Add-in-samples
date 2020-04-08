/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global global, Office, self, window */

Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */
function action(event: Office.AddinCommands.Event) {
  // Your code goes here

  // Be sure to indicate when the add-in command function is complete
  event.completed();
}

export function btnToggleTaskpane(event: Office.AddinCommands.Event) {
  if (g.isTaskPaneVisible) {
    Office.addin.hide();
    g.isTaskPaneVisible=false;
  } else {
    Office.addin.showAsTaskpane();
    g.isTaskPaneVisible=true;
  }
  event.completed();
}

export function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal() as any;

// the add-in command functions need to be available in global scope
g.action = action;
g.btntoggletaskpane = btnToggleTaskpane;
g.isTaskPaneVisible = false;