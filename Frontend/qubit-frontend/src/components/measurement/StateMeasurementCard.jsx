// Imports of on device files
import "../../App.css";
import backendModule from "../../compiledBackend/backend.out";
import "katex/dist/katex.min.css";
import { validateAmplitudeInput } from "../validateAmplitudeInput";
import { checkNormalization } from "../checkNormalization";

// library imports
import { InlineMath } from "react-katex";
import { complex } from "mathjs";
import { useEffect, useState, useRef } from "react";
import { Button, Container, Form, Row, Col, InputGroup } from "react-bootstrap";
import { formatComplex } from "../state-input/formatComplex";

console.time("time to await backend");
let backend = await backendModule();
console.timeEnd("time to await backend");

export function StateMeasurementCard({
  normalizedStatus,
  evalAlpha,
  evalBeta,
}) {
  // Current gate
  const [currentGate, setCurrentGate] = useState("");
  const [formattedAlpha, setFormattedAlpha] = useState("");
  const [formattedBeta, setFormattedBeta] = useState("");

  // amplitude of |0>
  const [rawMeasurementAmpZero, setAmpZero] = useState("");
  const [rawMeasurementAmpOne, setAmpOne] = useState("");
  const [addOrSubt, setAddOrSubt] = useState("");

  // Validate input returns an error message when the input is invalid.
  // If its empty, the input is valid, and so nothing is displayed.
  // Validate amplitude input expects a string, not a math object.
  const validationErrorZero = validateAmplitudeInput(rawMeasurementAmpZero);
  const validationErrorOne = validateAmplitudeInput(rawMeasurementAmpOne);

  const [resultOfThing, setResultOfThing] = useState("");

  /*
   const delayMs = 300;
  // Debounce aka wait a certain amount of time before taking the user input and checking their normalization.
  useEffect(() => {

  }, [rawMeasurementAmpZero, rawMeasurementAmpOne, addOrSubt]); */

  // Apply gate function
  function applyGate(currentGate) {
    if (currentGate === "Hadamard Gate") {
      const result = backend.hadamardGate(
        // Make sure to pass it as a structure using
        // what we defined as our members in the c++ backend
        // (re and im). In math.js, complex values get their
        // real and imaginary values through .re and .im properties as well,
        // so the naming was deliberate.
        { re: evalAlpha.current.re, im: evalAlpha.current.im },
        { re: evalBeta.current.re, im: evalBeta.current.im },
      );
      setResultOfThing(result);
      const alpha = formatComplex(result.alpha.re, result.alpha.im);

      const beta = formatComplex(result.beta.re, result.beta.im);
      setFormattedAlpha(alpha);
      setFormattedBeta(beta);
    }
  }

  function measureProbability() {
    // Validate that the expression is valid using math.js expression tree
    // (its only valid when not null)
    if (validationErrorOne !== null || validationErrorZero !== null) {
      console.log(validationErrorOne);
      console.log(validationErrorZero);
      return;
    }

    // Validate that its normalized, as basis vectors must be normalized, or
    // the result will be nonsense (i.e. the probability of being in (1 1)^T
    // doesn't make sense).
    // Check normalization also returns the raw measurement values as complex
    // values
    const check = checkNormalization(
      rawMeasurementAmpZero,
      rawMeasurementAmpOne,
      addOrSubt,
    );

    // If the result is not normalized, return nothing
    if (check.resultOfCheck === "not normalized") {
      console.log("error, not normalized");
      return;
    } else if (check.resultOfCheck === "zero error") {
      console.log("oops, all zeros");
      return;
    }

    // create the basis vector using the methods exported from C++
    const basisVector = new backend.ComplexReplacementArray();
    // add the values using push back for the vector
    basisVector.push_back({ re: check.alphaNum.re, im: check.alphaNum.im });
    basisVector.push_back({ re: check.betaNum.re, im: check.betaNum.im });

    // Measure the probability of our alpha and beta ending up in the
    // state dicated by the basis vector
    const result = backend.measurementProbability(
      basisVector,
      { re: evalAlpha.current.re, im: evalAlpha.current.im },
      { re: evalBeta.current.re, im: evalBeta.current.im },
    );
    console.log(result);
  }

  return (
    <>
      <Row className="">
        <Col>
          <div>
            <strong>Coming up next!: </strong>
          </div>
          <div>Simple (Hadamard) Gate and measurement!</div>
        </Col>
      </Row>
      <Row className="align-items-baseline">
        {/**Tell the user to input something if they are idle or to normalize their state
         * if its not normalized
         */}
        {normalizedStatus == "idle" ? (
          <Col> Please input alpha and beta first </Col>
        ) : // If its not normalized, tell the user to normalize alpha and beta.
        // Otherwise, display the button
        normalizedStatus == "not normalized" ? (
          <Col> Please normalize alpha and beta first </Col>
        ) : (
          <>
            {/** Otherwise, display the full row. className="d-flex justify-content-center" is
             * there for when screens are between xs and xl. This makes it
             * so they fill up the center of their row. d-flex makes it into a flexbox, so that justify-content-center
             * centers them, and my-2 means they have a margin of 2 on the top and bottom to give each other space.
             */}
            <Col xs={12} xxl={4} className="d-flex justify-content-center my-2">
              Transformations:
            </Col>
            <Col xs={12} xxl={4} className="d-flex justify-content-center my-2">
              <Form.Group controlId="transformation">
                <Form.Select
                  className="w-auto justify-content-center"
                  style={{ minWidth: "6rem" }}
                  onChange={(eventObject) => {
                    setCurrentGate(eventObject.target.value);
                  }}
                >
                  <option>Choose a gate</option>
                  <option>Hadamard Gate</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} xxl={4} className="d-flex justify-content-center my-2">
              <Button
                onClick={() => {
                  applyGate(currentGate);
                }}
              >
                Apply Gate
              </Button>
            </Col>
            <Row>
              {/** These might all need to be in the same row such that they can stack vertically
               * next to each other
               */}
              <Col>
                Result:{" "}
                {formattedAlpha === ""
                  ? ""
                  : formattedAlpha + "|0> + " + formattedBeta + "|1>"}
              </Col>
            </Row>
            <Row>
              <Col>
                {/** Changing eval alpha does not change raw alpha.
                 * Why is there a diffrence between these two things again?
                 */}
                <Button
                  onClick={() => {
                    evalAlpha.current = resultOfThing.alpha;
                    evalBeta.current = resultOfThing.beta;
                  }}
                >
                  Make result alpha and beta
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                Measurement{" "}
                <Button
                  onClick={() => {
                    measureProbability();
                  }}
                ></Button>
                <Form>
                  <Row className="g-0">
                    <Col xs={12} xxl={5}>
                      <Form.Group controlId="measurementZero">
                        <Form.Label>
                          Put the amplitude for the{" "}
                          <InlineMath math={"|0\\rangle"} /> part of the basis
                          vector you wish to measure. Construct your basis
                          vector?
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            placeholder="Input the amplitude for state |0\\rangle here."
                            value={rawMeasurementAmpZero}
                            onChange={(eventObject) => {
                              setAmpZero(eventObject.target?.value);
                            }}
                          />
                          <InputGroup.Text>
                            <InlineMath math={"|0\\rangle"} />
                          </InputGroup.Text>
                        </InputGroup>
                        <Form.Text></Form.Text>
                      </Form.Group>
                    </Col>
                    <Col
                      xs={12}
                      xxl={2}
                      className="d-flex justify-content-center"
                    >
                      <Form.Group controlId="plusAndOrMinus">
                        <Form.Label>Choose + or -</Form.Label>
                        <Form.Select
                          className="w-auto select-center"
                          style={{ minWidth: "6rem" }}
                          value={addOrSubt ? "true" : "false"}
                          onChange={(e) =>
                            setAddOrSubt(e.target.value === "true")
                          }
                        >
                          <option value="true">+</option>
                          <option value="false">-</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} xxl={5}>
                      <Form.Group controlId="measurementOne">
                        <Form.Label>
                          Put the amplitude for the{" "}
                          <InlineMath math={"|1\\rangle"} /> part of the basis
                          vector you wish to measure.
                        </Form.Label>

                        <InputGroup>
                          <Form.Control
                            placeholder="Input the amplitude for state |1\\rangle here."
                            value={rawMeasurementAmpOne}
                            onChange={(eventObject) => {
                              setAmpOne(eventObject.target?.value);
                            }}
                          />
                          <InputGroup.Text>
                            <InlineMath math={"|1\\rangle"} />
                          </InputGroup.Text>
                        </InputGroup>
                        <Form.Text></Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </>
        )}
      </Row>
      <></>
    </>
  );
}
