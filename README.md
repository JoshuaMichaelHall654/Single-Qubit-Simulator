# Single Qubit Simulator (C++/React)

Web-based single-qubit simulator with a C++ backend compiled to WebAssembly and integrated into a React UI. Focuses on API design across the JS/Wasm boundary, performance-oriented computation, and a clean interactive interface.

# What does it do?

This program allows the user to take a single qubit (i.e., any two-level quantum system) as input and apply several quantum operators, simulating the output state.
These operators include Hadamard gate and the Pauli matrices (spin and rotation).


## Feature Status:

### Implemented:

- Reactive normalization check - user can not apply gates or measure without their state being normalized

### In Progress:
#### Current Phase: In development
- Identity Gate (I) - for mathematical consistency
- Rotation Gates/Pauli Rotation Matrices - Ri(θ)

#### Current Phase: Being tested or refactored
- Hadamard Gate
- Pauli Gates/Spin Matrices - σx, σy, σz
- Phase Gates - S (90 degrees rotation around Z) and T (45 degrees rotation around Z)
- Measurement - calculating probabilities that the state ends up in one state or another. X, Y, and Z bases for sure, maybe other relevant ones as time goes on.
- "Undo Last Transformation" button - Undo the last transformation. May have some limits, but for now uses a stack to allow for many undo's.
- "Redo Last Transformation" button - Redo the transformation you undid. Should allow for erasing of failures that are not saved.

#### Final testing phase (essentially complete):
- "Normalize For Me" button - allow the user to let the simulator normalize for them. Don't want to auto normalize just in case the user made a typo
- "Reset to Starting State" button - if the user applied too many gates, they can start over from the beginning

### Planned:

#### UI/UX and standard QM
- Multiple state input methods - one is writing in dirac notation aka superposition form. The other is 2 by 1 matrix form aka single matrix form. Should have a selector as well examples/clear indicators so users know which is which.
- Simple Q&A - answers why only single qubits are allowed, how to find a single qubit form (maybe), what basis we are using, what the Z basis is, and other questions.
- Collapse Simulation - simulate the system collapsing into one of the two states using some random number generator

#### Gates and Operators

#### Visualization

- Bloch Sphere Representation
  - Simple coordinates in text (X,Y,Z)
  - Or if time: actual 3D rendering

# Why doesn't this include multi-qubit states and gates?

I wanted to constrain this projects scope in order to finish it in a timely manner. I may come back to it in the future and add multi-qubits though.

# Design choices:

## 1. Backend and frontend both run on the browser using a webassembly approach. I have two big reasons for this choice:

1. I wanted the Simulator to run without any setup time for the user on the web, and webassembly allows that.
2. But why not use a server backend then? Well, I didn't use a server backend because:
   - I was afraid of the cost of running the server.
   - Learning how to integrate the backend into a server would have taken me more time than I was willing to spend on this early implementation of the project.

In the future, I may switch over to using a server over webassembly once I have a better grasp on the tradeoffs, but for now, webassembly will have to do.

## 2. Emscripten (https://emscripten.org/index.html) to create the webassembly.

I used this mostly because emscripten was the first thing I could find that mentioned integrating C++ and Javascript through webassembly. Additionally, it was rather easy to use thanks to robust documentation.
So far, its worked well enough. The only time its changed my implementation choices was a slight change to the backend variables, going
from using std::complex directly to creating a complex-like object I can send back and forth, and converting between the two
depending on if I need to calculate or if I need to communicate with the frontend.

# How to compile.

## The terminal command used to compile the C++ code to the .js and .wasm files was:

```bash
emcc "..\projects\Qubit project\Backend\backend.cpp" -lembind -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=QubitSimModule -o "..\src\compiledBackend\backend.out.js"
```

If you would like to do this compilation yourself, you will need to install emscripten as the documentation describes here: https://emscripten.org/docs/getting_started/downloads.html. The compilation was done on a windows device, hence the \ instead of /.

# How to test.
```bash
npm run test
```
Since package.json contains ```"test": "vitest"```
