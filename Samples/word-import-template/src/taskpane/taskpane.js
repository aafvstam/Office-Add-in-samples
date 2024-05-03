/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

let template;

Office.onReady((info) => {
  $(document).ready(function () {
    if (info.host === Office.HostType.Word) {
      document.getElementById("app-body").style.display = "flex";
      $("#template-file").on("change", () => tryCatch(getFileContents));
    }
  });
});

// Gets the contents of the selected file.
async function getFileContents() {
  const myTemplate = document.getElementById("template-file");
  const reader = new FileReader();
  reader.onload = (event) => {
    // Remove the metadata before the Base64-encoded string.
    const startIndex = reader.result.toString().indexOf("base64,");
    template = reader.result.toString().substring(startIndex + 7);

    // Import the template into the document.
    importTemplate();

    // Show the Update section.
    $("#imported-section").show();
  };

  // Read the file as a data URL so we can parse the Base64-encoded string.
  reader.readAsDataURL(myTemplate.files[0]);
}

// Imports the template into this document.
async function importTemplate() {
  await Word.run(async (context) => {
    // Use the Base64-encoded string representation of the selected .docx file.
    context.document.insertFileFromBase64(template, "Replace", {
      importTheme: true,
      importStyles: true,
      importParagraphSpacing: true,
      importPageColor: true,
      importDifferentOddEvenPages: true
    });
    await context.sync();
  });
}

// Default helper for invoking an action and handling errors.
async function tryCatch(callback) {
  try {
    await callback();
  } catch (error) {
    console.log(error);
  }
}