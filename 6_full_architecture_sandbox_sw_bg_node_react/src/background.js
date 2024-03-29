/**
 * Background running stuff
 * - in case of poopup or web content were close thoes job we be continues processing
 * - the working process would be similar to android/ios smartphone background running concept
 **/

// TODO: find to way to get message from popup

console.log("Service-Worker");
console.log("Service-Worker", "chrome", chrome);
console.log("Service-Worker", "addEventListener", addEventListener);

function test_eval(event, sender, sendResponse) {
  console.log("[background_test_eval] event", event);
  console.log("[background_test_eval] onMessage addListener sender", sender);
  console.log("[background_test_eval] onMessage addListener sendResponse", sendResponse);
  if (event.background_test_eval === true) {
    console.log("[background_test_eval] message!");
  }

  // TODO: find solution for eval
  console.log("[background_test_eval] alert run!");
  eval('alert("[background_test_eval] Test Eval resolve by sandbox")');
  eval('(()=> {console.log("[background_test_eval] Evaled Code!!!")})()');
}

/**
 * Handle message from normal sandbox
 * but the log will show up on sandbox log where it from
 * meas this function is call back to where the message came from
 * found sender and sendResponse as undefined
 */
addEventListener("message", (event, sender, sendResponse) => {
  test_eval(event, sender, sendResponse);
});

/**
 * Handle message from normal js such as content_script
 */
chrome.runtime.onMessage.addListener((event, sender, sendResponse) => {
  console.log(sender.tab ? "from " + sender.tab.url : "from unknow");

  if (event.greeting === "hello") {
    console.log("[request.greeting] hello", event.greeting);
    sendResponse({ farewell: "See you sir!" });
  } else {
    console.log("[request.greeting] ", event.greeting);
    sendResponse({ farewell: "Go home sir!" });
  }

  if (event.background_test_eval === true) {
    console.log("[background_test_eval] message form popup!");
  }

  test_eval(event, sender, sendResponse);
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("[OnInstall]");
  chrome.contextMenus.create({
    id: "1",
    title: '[contextMenus] search google for "%s"',
    contexts: ["selection"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const baseURL = "https://www.google.co.th/search?q=";
    var newURL = baseURL + info.selectionText;
    //create the new URL in the user's browser
    chrome.tabs.create({ url: newURL });
  });

  const callBackCreateUrlBook = (newFolder) => {
    chrome.bookmarks.create(
      {
        title: "[Chrome Exteinsion] Google",
        url: "https://www.google.co.th/",
        parentId: newFolder.id,
      },
      (newBookmark) => {
        console.log("[bookmarks] added url: ", newBookmark);
      }
    );
  };

  const callbackCreateFolderBook = (newFolder) => {
    console.log("[bookmarks] added floder: ", newFolder);
    callBackCreateUrlBook(newFolder);
  };

  chrome.bookmarks.create(
    { title: "[Chrome Exteinsion] Bookmarks Floder" },
    callbackCreateFolderBook
  );
});
