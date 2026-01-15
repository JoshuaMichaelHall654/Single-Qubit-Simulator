import { useState, useRef, useEffect } from "react";
import "./App.css";
import { Button, Container, Form, Row, Col, Dropdown } from "react-bootstrap";
import { complex, multiply, abs, evaluate, parse } from "mathjs";
import { checkNormalizationHelper, validateInput } from "./compute";

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

// Have a function that returns jsx to the return
function renderInputError(err) {
  // If there is no error, return nothing
  if (!err) {
    return null;
  }
  switch (err.errorNumber) {
    case 1:
      // Return the jsx, which has regular text not in quotes (not a string), and javascript
      // functions wrapped in braces. Make sure to include {" "} to prevent react from collapsing the space
      // between the colon and the errors name.
      return (
        <>
          Illegal expression detected. Not all mathematics is supported by the
          program at this time. Please remove: <strong>{err.name}</strong>.
        </>
      );
    case 2:
      return (
        <>
          A disallowed symbol has been detected. Single Qubit Simualtator does
          not support variables. Please remove or rewrite:{" "}
          <strong>{err.name}</strong>.
        </>
      );
    case 3:
      return (
        <>
          Function <strong>{err.name}</strong> is not allowed.
        </>
      );
    case 4:
      return (
        <>
          Function <strong>{err.name}</strong> has too many or too few
          arguments.
        </>
      );
    case 5:
      return <> Unfinished Expression detected </>;
    default:
      return;
  }
}

function App() {
  // The "raw" text of the inputs. Since the users can type anything,
  // we have to make sure the values are safe before working with them.
  const [rawAlpha, setRawAlpha] = useState("");
  const [rawBeta, setRawBeta] = useState("");

  // True for add false for subtract
  const [addOrSubt, setAddOrSubt] = useState(true);

  // Make a constant for if its normalized or not
  const [normalized, setNormalized] = useState("");

  const handleChangeToSum = (event) => {
    // event.target.value returns a string. in this case "true" or "false".
    // Since we want addOrSubt to be booleans, we can just evaluate if the .value
    // is the string true. If it is, addOrSubt becomes true as intented.
    // If not (because its "false"), it becomes false.
    setAddOrSubt(event.target.value === "true");
  };

  // Validate input returns an error message when the input is invalid.
  // If its empty, the input is valid, and so nothing is displayed
  const validationErrorAlpha = validateInput(rawAlpha) ?? "";
  const validationErrorBeta = validateInput(rawBeta) ?? "";

  const delayMs = 300;
  // Debounce aka wait a certain amount of time before taking the user input and checking their normalization.
  useEffect(() => {
    // Reset normalized to empty everytime the user types.
    setNormalized("");
    const id = setTimeout(() => {
      // In here is what we want to happen after typing stops.
      // If both inputs are validated (aka have error number 0) AND both
      // inputs have values, call check normalization
      const inputValidated =
        validationErrorAlpha.errorNumber === 0 &&
        validationErrorBeta.errorNumber === 0;
      if (inputValidated && rawAlpha !== "" && rawBeta !== "") {
        // First, evaluate the raw values. We can do it now because
        // this code will hopefully run way less than rawAlpha and Beta
        // will change (which evaluating on every change to values
        // would be very expensive).
        console.time("yo whatup");
        let evalAlpha = evaluate(rawAlpha);
        let evalBeta = evaluate(rawBeta);

        // If the user is subtracting by beta, multiply beta by negative one
        if (addOrSubt === false) {
          evalBeta = evalBeta * -1;
        }
        const result = checkNormalizationHelper(evalAlpha, evalBeta);
        console.timeEnd("yo whatup");

        // Save prob zero, one and sqrNormalization
        probZero = result.alphaProb;
        probOne = result.betaProb;
        sqrNormalization = result.sqrNorm;

        // Finally, check if it equals 1 with epsillon comparison to avoid floating
        // point errors causing a false negative. Using 10^-9 as epsilon for now.
        if (abs(sqrNormalization - 1) < 0.00000000001) {
          setNormalized("normalized");
        }
        // Otherwise its false
        else {
          setNormalized("not normalized");
        }
      }
    }, delayMs);
    return () => clearTimeout(id);
  }, [rawAlpha, rawBeta, addOrSubt]);

  // Run .testJS and you will see that it does work!
  //console.log(backend.testJS());
  return (
    <>
      {/**Place everything inside a container with a row for responsive design */}
      <Container>
        {/*TODO add different sizes for different screens, somewhere */}
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
        </Row>
        {/**The overall form component*/}
        <Form>
          {/*Rows should go inside forms. In react bootstrap, rows have their own spacing
           system different from column gap of flex. TODO figure this out tommorow*/}
          <Row className="g-5 justify-content-center">
            {/*Alpha text input*/}
            <Col xs="auto">
              {/**The individual component grouping of each form */}
              <Form.Group controlId="I have no idea what goes here">
                <Form.Label>Input the amplitude for |0⟩ here</Form.Label>
                <Form.Control
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
                <Form.Text>{renderInputError(validationErrorAlpha)}</Form.Text>
              </Form.Group>
            </Col>
            {/*+ or - selector*/}
            <Col xs="auto">
              {/*TODO, confirm this role has proper accessibility. */}
              <Form.Group controlId="formGridState">
                <Form.Label>Choose plus or minus</Form.Label>
                <Form.Select value={addOrSubt} onChange={handleChangeToSum}>
                  <option value={true}>+</option>
                  <option value={false}>-</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/*Beta text input*/}
            <Col xs="auto">
              <Form.Group controlId="formGridStae">
                <Form.Label>Input the amplitude for state |1⟩ here</Form.Label>
                <Form.Control
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
                <Form.Text>{renderInputError(validationErrorBeta)}</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Row>
          {/*If normalized not calculated (empty), display nothing. Otherwise, display
        whether the state is normalized or not. */}
          <>
            {normalized === "" ? null : <Col> Your state is {normalized}.</Col>}
          </>
          {/*If its not normalized (and only then), display a normalize for me button */}
          {normalized === "not normalized" ? (
            <Col>
              <Button
                onClick={() => {
                  console.log("test");
                }}
              >
                Normalize for me.
              </Button>
            </Col>
          ) : null}
        </Row>
      </Container>
    </>
  );
}

export default App;
