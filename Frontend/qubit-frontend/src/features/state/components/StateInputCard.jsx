import { useState, useEffect } from "react";
import "../../../App.css";
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
import { checkNormalizationHelper, validateInput } from "../../../compute";

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
          A disallowed symbol has been detected. Single Qubit Simulator does not
          support variables. Please remove or rewrite:{" "}
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

export function StateInputCard({
  //Probably should be ...props and then call props. later, but im too lazy
  addOrSubt,
  setAddOrSubt,
  normalized,
  setNormalized,
  setSqrNormalization,
  setProbZero,
  setProbOne,
}) {
  // The "raw" text of the inputs. Since the users can type anything,
  // we have to make sure the values are safe before working with them.
  const [rawAlpha, setRawAlpha] = useState("");
  const [rawBeta, setRawBeta] = useState("");

  // Validate input returns an error message when the input is invalid.
  // If its empty, the input is valid, and so nothing is displayed
  const validationErrorAlpha = validateInput(rawAlpha) || { errorNumber: 0 };
  const validationErrorBeta = validateInput(rawBeta) || { errorNumber: 0 };

  const delayMs = 300;
  // Debounce aka wait a certain amount of time before taking the user input and checking their normalization.
  useEffect(
    () => {
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
    [rawAlpha, rawBeta, addOrSubt]
  );

  return (
    <>
      {/**Place everything inside a container with a row for responsive design */}
      <Container>
        {/*TODO add different sizes for different screens, somewhere */}
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
            <Col xs={12} lg={5}>
              {/**The individual component grouping of each form */}
              <Form.Group controlId="ampZero">
                <Form.Label>
                  Input the amplitude for <InlineMath math={"|0\\rangle"} />{" "}
                  here
                </Form.Label>

                {/**Include input group to have |0⟩ be right next to the textbox */}
                <InputGroup>
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
                  <InputGroup.Text>
                    <InlineMath math={"|0\\rangle"} />
                  </InputGroup.Text>
                </InputGroup>

                {/*Display the validation error if there is one.*/}
                <Form.Text>{renderInputError(validationErrorAlpha)}</Form.Text>
              </Form.Group>
            </Col>

            {/*+ or - selector. lg 2 makes it so its takes up less space than alpha
            and beta controls from lg onward. D-flex makes this Col a flex container 
            (which it is not by default) so we can horizontally center the Form.Group
            below. And justify content center centers the select box to the center of the 
            screen (to emphasize that it is different from the other two selections).*/}
            <Col xs={12} lg={2} className="d-flex justify-content-center">
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
            <Col xs={12} lg={5}>
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

                <Form.Text>{renderInputError(validationErrorBeta)}</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/*Give it some space from the above row with pt */}
        <Row className="pt-3">
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
