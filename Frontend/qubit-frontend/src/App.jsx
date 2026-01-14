import { useState, useRef } from "react";
import "./App.css";
import { Button, Container, Form, Row } from "react-bootstrap";
import { complex, multiply, abs, evaluate, parse } from "mathjs";
import { checkNormalization, validateInput } from "./compute";

// Import the module from the .js file. The .js file then calls the compiled .wasm file
// for the actual calculations.
import backendModule from "./compiledBackend/backend.out";

/* On reference (uncontrolled) vs state (controlled) text:
 * State variables are common for user input text in react. While it is true that state variables for user text
 * makes each keystroke a rerender, this is a very inexpensive rerender. Remember that React rerenders
 * the relevant component that owns the state and all of its children, and then reconcilles to make
 * the minimal number of actual DOM updates possible. In other words, you arent
 * reloading the whole page from scratch everytime the user types one letter. State variables have additional benefits
 * for user text, such as conditional UI (check box on or off depending on if there is text yet), instant validation,
 * and other reactive UI elements that you may (or may not) choose to implement.
 *
 * useRef is used when a value should NOT trigger re-renders. For example, storing the latest userId (or a latest
 * callback/value) so an async handler can read the most recent value without re-rendering.
 *
 * Also: using a ref to "avoid a child re-rendering" usually doesn't make sense. useRef does not block re-renders
 * caused by parent updates; it just means ref.current updates won't trigger renders. If you rely on a ref update
 * to drive UI, the UI won't update automatically (breaking reactivity).
 *
 * For expensive re-renders, prefer component splitting + memoization (React.memo/useMemo/useCallback) so you can
 * keep reactive state but reduce unnecessary re-renders.
 */
/* TLDR: Prefer controlled (state) inputs when the UI needs to react as the user types.
 * Use uncontrolled inputs/refs when you only need the value at specific times (submit/blur) or for imperative actions. */

// Create a backendModule instance from our backendModule module/package.
// Must be done outside of a function to use await
const backend = await backendModule();

// Create a global sqrNormalization value (N^2)
let sqrNormalization = -1.0;

// Make global probability variables that hold the probability of the state
// being in 0 and 1 after collapse from z basis measurement. Have them default
// to negative 1 to signal something is wrong, as they can never be negative.
let probZero = -1.0;
let probOne = -1.0;

function App() {
  // The "raw" text of the inputs. Since the users can type anything,
  // we have to make sure the values are safe before working with them.
  const [rawAlpha, setRawAlpha] = useState("");
  const [rawBeta, setRawBeta] = useState("");

  // Validate input returns an error message when the input is invalid.
  // If its empty, the input is valid, and so nothing is displayed
  // TODO, make this memoized, add bolding to the error if possible
  const THRESHOLD_MS = 0.01;

  const t0 = performance.now();
  const validationErrorAlpha = validateInput(rawAlpha) ?? "";
  const dt = performance.now() - t0;

  if (dt > THRESHOLD_MS) {
    console.log(`validateInput took ${dt.toFixed(3)} ms`);
  }
  const validationErrorBeta = validateInput(rawBeta) ?? "";

  // Should be false:
  const test = complex(0.6001, 0);
  const test1 = complex(0.7999, 0);
  /*console.log(
    checkNormalization(test, test1, sqrNormalization, probZero, probOne)
  );*/
  // Run .testJS and you will see that it does work!
  //console.log(backend.testJS());
  return (
    <>
      {/**Place everything inside a container with a row for responsive design */}
      <Container>
        <Row>
          <div>
            <p>Hello</p>
            <img
              alt="An image of someone taking a picture."
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png"
              //Note, it is best if style components are added to a style sheet. That is, if you want
              //to reuse them
              style={{ width: "350px", height: "auto" }}
            />
          </div>
          <Button
            //Remember that on click is a prop. So, if you dont pass it a function,
            //and instead just give it function, that function evaluates immediately
            //on the jsx side. So if you have onClick{console.log("test")}, you get test right
            //at the start, and then never again. Instead, you have to pass it a callback function,
            //with the () => as you see below.
            onClick={() => {
              console.log(num);
              setNum(1);
            }}
          >
            Test
          </Button>
          {/**The overall form component*/}
          <Form>
            {/**The component its contained within */}
            <Form.Group
              className="mb-3"
              controlId="this is for accessibility, i.e. screen readers"
            >
              <Form.Label>Input the amplitude for |0⟩ here"</Form.Label>
              <Form.Control
                type="email"
                placeholder="Put alpha here!"
                //Form control is the text field. So, it contains what the user writes! You can set
                //a reference to the object (that contains the text) using ref or set it reactively using onChange.
                //See an above comment on reference vs state text above.
                onChange={(eventObject) => {
                  // Get the text located in the target event object only if it has a value. Otherwise,
                  // its set to an empty string
                  setRawAlpha(eventObject.target?.value);
                }}
              />
              {/*Display the validation error if there is one.*/}
              <Form.Text>{validationErrorAlpha}</Form.Text>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="this is for accessibility, i.e. screen readers1"
            >
              <Form.Label>Input the amplitude for state |1⟩ here"</Form.Label>
              <Form.Control
                type="email"
                placeholder="Put beta here!"
                //Form control is the text field. So, it contains what the user writes! You can set
                //a reference to the object (that contains the text) using ref or set it reactively using onChange.
                //See an above comment on reference vs state text above.
                onChange={(eventObject) => {
                  // Get the text located in the target event object only if it has a value. Otherwise,
                  // its set to an empty string
                  setRawBeta(eventObject.target?.value);
                }}
              />
              <Form.Text>{validationErrorBeta}</Form.Text>
            </Form.Group>
            <Button
              onClick={() => {
                console.log(email);
              }}
            >
              Submit
            </Button>
          </Form>
        </Row>
      </Container>
    </>
  );
}

export default App;
