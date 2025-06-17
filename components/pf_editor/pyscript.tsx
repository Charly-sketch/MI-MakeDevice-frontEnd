"use client";

import { Button } from "@mui/material";
import React from "react";

import { useState } from "react";
import { PythonProvider, usePython } from "react-py";

export default function Pyscript() {
  const packages = {
    micropip: [
      "https://files.pythonhosted.org/packages/a5/6a/90754fe3309df2b6902e1ddbc49b75ae34f0d1828363ff3013845e3d34bb/gerbonara-1.2.0-py3-none-any.whl",
    ],
  };

  return (
    <>
      <PythonProvider packages={packages}>
        <Codeblock></Codeblock>
      </PythonProvider>
    </>
  );
}

function Codeblock() {
  const [input, setInput] = useState("");

  // Use the usePython hook to run code and access both stdout and stderr
  const {
    runPython,
    stdout,
    stderr,
    isLoading,
    isRunning,
    readFile,
    writeFile,
  } = usePython();

  function write() {
    const data = "hello world!";
    writeFile("./writtenfile.txt", data);
    console.log("written file...");
  }
  return (
    <>
      <>
        {isLoading ? <p>Loading...</p> : <p>Ready!</p>}
        <button
          onClick={() => {
            write();
          }}
        >
          WRITE
        </button>
      </>
    </>
  );
}
