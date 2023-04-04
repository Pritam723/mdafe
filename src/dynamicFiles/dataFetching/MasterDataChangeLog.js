import React, { useState, useEffect } from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "../../staticFiles/cssFiles/TimelineDemo.css";
import axios from "axios";
import { Dialog } from "primereact/dialog";
// import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import moment from "moment";

export default function TemplateDemo() {
  const [configChanges, setConfigChanges] = useState([]);
  const [visible, setVisible] = useState(false);
  const [singleChange, setSingleChnage] = useState(<div></div>);
  const [configType, setConfigType] = useState("masterData");
  const [meters, setMeters] = useState([]);
  const [selectedMeter, setSelectedMeter] = useState({
    name: "Any",
    code: "Any",
  });

  const [allMeters, setAllMeters] = useState({
    "Real Meters": [],
    "Fictitious Meters": [],
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
  var iconArray = [
    "pi pi-arrow-down",
    "pi pi-cog",
    "pi pi-bolt",
    "pi pi-compass",
    "pi pi-sort-numeric-down",
  ];
  var iconColorArray = ["#9C27B0", "#673AB7", "#FF9800", "#607D8B", "#607D8B"];
  const configTypes = [
    { name: "MASTER.DAT", code: "masterData", value: "masterData" },
    { name: "FICTMTRS.DAT", code: "fictdatData", value: "fictdatData" },
    { name: "FICTMTRS.CFG", code: "fictcfgData", value: "fictcfgData" },
  ];

  const compareConfigurations = (prevId, currId) => {
    // console.log(prevId, currId);
    setVisible(true);

    // console.log("Previous ID is : " + prevId);
    // console.log("Current ID is : " + currId);

    //if (prevId == "None") prevId = null; // Otherwise Python will not handle it.

    var formData = new FormData();

    formData.append("configType", configType);
    formData.append("prevId", prevId);
    formData.append("currId", currId);

    axios("/compareConfigurations", {
      method: "POST",
      data: formData,
    })
      .then((response) => {
        //Creates an <a> tag hyperlink that links the excel sheet Blob object to a url for downloading.
        // setSingleChnage(added);
        // console.log(response);
        // console.log(response.data.Added);
        // console.log(response.data.Deleted);

        let added = response.data.Added.map((item, index) => {
          let itemText = index + 1 + ") ";
          for (var key in item) {
            itemText = itemText + " " + key + " : " + item[key] + ","; // "User john is #234"
          }
          return (
            <div key={item["Loc_Id"]} style={{ color: "green" }}>
              {itemText}
              <br />
              <br />
            </div>
          );
        });

        if (added.length == 0)
          added = [
            "No meter was added in this configuration as compared to the previous",
          ];

        let deleted = response.data.Deleted.map((item, index) => {
          let itemText = index + 1 + ") ";
          for (var key in item) {
            itemText = itemText + " " + key + " : " + item[key] + ","; // "User john is #234"
          }

          return (
            <div key={item["Loc_Id"]} style={{ color: "red" }}>
              {itemText}
              <br /> <br />
            </div>
          );
        });

        if (deleted.length == 0)
          deleted = [
            "No meter was deleted in this configuration as compared to the previous",
          ];

        setSingleChnage(
          <div>
            <h3>
              Following are the meters which are newly added compared to the
              previous Configuration
            </h3>{" "}
            <br />
            {added}
            <br />
            <h3>
              Following are the meters which are deleted compared to the
              previous Configuration
            </h3>
            <br />
            {deleted}
          </div>
        );
      })
      .then(() => {
        // setFetching(false);
      });
  };

  const getConfigurationChangeHistory = () => {
    var formData = new FormData();

    formData.append("configType", configType);
    formData.append("selectedMeter", selectedMeter["code"]);
    formData.append(
      "startDateTime",
      moment(startDateTime).format("DD-MM-YYYY")
    );
    formData.append("endDateTime", moment(endDateTime).format("DD-MM-YYYY"));

    axios("/getConfigurationChangeHistory", {
      method: "POST",
      data: formData,
    }).then((result) => {
      setConfigChanges(result.data);
      // console.log(result.data);
    });
  };

  useEffect(() => {
    fetch("/getMetersListed/" + "meterID")
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        result["Real Meters"].splice(0, 0, { name: "Any", code: "Any" });
        result["Fictitious Meters"].splice(0, 0, { name: "Any", code: "Any" });

        setAllMeters(result);
        setMeters(result["Real Meters"]);
        setSelectedMeter({ name: "Any", code: "Any" });
      });
  }, []);

  const customizedMarker = (item) => {
    return (
      <span
        className="flex w-2rem h-2rem align-items-center justify-content-center text-white border-circle z-1 shadow-1"
        style={{
          backgroundColor: iconColorArray[item.index % iconArray.length],
        }}
      >
        <i className={iconArray[item.index % iconArray.length]}></i>
      </span>
    );
  };

  const customizedContent = (item) => {
    // console.log(item);
    return (
      <div>
        <Dialog
          header="Chnages W.R.T Previous Configuration"
          visible={visible}
          maximizable
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          {/* <p className="m-0">{singleChange}</p> */}
          {singleChange}
        </Dialog>

        <Card title={item.status} subTitle={item.dateInfo}>
          {item.configDataId != "None" ? (
            <p>You can download the Configuration for these dates</p>
          ) : (
            <p>There is no Configuration for these dates</p>
          )}
          <Button label="Download" className="p-button-text"></Button>

          {item.index != 0 ? (
            <Button
              label="See Changes"
              className="p-button-text"
              onClick={() => {
                compareConfigurations(
                  configChanges[item.index - 1]["configDataId"],
                  item.configDataId
                );
              }}
            ></Button>
          ) : (
            <div>This is the first Configuration you have fetched.</div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="card">
      <span>
        <h4>Fetch Configuration History</h4>{" "}
      </span>
      <Divider />{" "}
      <div class="grid">
        <div class="col">
          {" "}
          <label className="font-bold block mb-2">Select Configuration</label>
          <Dropdown
            value={configType}
            onChange={(e) => {
              // console.log(e.value);
              setConfigType(e.value);
              setConfigChanges([]); // Whenever Config Type is changed, remove the currently fetched Change Log Tree.
              if (e.value == "masterData") {
                setMeters(allMeters["Real Meters"]);
              } else {
                setMeters(allMeters["Fictitious Meters"]);
              }
              // setSelectedMeter(null);
              setSelectedMeter({ name: "Any", code: "Any" });
              setConfigChanges([]);
            }}
            options={configTypes}
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
              setConfigChanges([]);
            }}
            options={meters}
            optionLabel="name"
            placeholder="Select Configuration"
            className="w-full md:w-14rem"
          />
        </div>

        <div class="col">
          <div className="card flex flex-wrap gap-3 p-fluid justify-content">
            <div className="flex-auto">
              <label htmlFor="calendar-24h" className="font-bold block mb-2">
                Start Date
              </label>
              <Calendar
                id="calendar-24h"
                value={startDateTime}
                onChange={(e) => {
                  // console.log(moment(e.value));
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
              <label htmlFor="calendar-24h" className="font-bold block mb-2">
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
              <label htmlFor="calendar-24h" className="font-bold block mb-2">
                Fetch Configuration History{" "}
              </label>
              <Button
                label="Fetch"
                severity="success"
                rounded
                onClick={() => {
                  // console.log("Works");
                  getConfigurationChangeHistory();
                }}
              />
            </div>{" "}
          </div>
        </div>
      </div>
      <Divider />{" "}
      <div style={{ height: "auto" }}>
        <div class="grid">
          <div class="col"></div>
          <div class="col-6">
            {" "}
            <Timeline
              value={configChanges}
              align="alternate"
              className="customized-timeline"
              marker={customizedMarker}
              content={customizedContent}
            />
          </div>{" "}
          <div class="col"></div>
        </div>{" "}
      </div>
    </div>
  );
}
