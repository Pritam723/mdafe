import React from "react";

export default function FetchingTimeCounter({ setTimeTaken }) {
  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCount) => {
        setTimeTaken(prevCount + 1);
        return prevCount + 1;
      }); // <-- Change this line!
    }, 1000);
    return () => {
      clearInterval(timer);
      setTimeTaken(0);
    };
  }, []); // Pass in empty array to run effect only once!

  return <div>Timer : {counter} Seconds.</div>;
}
