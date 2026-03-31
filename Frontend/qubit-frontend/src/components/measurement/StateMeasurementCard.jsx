import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import backendModule from "../../compiledBackend/backend.out";
import { useEffect, useState } from "react";

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

  // test function, likely to be removed
  const [resultOfThing, setResultOfThing] = useState("");

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
    }
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
      {/**Use align items baseline to align all items vertically based
       * on where their text is (align-items center does it based on
       * the center of their element, which is different between
       * text, a dropdown, and a button)
       */}
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
          </>
        )}
      </Row>
      <Row>
        {/** These might all need to be in the same row such that they can stack vertically
         * next to each other
         */}
        <Col>Result:</Col>
        {resultOfThing === ""
          ? ""
          : " (" +
            resultOfThing.alpha.re +
            " + " +
            resultOfThing.alpha.im +
            "i) |0> + (" +
            resultOfThing.beta.re +
            " + " +
            resultOfThing.beta.im +
            "i) |1> "}
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
      <></>
    </>
  );
}
