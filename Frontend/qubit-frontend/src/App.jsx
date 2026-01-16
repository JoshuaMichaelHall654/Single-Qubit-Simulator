import { useState, useRef, useEffect } from "react";
import "./App.css";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  Card,
} from "react-bootstrap";
import { abs, evaluate } from "mathjs";
import { checkNormalizationHelper, validateInput } from "./compute";
import { StateInputCard } from "./features/state/components/StateInputCard";
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

function App() {
  // Make a constant for if its normalized or not
  const [normalized, setNormalized] = useState("");

  // Create a global sqrNormalization value (N^2)
  const [sqrNormalization, setSqrNormalization] = useState(-1.0);

  // Make global probability variables that hold the probability of the state
  // being in 0 and 1 after collapse from z basis measurement. Have them default
  // to negative 1 to signal something is wrong, as they can never be negative.
  const [probZero, setProbZero] = useState(-1.0);
  const [probOne, setProbOne] = useState(-1.0);

  // True for add false for subtract
  const [addOrSubt, setAddOrSubt] = useState(true);

  // Run .testJS and you will see that it does work!
  //console.log(backend.testJS());
  return (
    <>
      <Container fluid={true} className="p-0">
        <Row>
          {/*Col to create a left hand side */}
          <Col xs={7} className="me-auto">
            <Card className="me-auto">
              {/* Left hand side card with things like state input, normalization, etc*/}
              {/*Pass down the props correctly */}
              <StateInputCard
                addOrSubt={addOrSubt}
                setAddOrSubt={setAddOrSubt}
                normalized={normalized}
                setNormalized={setNormalized}
                setSqrNormalization={setSqrNormalization}
                setProbZero={setProbZero}
                setProbOne={setProbOne}
              />
            </Card>
          </Col>
          {/*Col to create a right hand side */}
          <Col xs={5}>
            <Card></Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
