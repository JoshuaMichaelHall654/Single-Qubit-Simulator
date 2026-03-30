import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import backendModule from "../../compiledBackend/backend.out";
import { useEffect } from "react";

console.time("time to await backend");
let backend = await backendModule();
console.timeEnd("time to await backend");

export function StateMeasurementCard({
  normalizedStatus,
  evalAlpha,
  evalBeta,
}) {
  // Set backend once everything else has loaded and only then
  useEffect(() => {
    if (evalAlpha.current.re != null) {
      console.time("calculate hadamard");
      const resultOfThing = backend.hadamardGate(
        // Make sure to pass it as a structure using
        // what we defined as our members in the c++ backend
        // (re and im). In math.js, complex values get their
        // real and imaginary values through .re and .im properties as well,
        // so the naming was deliberate.
        { re: evalAlpha.current.re, im: evalAlpha.current.im },
        { re: evalBeta.current.re, im: evalBeta.current.im },
      );
      console.timeEnd("calculate hadamard");
      console.log(resultOfThing);
      console.log("hello");
    }
  }, [evalAlpha.current]);

  console.log("Yo did it work? " + evalAlpha.current + " " + evalBeta.current);
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
      {/**Tell the user to input something if they are idle or to normalize their state
       * if its not normalized
       */}
      <Row>
        <Col>
          {normalizedStatus == "idle" ? (
            "Please input alpha and beta"
          ) : // If its not normalized, tell the user to normalize alpha and beta.
          // Otherwise, display the button
          normalizedStatus == "not normalized" ? (
            "Please normalize alpha and beta"
          ) : (
            <Form.Group controlId="transformation">
              <Form.Label>Transformation</Form.Label>
              <Form.Select
                // Classname w-auto makes the select width fit its content. Select center
                // was the attempt to align the select with the options in the select.
                // Doesnt really work since dropdowns are browser based unless
                // you use bootstrap Dropdown (not doing it).
                className="w-auto select-center"
                style={{ minWidth: "6rem" }}
              >
                <option onChange>10</option>
                <option>9</option>
              </Form.Select>
            </Form.Group>
          )}
        </Col>
      </Row>
      <Row>
        <Col></Col>
      </Row>
      <></>
    </>
  );
}
