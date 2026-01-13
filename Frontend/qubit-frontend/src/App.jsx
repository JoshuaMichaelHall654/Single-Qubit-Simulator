import { useState, useRef } from "react";
import "./App.css";
import { Button, Container, Form, Row } from "react-bootstrap";
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

// Instantiate the module using our import. Must be done outside of the actual function to
// use await
const backend = await backendModule();

function App() {
  const [num, setNum] = useState(0);
  const [email, setEmail] = useState({});
  // Run .testJS and you will see that it does work!
  console.log(backend.testJS());
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
              <Form.Label>This is the label for the form</Form.Label>
              <Form.Control
                type="email"
                placeholder="This is the underlying, slightly transparent text in the background of the form"
                //Form control is the text field. So, it contains what the user writes! You can set
                //a reference to the object (that contains the text) using ref or set it reactively using onChange.
                //See an above comment on reference vs state text above.
                onChange={(eventObject) => {
                  // Get the text located in the target event object only if it has a value. Otherwise,
                  // its set to an empty string
                  setEmail(eventObject.target?.value);
                }}
              />
              <Form.Text>This is the actual text under the form</Form.Text>
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
