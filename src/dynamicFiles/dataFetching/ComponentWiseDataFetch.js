// import { Outlet } from "react-router-dom";
import { Divider } from "primereact/divider";
import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import PlotlyComponent from "../plotting/PlotlyComponent";

const ComponentWiseDataFetch = () => {
  const [meterType, setMeterType] = useState("Real Meters");
  const [meters, setMeters] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState(null);
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
  const [isFetching, setFetching] = useState(false);

  const meterTypes = [
    { name: "Real Meters", code: "Real Meters", value: "Real Meters" },
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
        setMeters(result["Real Meters"]);
      });
  }, []);

  return (
    <div className="card">
      <span>
        <h4>Fetch Component Wise Meter Data</h4>{" "}
      </span>
      <Divider />
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
                Fetch Meter Data{" "}
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
      </div>
      <Divider />

      <PlotlyComponent
        startDateTime={startDateTime}
        endDateTime={endDateTime}
        selectedMeters={[selectedMeter]}
        fetchDataTrigger={fetchDataTrigger}
        fetchBy={"meterID"}
        isFetchingStateChanger={setFetching}
        fetchDataType="fetchComponentWiseData"
      />
    </div>
  );
};

export default ComponentWiseDataFetch;
