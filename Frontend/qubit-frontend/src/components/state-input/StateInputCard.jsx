// Imports of on device files
import "../../App.css";
import "katex/dist/katex.min.css";
import backendModule from "../../compiledBackend/backend.out";
import { InputErrorText } from "./InputErrorText";
import { validateAmplitudeInput } from "./validateAmplitudeInput";
import { checkNormalizationHelper } from "../checkNormalization";
import { normalizeForMe } from "./normalizeForMe";
import { DoublyLinkedList } from "./undoRedoStack";

// import of standard react values
import { useState, useEffect, useRef } from "react";

// library imports
import { InlineMath } from "react-katex";
import { Button, Container, Form, Row, Col, InputGroup } from "react-bootstrap";
import { abs, evaluate, equal, complex, multiply } from "mathjs";
import {
  ArrowCounterclockwise,
  Arrow90degLeft,
  Arrow90degRight,
} from "react-bootstrap-icons";

console.time("time to await backend");
const backend = await backendModule();
console.timeEnd("time to await backend");

export function StateInputCard({
  // Probably should be ...props and then call props. later, but idk
  addOrSubt,
  setAddOrSubt,
  normalizedStatus,
  setNormalizedStatus,
  setSqrNormalization,
  probZero,
  probOne,
  sqrNormalization,
  setProbZero,
  setProbOne,
}) {
  // The "raw" text of the inputs. Since the users can type anything,
  // we have to make sure the values are safe before working with them.
  const [rawAlpha, setRawAlpha] = useState("");
  const [rawBeta, setRawBeta] = useState("");

  // Create a value to hold the error of the normalization if there is one
  const [normalizationError, setNormalizationError] = useState("");

  // If zero error is true, that means both alpha and beta are zero, and
  // an error should be displayed
  const [zeroError, setZeroError] = useState(false);

  // Define the evaluated versions of alpha and beta. Changes to the normalized values
  // when normalize for me is ran.
  const evalAlpha = useRef(0.0);
  const evalBeta = useRef(0.0);

  // Validate input returns an error message when the input is invalid.
  // If its empty, the input is valid, and so nothing is displayed.
  // Validate amplitude input expects a string, not a math object.
  const validationErrorAlpha = validateAmplitudeInput(rawAlpha);
  const validationErrorBeta = validateAmplitudeInput(rawBeta);

  // Make a reference to the very first alpha and beta inputed for restart. Set at very first transformation,
  // and then never again.
  const firstAlpha = useRef("");
  const firstBeta = useRef("");

  // Make a variable to track if one transformation have occured.
  const [hasTransformed, setHasTransformed] = useState(false);

  // Make our stack for undo and redo. Technically not needed
  // until the first transform occurs, but that is fine.
  const undoAndRedoStack = new DoublyLinkedList();

  const delayMs = 300;
  // Debounce aka wait a certain amount of time before taking the user input and checking their normalization.
  useEffect(
    () => {
      // Reset normalizedStatus to idle everytime the user types
      setNormalizedStatus("idle");
      // Reset the zero error everytime the user types
      setZeroError(false);
      const id = setTimeout(() => {
        // In here is what we want to happen after typing stops.

        // If both inputs are validated (aka are both null) AND both
        // inputs have values, call check normalization
        const alphaValidated = validationErrorAlpha == null;
        const betaValidated = validationErrorBeta == null;
        const inputValidated = alphaValidated && betaValidated;
        if (inputValidated && rawAlpha !== "" && rawBeta !== "") {
          // First, evaluate the raw values. We can do it now because
          // this code will hopefully run way less than rawAlpha and Beta
          // will change (which evaluating on every change to values
          // would be very expensive).
          try {
            evalAlpha.current = evaluate(rawAlpha);
            evalBeta.current = evaluate(rawBeta);
          } catch (e) {
            setNormalizedStatus("error");
            setNormalizationError(e.toString());
            return;
          }
          // Complex will convert them to complex values whether they are real or complex.
          evalAlpha.current = complex(evalAlpha.current);
          evalBeta.current = complex(evalBeta.current);

          // If the user is subtracting by beta, multiply beta by negative one
          if (addOrSubt === false) {
            evalBeta.current = multiply(evalBeta.current, -1);
          }

          // If alpha and beta both evaluate to zero, use render input to throw an
          // error and return to end early
          if (equal(evalAlpha.current, 0) && equal(evalBeta.current, 0)) {
            setZeroError(true);
            return;
          }

          console.time("checkNorm");
          const result = checkNormalizationHelper(
            evalAlpha.current,
            evalBeta.current,
          );
          console.timeEnd("checkNorm");

          // Save prob zero, one and the sqrNormalization
          setProbZero(result.alphaProb);
          setProbOne(result.betaProb);
          setSqrNormalization(result.sqrNorm);

          // Finally, check if it equals 1 with epsillon comparison to avoid floating
          // point errors causing a false negative. Using 10^-11 as epsilon for now.
          if (abs(result.sqrNorm - 1) < 0.00000000001) {
            setNormalizedStatus("normalized");
          }
          // Otherwise its false
          else {
            setNormalizedStatus("not normalized");
          }
        }
      }, delayMs);
      return () => clearTimeout(id);
    },
    // TODO, pretty sure this is a useEffect anti pattern because while rawAlpha and beta are outside values,
    // they are not external to the program. useEffect is more for getting synced with apis.
    [rawAlpha, rawBeta, addOrSubt],
  );

  // A function that saves previous states upon a transform (normalization, gate, etc)
  function saveEarlierState() {
    // If hasTransformed is false, set it to true and set first alpha and beta
    // once.
    if (hasTransformed === false) {
      // Set it to the raw text, so that undo and restart can place the text
      // in directly
      firstAlpha.current = rawAlpha;
      firstBeta.current = rawBeta;
      setHasTransformed(true);
    }
    console.log("hi!");
    // Add our node using our current rawAlpha and rawBeta
    undoAndRedoStack.push(rawAlpha, rawBeta);
  }

  function restart() {
    // Make sure to use .current because firstAlpha and Beta are just references
    setRawAlpha(firstAlpha.current);
    setRawBeta(firstBeta.current);
    // Reset hasTransformed to false as the user has functionally "started over"
    setHasTransformed(false);
  }

  function undo() {
    // Call undo on the stack and save the result
    const result = undoAndRedoStack.undo();
    console.log(result);
    // Result stores the current node. This node contains
    // the alpha and the beta values that we can use to set undo with.
    setRawAlpha(result.alpha);
    setRawBeta(result.beta);
  }

  function redo() {
    // Call redo on the stack and save the result
    const result = undoAndRedoStack.redo();

    // Result stores the current node. This node contains
    // the alpha and the beta values that we can use to set undo with.
    setRawAlpha(result.alpha);
    setRawBeta(result.beta);
  }

  return (
    <>
      <Row className="">
        <Col>
          <div>
            <strong>Current capabilities (v0.1):</strong>
          </div>
          <div>
            Enter complex amplitudes, validate expressions, and normalize state
            (in beta).
          </div>
        </Col>
      </Row>
      <Row className="">
        <Col>
          <div>
            <strong>Coming up next!: </strong>
          </div>
          <div>Testing for undo and restart!</div>
        </Col>
      </Row>
      {/**Place everything inside a container with a row for responsive design */}
      <Container>
        {/**The overall form component*/}
        <Form>
          {/*Rows should go inside forms. In react bootstrap, rows have their own spacing
           system different from column gap of flex.
           */}
          <Row className="g-0">
            {/*Alpha text input*/}
            {/*xs="auto" as prop for Col causes spacing issues with form.text. Any string error 
            in form.text longer than the label forces the entire form to expand in width to fit 
            the next. This was because xs auto, which was used as a hack solution to make the 
            plus or minus selector smaller. xs="auto" made the selector fit the length of any
            text (including form.label or form.text), an since its label (Choose plus or minus) 
            is shorter than the other two forms labels (insert amplitude blah blah bal), it 
            "worked". This is because xs="auto" sets (EXPLAIN HERE). Find an actual way to control the selector
            and buttons length that isnt hack  */}
            <Col xs={12} xxl={5}>
              {/**The individual component grouping of each form */}
              <Form.Group controlId="ampZero">
                <Form.Label>
                  Input the amplitude for state{" "}
                  <InlineMath math={"|0\\rangle"} /> here
                </Form.Label>
                {/**Include input group to have |0⟩ be right next to the textbox */}
                <InputGroup>
                  <Form.Control
                    placeholder="Put alpha here!"
                    //Form control is the text field. So, it contains what the user writes! You can set
                    //a reference to the object (that contains the text) using ref or set it reactively using onChange.
                    //See an above comment on reference vs state text above.
                    value={rawAlpha}
                    onChange={(eventObject) => {
                      // Get the text located in the target event object only if it has a value. Otherwise,
                      // its set to an empty string
                      setRawAlpha(eventObject.target?.value);
                    }}
                  />
                  <InputGroup.Text>
                    <InlineMath math={"|0\\rangle"} />
                  </InputGroup.Text>
                </InputGroup>
                {/*Display the validation error if there is one.*/}
                <Form.Text>
                  <InputErrorText err={validationErrorAlpha} />
                </Form.Text>
              </Form.Group>
            </Col>

            {/*+ or - selector. lg 2 makes it so its takes up less space than alpha
            and beta controls from lg onward. D-flex makes this Col a flex container 
            (which it is not by default) so we can horizontally center the Form.Group
            below. And justify content center centers the select box to the center of the 
            screen (to emphasize that it is different from the other two selections).*/}
            <Col xs={12} xxl={2} className="d-flex justify-content-center">
              {/*TODO, confirm this role has proper accessibility. */}
              <Form.Group controlId="plusOrMinus">
                <Form.Label>Choose + or -</Form.Label>
                <Form.Select
                  // Classname w-auto makes the select width fit its content. Select center
                  // was the attempt to align the select with the options in the select.
                  // Doesnt really work since dropdowns are browser based unless
                  // you use bootstrap Dropdown (not doing it).
                  className="w-auto select-center"
                  style={{ minWidth: "6rem" }}
                  value={addOrSubt ? "true" : "false"}
                  onChange={(e) => setAddOrSubt(e.target.value === "true")}
                >
                  <option value="true">+</option>
                  <option value="false">-</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/*Beta text input. xs={12} means that the col takes up all 12 of the grid columns
            at the xs break point. lg = 4 means it takes up 12/3 = 4 of the screen columns at the 
            lg breakpoint. Not setting between xs and lg means that xs, sm, and md will use 12,
            and not setting beyond lg means that lg, xl, and xxl will use 4.  */}
            <Col xs={12} xxl={5}>
              <Form.Group controlId="ampOne">
                <Form.Label>
                  Input the amplitude for state{" "}
                  <InlineMath math={"|1\\rangle"} /> here
                </Form.Label>

                <InputGroup>
                  <Form.Control
                    placeholder="Put beta here!"
                    //Form control is the text field. So, it contains what the user writes! You can set
                    //a reference to the object (that contains the text) using ref or set it reactively using onChange.
                    //See an above comment on reference vs state text above.
                    value={rawBeta}
                    onChange={(eventObject) => {
                      // Get the text located in the target event object only if it has a value. Otherwise,
                      // its set to an empty string
                      setRawBeta(eventObject.target?.value);
                    }}
                  />
                  <InputGroup.Text>
                    <InlineMath math={"|1\\rangle"} />
                  </InputGroup.Text>
                </InputGroup>

                <Form.Text>
                  <InputErrorText err={validationErrorBeta} />
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {/**TODO, undo and redo */}
        <Row className="pt-3 g-0">
          <Col>
            {/***/}
            <Button
              variant="outline-primary"
              disabled={false}
              onClick={() => undo()}
            >
              {/** Place the undo icon inside of it and give it a label of undo */}
              <Arrow90degLeft /> Undo Transform
            </Button>
          </Col>
          <Col>
            {/***/}
            <Button
              variant="outline-primary"
              disabled={false}
              onClick={() => redo()}
            >
              {/** Place the redo icon inside of it and give it a label of undo */}
              <Arrow90degRight /> Redo Transform
            </Button>
          </Col>
          <Col>
            {/**If hasTransformed is false, disable restart */}
            <Button
              variant="outline-primary"
              disabled={!hasTransformed}
              onClick={() => restart()}
            >
              {/** Place the undo icon inside of it and give it a label of undo */}
              <ArrowCounterclockwise /> Restart
            </Button>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col>
            <div>Try these out:</div>
            <div>alpha = 1, beta = 1.</div>
            <div>alpha = 1 + 2i, beta = 2 + 3i.</div>
            <div>alpha = sin(2i^3), beta = 3^i * 4</div>
          </Col>
        </Row>
        {/*Give it some space from the above row with pt */}
        <Row className="pt-3">
          <Col xs={12}>
            {zeroError ? (
              <>Both alpha and beta cannot be zero at the same time.</>
            ) : (
              // placeholder reserves height. Replace with null and move col back inside
              // js if you dont like how it looks
              <span>&nbsp;</span>
            )}
          </Col>

          <Col xs={12}>
            {/*Check if the normalization text should appear. */}
            {normalizedStatus !== "idle" ? (
              // If it should, check if there is an error.
              normalizedStatus === "error" ? (
                <>
                  Unfortunately, an error occured while normalizing. Please
                  ensure your input is valid and try again. The error
                  encountered is: {normalizationError}.
                </>
              ) : (
                // If there isnt one, tell the user if their values are normalized or not
                <>Your state is {normalizedStatus}.</>
              )
            ) : (
              // If the normalization text shouldnt appear, save space for it.
              <span>&nbsp;</span>
            )}
          </Col>
        </Row>

        <Row className="pt-3">
          {/*If its not normalized (and only then), display a normalize for me button */}
          <Col xs={12}>
            {normalizedStatus === "not normalized" ? (
              <Button
                variant="outline-primary"
                onClick={() => {
                  // call save earlier state to show that a transformation has been called
                  // Call saveEarlierState
                  saveEarlierState();

                  // call normalize for me and get its result
                  const result = normalizeForMe(
                    probZero,
                    probOne,
                    sqrNormalization,
                    setRawAlpha,
                    setRawBeta,
                    evalAlpha,
                    evalBeta,
                    setNormalizedStatus,
                    addOrSubt,
                  );

                  // Update raw alpha and beta.
                  setRawAlpha(result.formattedAlpha);

                  setRawBeta(result.formattedBeta);

                  // Add the new alpha and beta from normalizing to the stack.
                  // Use the results instead of raw alpha and beta because raw alpha
                  // and beta have not been updated yet.
                  undoAndRedoStack.push(
                    result.formattedAlpha,
                    result.formattedBeta,
                  );
                }}
              >
                Normalize for me.
              </Button>
            ) : (
              <span>&nbsp;</span>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
