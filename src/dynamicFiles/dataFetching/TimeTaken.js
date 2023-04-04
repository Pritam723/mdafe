import React, { useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function TimeTaken({ timeTaken, setTimeTaken, isFetching }) {
  const toast = useRef(null);

  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "It was quick",
      detail: "Data loaded with in " + (timeTaken + 1) + " Seconds.",
      life: 2000,
    });
  };
  const showWarn = () => {
    toast.current.show({
      severity: "warn",
      summary: "Took some time",
      detail:
        "Data loaded in " +
        timeTaken +
        " Seconds. For large amount of data, it may take several minutes to load data.",
      life: 5000,
    });
  };

  const showError = () => {
    toast.current.show({
      severity: "error",
      summary: "Took too long",
      detail:
        "Data loaded in " +
        timeTaken +
        " Seconds. This might be due to huge volume of data fetched.",
      life: 5000,
    });
  };

  useEffect(() => {
    if (timeTaken) {
      //   console.log(timeTaken);
      if (timeTaken >= 120) {
        showError();
      } else if (timeTaken < 120 && timeTaken > 30) {
        showWarn();
      } else {
        showSuccess();
      }
    }
  }, [isFetching]);

  return (
    <div className="card flex">
      <Toast ref={toast} position="center" />
    </div>
  );
}
