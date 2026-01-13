This is the "original" backend before being compiled by emscripten to js for web assembly usage. You can find all the actual backend logic here. 

Included are backend.cpp, which contains the qubit logic, and test emscripten.cpp, which contains a short test of how to use emscripten to take C++ and make it into js that can run on the web.