/*
 * Copyright (c) Maarten van Stam. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 * 
 */

async function prepareDocument(event) {

    console.log("Running prepareDocument");

    // Implement your custom code here. The following code is a simple Word example.  
    try {

        // Call JSInvokable Function here ...
        await DotNet.invokeMethodAsync("BlazorAddIn", "PrepareDocument");

        console.log("Finished prepareDocument")

    } catch (error) {
        // Note: In a production add-in, notify the user through your add-in's UI.
        console.error(error);
    }

    // Calling event.completed is required. event.completed lets the platform know that processing has completed.
    event.completed();
}

Office.actions.associate("prepareDocument", prepareDocument);