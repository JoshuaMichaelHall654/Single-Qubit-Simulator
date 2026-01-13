# Design choices:

## 1. Backend and frontend both run on the browser using a webassembly approach. I have two big reasons for this choice:

1. I wanted the THING (better name to describe the project here) to run without any setup time for the user on the web, and webassembly allows that.
2. But why not use a server backend then? Well, I didn't use a server backend because:
   - I was afraid of the cost of running the server.
   - Learning how to integrate the backend into a server have taken me more time than I was willing to spend on this early implementation of the project.

In the future, I may switch over to using a server over webassembly, mostly for speed reasons, but for now, webassembly will have to do.

## 2. I used emscripten (https://emscripten.org/index.html) to create the webassembly. I did this mostly because emscripten was the first thing I could find that mentioned
integrating C++ and Javascript through webassembly. Additionally, it was rather easy to use thanks to robust documentation.

# How to compile.

## The terminal command used to compile the C++ code to the .js and .wasm files was:

```bash
emcc "..\projects\Qubit project\Backend\backend.cpp" -lembind -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=bigBreakModule -o "..\projects\Qubit project\Frontend\qubit-frontend\src\compiledBackend\backend.out.js"
```
If you would like to do this compilation yourself, you will need to install emscripten as the documentation describes here: https://emscripten.org/docs/getting_started/downloads.html. The compilation was done on a windows device, hence the \ instead of /.

## You can compile the react code using:
