import React from "react";
import { render } from "react-dom";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContent Are Loaded");

  document
    .getElementById("test_addEventListener")
    .addEventListener("click", () => {
      alert("Test_AddEventListener");
      eval('(()=> {console.log("[Test_AddEventListener] Evaled Code!!!")})()');
    });
});

function test_eval() {
  // alert has been disable by sandbox
  eval('alert("[test_eval] Test Eval resolve by sandbox")');
  eval('(()=> {console.log("[test_eval] Evaled Code!!!")})()');
}

function bg_test_eval() {
  console.log("[bg_test_eval]", chrome);
  console.log(
    "[bg_test_eval]",
    "after put sandbox for eval on html",
    "now we has no longer access chrome.runtime",
    "and maybe include more attributes."
  );
  console.log("[bg_test_eval]", "let use 'parent.postMessage()' instead");

  parent.postMessage({ background_test_eval: true }, (response) => {
    console.log("[content] sendMessage response", response);
    console.log("[content] sendMessage", response.farewell);
  });

  console.log(
    "[bg_test_eval]",
    "postMessage function string",
    parent.postMessage.toString()
  );
}

function background_red() {
  document.getElementsByTagName("body")[0].style.backgroundColor = "red";
}

function Popup() {
  return (
    <div>
      <h1>Hi Chrome!</h1>
      <p>Node Chrome Extension React!</p>
      <button onClick={test_eval}>Test Eval</button>
      <br />
      <br />
      <button onClick={bg_test_eval}>Background Test Eval</button>
      <br />
      <br />
      <button onClick={background_red}>background_red</button>
      <br />
      <br />
      <button id="test_addEventListener">Test AddEventListener</button>
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
