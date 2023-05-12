import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
// /node_modules/primeflex/primeflex.css
import moment from "moment";

import React, { useEffect, useState, useCallback } from "react";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";

import PlotlyComponent from "../plotting/PlotlyComponent";
import { MultiSelect } from "primereact/multiselect";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { Button } from "primereact/button";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import FetchingTimeCounter from "./FetchingTimeCounter";
import TimeTaken from "./TimeTaken";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Link } from "react-router-dom";

export default function FetchActiveReactive({ fetchBy }) {
  const [energyType, setEnergyType] = useState("activeHigh");
  const energyTypes = [
    { name: "Active", value: "activeHigh" },
    { name: "Reactive High", value: "reactiveHigh" },
    { name: "Reactive Low", value: "reactiveLow" },
  ];
  const [meterType, setMeterType] = useState(null);
  const [allMeters, setAllMeters] = useState({
    "Real Meters": [],
    "Fictitious Meters": [],
  });
  const [meters, setMeters] = useState([]);
  const [selectedMeters, setSelectedMeters] = useState([]);
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
  const [fetchDataTrigger, setFetchDataTrigger] = useState(false);

  const [multiplierData, setMultiplierData] = useState({});
  const [selectedMeterChangeFlag, setSelectedMeterChangeFlag] = useState(false);

  const meterTypes = [
    { name: "Real Meters", code: "Real Meters", value: "Real Meters" },
    {
      name: "Fictitious Meters",
      code: "Fictitious Meters",
      value: "Fictitious Meters",
    },
    { name: "All Meters", code: "All Meters", value: "All Meters" },
  ];

  const [isFetching, setFetching] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  // const handleButtonClicked = useCallback(() => {
  //   setFetching((value) => !value);
  // }, []);

  useEffect(() => {
    fetch("/getMetersListed/" + fetchBy)
      .then((res) => res.json())
      .then((result) => {
        setAllMeters(result);
      });
  }, []);

  const fetchActiveReactiveData = () => {
    console.log("already called");
    setFetching(true);
    // It is made false in the Child Function i.e., PlotlyComponent
    setFetchDataTrigger(!fetchDataTrigger);
  };

  const fetchActiveReactiveInExcel = () => {
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
    formData.append("selectedMeters", JSON.stringify(selectedMeters));
    formData.append("multiplierData", JSON.stringify(multiplierData));
    formData.append("fetchBy", fetchBy);
    formData.append("energyType", energyType);

    axios("/fetchActiveReactiveInExcel", {
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
        link.setAttribute("download", `EnergyData.xlsx`);
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
      <h4> </h4>{" "}
      <span>
        <h4>
          Fetch Active/Reactive Energy Data by{" "}
          {fetchBy == "meterID" ? " Meter Location ID" : " Meter Number"}. You
          can fetch Meter Data (MWH)
          <Link to={fetchBy == "meterID" ? "/dataByID" : "/dataByNO"}>
            {" "}
            HERE.{" "}
          </Link>
        </h4>{" "}
      </span>
      <Divider />
      <LoadingOverlay
        active={isFetching}
        spinner
        text={
          <div>
            Fetching Active/Reactive Energy Data... <br /> You have fetched{" "}
            {moment(endDateTime).diff(moment(startDateTime), "days") + 1} days
            Data for {selectedMeters.length} meters. It may take a while.{" "}
            <FetchingTimeCounter setTimeTaken={setTimeTaken} />
          </div>
        }
      >
        <div style={{ height: "auto" }}>
          <div class="grid">
            <div class="col">
              {" "}
              <div className="card flex flex-column align-items-center">
                <label className="font-bold block mb-2">
                  Select Meter Type
                </label>
                <div className="card flex justify-content-center">
                  <Dropdown
                    value={meterType}
                    onChange={(e) => {
                      setMeterType(e.value);

                      if (e.value == "All Meters") {
                        setMeters(
                          allMeters["Real Meters"].concat(
                            allMeters["Fictitious Meters"]
                          )
                        );
                      } else {
                        setMeters(allMeters[e.value]);
                      }
                      setSelectedMeters([]);
                      setSelectedMeterChangeFlag(true);
                      // setMultiplierData({});
                    }}
                    options={meterTypes}
                    optionLabel="name"
                    placeholder="Select Type"
                    className="w-full md:w-14rem"
                  />
                </div>
              </div>
            </div>
            <div class="col">
              <div className="card flex justify-content-center">
                <div className="flex-auto">
                  <label
                    htmlFor="calendar-24h"
                    className="font-bold block mb-2"
                  >
                    Select Meters
                  </label>
                  <MultiSelect
                    value={selectedMeters}
                    onChange={(e) => {
                      console.log(e.value);
                      setSelectedMeters(e.value);
                      setSelectedMeterChangeFlag(true);
                      // setMultiplierData({});
                    }}
                    options={meters}
                    optionLabel="name"
                    filter
                    placeholder="Select Meters"
                    maxSelectedLabels={2}
                    className="w-full md:w-20rem"
                  />
                </div>
              </div>
            </div>
            <div class="col">
              <div className="card flex flex-wrap gap-3 p-fluid justify-content">
                <div className="flex-auto">
                  <label
                    htmlFor="calendar-24h"
                    className="font-bold block mb-2"
                  >
                    Start Date
                  </label>
                  <Calendar
                    id="calendar-24h"
                    value={startDateTime}
                    onChange={(e) => {
                      console.log(moment(e.value));
                      setStartDateTime(e.value);
                    }}
                    showTime={false}
                    hourFormat="24"
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
                  <label
                    htmlFor="calendar-24h"
                    className="font-bold block mb-2"
                  >
                    End Date
                  </label>
                  <Calendar
                    id="calendar-24h"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.value)}
                    showTime={false}
                    hourFormat="24"
                    // stepMinute={15}
                    // showIcon
                    dateFormat="dd/mm/yy"
                  />
                </div>
              </div>
            </div>

            <div class="col">
              <div className="card flex flex-wrap justify-content-center gap-3">
                <div className="flex-auto">
                  <label
                    htmlFor="calendar-24h"
                    className="font-bold block mb-2"
                  >
                    Fetch Energy Data{" "}
                  </label>
                  <Button
                    label="Fetch"
                    severity="success"
                    rounded
                    onClick={() => {
                      fetchActiveReactiveData();
                    }}
                  />
                </div>{" "}
              </div>
            </div>

            <div class="col">
              <div className="card flex flex-wrap justify-content-center gap-3">
                <div className="flex-auto">
                  <label
                    htmlFor="calendar-24h"
                    className="font-bold block mb-2"
                  >
                    Fetch Energy Data in Excel
                  </label>

                  <Button
                    icon="pi pi-file-excel"
                    rounded
                    text
                    raised
                    severity="info"
                    aria-label="User"
                    onClick={() => {
                      fetchActiveReactiveInExcel();
                    }}
                  />
                </div>{" "}
              </div>
            </div>
          </div>{" "}
          <Divider />
          {/* <button onClick={handleButtonClicked}>Loading Meter Data</button> */}
          <Divider />
          <div className="card flex flex-column align-items-center">
            <div className="card flex justify-content-center">
              <SelectButton
                value={energyType}
                onChange={(e) => {
                  setEnergyType(e.value);
                  console.log(e.value);
                }}
                optionLabel="name"
                options={energyTypes}
                multiple={false}
              />
            </div>
          </div>
          {/* <Divider /> */}
          <PlotlyComponent
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            selectedMeters={selectedMeters}
            fetchDataTrigger={fetchDataTrigger}
            fetchBy={fetchBy}
            isFetchingStateChanger={setFetching}
            multiplierData={multiplierData}
            setMultiplierData={setMultiplierData}
            selectedMeterChangeFlag={selectedMeterChangeFlag}
            setSelectedMeterChangeFlag={setSelectedMeterChangeFlag}
            fetchDataType="fetchActiveReactive"
            energyType={energyType}
          />
        </div>
      </LoadingOverlay>
      <Divider />
    </div>
  );
}
