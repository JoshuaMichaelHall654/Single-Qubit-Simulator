// Imports of on device files
import "../../App.css";
import "katex/dist/katex.min.css";
import backendModule from "../../compiledBackend/backend.out";
import { InputErrorText } from "./InputErrorText";
import { validateAmplitudeInput } from "./validateAmplitudeInput";
import { checkNormalizationHelper } from "../checkNormalization";

// import of standard react values
import { useState, useEffect, useRef } from "react";
// library imports
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
import "bootstrap/dist/css/bootstrap.min.css";

import { abs, evaluate, equal, complex, multiply, round } from "mathjs";

console.time("time to await backend");
const backend = await backendModule();
console.timeEnd("time to await backend");

export function StateInputCard({
  //Probably should be ...props and then call props. later, but im too lazy
  addOrSubt,
  setAddOrSubt,
  normalized,
  setNormalized,
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
  const validationErrorAlpha = validateAmplitudeInput(rawAlpha) || {
    errorNumber: 0,
  };
  const validationErrorBeta = validateAmplitudeInput(rawBeta) || {
    errorNumber: 0,
  };

  const delayMs = 300;
  // Debounce aka wait a certain amount of time before taking the user input and checking their normalization.
  useEffect(
    () => {
      // Reset normalized to empty everytime the user types.
      setNormalized("");
      // Reset the zero error everytime the user types
      setZeroError(false);
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
          evalAlpha.current = evaluate(rawAlpha);
          evalBeta.current = evaluate(rawBeta);

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

          // Save prob zero, one and sqrNormalization
          setProbZero(result.alphaProb);
          setProbOne(result.betaProb);
          setSqrNormalization(result.sqrNorm);

          // Finally, check if it equals 1 with epsillon comparison to avoid floating
          // point errors causing a false negative. Using 10^-9 as epsilon for now.
          if (abs(result.sqrNorm - 1) < 0.00000000001) {
            setNormalized("normalized");
          }
          // Otherwise its false
          else {
            setNormalized("not normalized");
          }
        }
      }, delayMs);
      return () => clearTimeout(id);
    },
    // TODO, pretty sure this is a useEffect anti pattern because while rawAlpha and beta are outside values,
    // they are not external to the program. useEffect is more for getting synced with apis.
    [rawAlpha, rawBeta, addOrSubt],
  );

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
          <div>Simple (Hadamard) Gate, undo and restart, and measurement!</div>
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
            <Col xs={12} xl={5}>
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
                <Form.Text>{InputErrorText(validationErrorAlpha)}</Form.Text>
              </Form.Group>
            </Col>

            {/*+ or - selector. lg 2 makes it so its takes up less space than alpha
            and beta controls from lg onward. D-flex makes this Col a flex container 
            (which it is not by default) so we can horizontally center the Form.Group
            below. And justify content center centers the select box to the center of the 
            screen (to emphasize that it is different from the other two selections).*/}
            <Col xs={12} xl={2} className="d-flex justify-content-center">
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
            <Col xs={12} xl={5}>
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

                <Form.Text>{InputErrorText(validationErrorBeta)}</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/*Give it some space from the above row with pt */}
        <Row className="pt-3">
          {/*This solution to rendering an error with zero might be a bit hack, idk. */}
          <>
            {zeroError === false ? null : (
              <Col>
                <> Both alpha and beta can not be zero at the same time.</>
              </Col>
            )}
          </>
          {/*If "normalized" not calculated (empty), display nothing. Otherwise, display
        whether the state is normalized or not. */}
          <>
            {normalized === "" ? null : <Col> Your state is {normalized}.</Col>}
          </>
        </Row>
        <Row className="pt-3">
          {/*If its not normalized (and only then), display a normalize for me button */}
          {normalized === "not normalized" ? (
            <Col>
              <Button
                variant="outline-primary"
                onClick={() => {
                  // Call normalize for me and recieve the changed values
                  console.time("backend call");
                  const retrunedStuff = backend.normalizeState(
                    probZero,
                    probOne,
                    sqrNormalization,
                    // Make sure to pass it as a structure using
                    // what we defined as our members in the c++ backend
                    // (re and im). In math.js, complex values get their
                    // real and imaginary values through .re and .im properties as well,
                    // so the naming was deliberate.
                    { re: evalAlpha.current.re, im: evalAlpha.current.im },
                    { re: evalBeta.current.re, im: evalBeta.current.im },
                  );
                  console.timeEnd("backend call");
                  console.time("time to change user text");

                  // Update raw alpha and beta. Remember that raw alpha and beta
                  // are strings, not things like complex or other expressions
                  setRawAlpha(
                    retrunedStuff.alphaStruct.im == 0
                      ? "" + retrunedStuff.alphaStruct.re
                      : retrunedStuff.alphaStruct.re +
                          " + " +
                          retrunedStuff.alphaStruct.im +
                          "i",
                  );

                  setRawBeta(
                    retrunedStuff.betaStruct.im == 0
                      ? "" + retrunedStuff.betaStruct.re
                      : retrunedStuff.betaStruct.re +
                          " + " +
                          retrunedStuff.betaStruct.im +
                          "i",
                  );

                  // Update eval alpha and beta. This will be our "math values"
                  evalAlpha.current = evaluate(rawAlpha);
                  evalBeta.current = evaluate(rawBeta);
                  evalAlpha.current = complex(evalAlpha.current);
                  evalBeta.current = complex(evalBeta.current);

                  setNormalized("normalized");
                  console.timeEnd("time to change user text");
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
