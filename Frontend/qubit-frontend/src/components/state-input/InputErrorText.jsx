// Have a function that returns jsx to the return
export function InputErrorText(err) {
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
      console.log(err.name);
      return <> Unfinished Expression detected </>;
    default:
      return;
  }
}
