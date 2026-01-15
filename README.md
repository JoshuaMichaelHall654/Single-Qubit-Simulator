# Single Qubit Simulator (C++/React)
Web-based single-qubit simulator with a C++ backend compiled to WebAssembly and integrated into a React UI. Focuses on API design across the JS/Wasm boundary, performance-oriented numeric computation, and a clean interactive interface.

# What does it do?
This program allows the user to take a single qubit state quantum system (aka any two level quantum system) as input and apply several quantum operators, simulating the output state. 
These operators include quantum gate operators as well as the Pauli spin* and rotation matricies.

*Note that just because they are called "Pauli spin", that does not mean they can only be used on systems with spin. They can be used on any two level quantum system.
## Feature Status:
### Implemented:
- Reactive normalization check - user can not apply gates or measure without their state being normalized
### In Progress:
- "Normalize For Me" button - allow the user to let the simulator normalize for them. Don't want to auto normalize just in case the user made a typo
### Planned:
#### UI/UX and standard QM 
- "Reset to Starting State" button - if the user applied too many gates, they can start over from the beginning
- "Undo Last Transformation" button - undo only the last thing applied. Can only be done once for scope creep reasons
- Multiple state input methods - one is writing in dirac notation aka superposition form. The other is 2 by 1 matrix form aka single matrix form. Should have a selector as well examples/clear indicators so users know which is which.
- Simple Q&A - answers why only single qubits are allowed, how to find a single qubit form (maybe), what basis we are using, what the Z basis is, and other questions.
- Measurement - calculating probabilities that the state ends up in one state or another. Only in the Z basis to start, adding other bases really widens the scope.
- Collapse Simulation - simulate the system collapsing into one of the two states using some random number generator

#### Gates and Operators

- Hadamard Gate (H)
- Identity Gate (I) - for mathematical consistency
- Pauli Gates/Spin Matricies - σx, σy, σz
- Rotation Gates/Pauli Rotation Matricies - Ri(θ)
- Phase Gates - S (90 degrees rotation around Z) and T (45 degrees rotation around Z)

#### Visualization

- Bloch Sphere Representation
  - Simple coordinates in text (X,Y,Z)
  - Or if time: actual 3D rendering

# Why doesn't this include multi-qubit states and gates?
Time constraints

# Design choices:

## 1. Backend and frontend both run on the browser using a webassembly approach. I have two big reasons for this choice:

1. I wanted the THING (better name to describe the project here) to run without any setup time for the user on the web, and webassembly allows that.
2. But why not use a server backend then? Well, I didn't use a server backend because:
   - I was afraid of the cost of running the server.
   - Learning how to integrate the backend into a server would have taken me more time than I was willing to spend on this early implementation of the project.

In the future, I may switch over to using a server over webassembly, mostly for speed reasons, but for now, webassembly will have to do.

## 2. Emscripten (https://emscripten.org/index.html) to create the webassembly. 

I did this mostly because emscripten was the first thing I could find that mentioned integrating C++ and Javascript through webassembly. Additionally, it was rather easy to use thanks to robust documentation.
Could mention some other benefits from its use here.
# How to compile.

## The terminal command used to compile the C++ code to the .js and .wasm files was:

```bash
emcc "..\projects\Qubit project\Backend\backend.cpp" -lembind -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=bigBreakModule -o "..\projects\Qubit project\Frontend\qubit-frontend\src\compiledBackend\backend.out.js
```
If you would like to do this compilation yourself, you will need to install emscripten as the documentation describes here: https://emscripten.org/docs/getting_started/downloads.html. The compilation was done on a windows device, hence the \ instead of /.

## You can compile the react code using:

# What I learned.

## About emscripten

## About fullstack development choices

## About runtime issues

## Other stuff tba
