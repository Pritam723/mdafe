// import { Outlet } from "react-router-dom";
import { Divider } from "primereact/divider";
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import PlotlyComponent from "../plotting/PlotlyComponent";
import { SelectButton } from "primereact/selectbutton";
import axios from "axios";

import LoadingOverlay from "react-loading-overlay-ts";
import FetchingTimeCounter from "./FetchingTimeCounter";
import TimeTaken from "./TimeTaken";

const ComponentWiseDataFetch = () => {
  const [timeTaken, setTimeTaken] = useState(0);
  const [meterType, setMeterType] = useState("Fictitious Meters");
  const [meters, setMeters] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState({
    name: null,
    code: null,
  });
  const [startDateTime, setStartDateTime] = useState(() => {
    let time = moment().toDate(); // This will return a copy of the Date that the moment uses
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    return time;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    let time = moment().toDate(); // This will return a copy of the Date that the moment uses
    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    return time;
  });
  const [allMeters, setAllMeters] = useState({
    "Real Meters": [],
    "Fictitious Meters": [],
  });
  const [fetchDataTrigger, setFetchDataTrigger] = useState(false);

  const [multiplierData, setMultiplierData] = useState({});
  const [selectedMeterChangeFlag, setSelectedMeterChangeFlag] = useState(false);

  const [isFetching, setFetching] = useState(false);
  const [componentType, setComponentType] = useState("Level-1");
  const componentTypes = [
    { name: "Level-1", value: "Level-1" },
    { name: "Recursive", value: "Recursive" },
  ];
  const meterTypes = [
    // { name: "Real Meters", code: "Real Meters", value: "Real Meters" },
    {
      name: "Fictitious Meters",
      code: "Fictitious Meters",
      value: "Fictitious Meters",
    },
  ];

  const fetchComponentWiseData = () => {
    console.log("already called");
    setFetching(true);
    // It is made false in the Child Function i.e., PlotlyComponent
    setFetchDataTrigger(!fetchDataTrigger);
  };

  useEffect(() => {
    fetch("/getMetersListed/" + "meterID")
      .then((res) => res.json())
      .then((result) => {
        setAllMeters(result);
        setMeters(result["Fictitious Meters"]);
      });
  }, []);

  const fetchComponentWiseDataInExcel = () => {
    // console.log("Set fetching");
    setFetching(true);
    var formData = new FormData();
    console.log("Creating Form Data");
    formData.append(
      "startDateTime",
      moment(startDateTime).format("DD-MM-YYYY HH:mm:ss")
    );
    formData.append(
      "endDateTime",
      moment(endDateTime).format("DD-MM-YYYY HH:mm:ss")
    );
    formData.append("selectedMeters", JSON.stringify([selectedMeter]));
    formData.append("multiplierData", JSON.stringify(multiplierData));
    formData.append("fetchBy", "meterID");
    formData.append("componentType", componentType);

    axios("/fetchComponentWiseDataInExcel", {
      method: "POST", //Pretty sure you want a GET method but otherwise POST methods can still return something too.
      responseType: "blob", // important
      data: formData,
    })
      .then((response) => {
        //Creates an <a> tag hyperlink that links the excel sheet Blob object to a url for downloading.
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // link.setAttribute("download", `${Date.now()}.xlsx`); //set the attribute of the <a> link tag to be downloadable when clicked and name the sheet based on the date and time right now.
        link.setAttribute("download", `ComponentData.xlsx`);
        document.body.appendChild(link);
        link.click(); //programmatically click the link so the user doesn't have to
        document.body.removeChild(link);
        URL.revokeObjectURL(url); //important for optimization and preventing memory leak even though link element has already been removed. In the case of long running apps that haven't been reloaded many times.
      })
      .then(() => {
        setFetching(false);
      });
    // setFetching(false);
    // console.log("Set fetching to false");
  };

  return (
    <div className="card">
      <TimeTaken
        timeTaken={timeTaken}
        setTimeTaken={setTimeTaken}
        isFetching={isFetching}
      />
      <span>
        <h4>Fetch Component Wise Meter Data</h4>{" "}
      </span>
      <Divider />

      <LoadingOverlay
        active={isFetching}
        spinner
        text={
          <div>
            Fetching Component-wise Meter Data... <br /> You have fetched{" "}
            {moment(endDateTime).diff(moment(startDateTime), "days") + 1} days
            Data for the meter {selectedMeter["name"]}. It may take a while.{" "}
            <FetchingTimeCounter setTimeTaken={setTimeTaken} />
          </div>
        }
      >
        <div class="grid">
          <div class="col">
            {" "}
            <label className="font-bold block mb-2">Select Meter Type</label>
            <Dropdown
              value={meterType}
              onChange={(e) => {
                // console.log(e.value);
                setMeterType(e.value);
                if (e.value == "Real Meters") {
                  setMeters(allMeters["Real Meters"]);
                } else {
                  setMeters(allMeters["Fictitious Meters"]);
                }
              }}
              options={meterTypes}
              optionLabel="name"
              placeholder="Select Configuration"
              className="w-full md:w-14rem"
            />
          </div>
          <div class="col">
            {" "}
            <label className="font-bold block mb-2">Select Meter</label>
            <Dropdown
              value={selectedMeter}
              onChange={(e) => {
                // console.log(e.value);
                setSelectedMeter(e.value);
                setSelectedMeterChangeFlag(true);
                // setMultiplierData({});
              }}
              filter={true}
              options={meters}
              optionLabel="name"
              placeholder="Select Configuration"
              className="w-full md:w-14rem"
            />
          </div>
          <div class="col">
            {" "}
            <div className="card flex flex-wrap gap-3 p-fluid justify-content">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  Start Date
                </label>
                <Calendar
                  id="calendar-24h"
                  value={startDateTime}
                  onChange={(e) => {
                    console.log(moment(e.value));
                    setStartDateTime(e.value);
                  }}
                  // showTime
                  // hourFormat="24"
                  // stepMinute={15}
                  dateFormat="dd/mm/yy"
                  // locale="en-IN"
                  // showIcon
                />
              </div>
            </div>
          </div>
          <div class="col">
            {" "}
            <div className="card flex flex-wrap gap-6 p-fluid justify-content">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  End Date
                </label>
                <Calendar
                  id="calendar-24h"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.value)}
                  // showTime
                  // hourFormat="24"
                  // stepMinute={15}
                  // showIcon
                  dateFormat="dd/mm/yy"
                />
              </div>
            </div>
          </div>
          <div class="col">
            {" "}
            <div className="card flex flex-wrap justify-content-center gap-3">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  Fetch Component Data{" "}
                </label>
                <Button
                  label="Fetch"
                  severity="success"
                  rounded
                  onClick={() => {
                    fetchComponentWiseData();
                  }}
                />
              </div>{" "}
            </div>
          </div>

          <div class="col">
            <div className="card flex flex-wrap justify-content-center gap-3">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  Fetch Component Data in Excel
                </label>

                <Button
                  icon="pi pi-file-excel"
                  rounded
                  text
                  raised
                  severity="info"
                  aria-label="User"
                  onClick={() => {
                    fetchComponentWiseDataInExcel();
                  }}
                />
              </div>{" "}
            </div>
          </div>
        </div>
        <Divider />

        <div className="card flex flex-column align-items-center">
          <div className="card flex justify-content-center">
            <SelectButton
              value={componentType}
              onChange={(e) => {
                setComponentType(e.value);
                console.log(e.value);
              }}
              optionLabel="name"
              options={componentTypes}
              multiple={false}
            />
          </div>
        </div>

        <PlotlyComponent
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          selectedMeters={[selectedMeter]}
          fetchDataTrigger={fetchDataTrigger}
          fetchBy={"meterID"}
          isFetchingStateChanger={setFetching}
          multiplierData={multiplierData}
          setMultiplierData={setMultiplierData}
          selectedMeterChangeFlag={selectedMeterChangeFlag}
          setSelectedMeterChangeFlag={setSelectedMeterChangeFlag}
          fetchDataType="fetchComponentWiseData"
          componentType={componentType}
        />
      </LoadingOverlay>
      <Divider />
    </div>
  );
};

export default ComponentWiseDataFetch;
