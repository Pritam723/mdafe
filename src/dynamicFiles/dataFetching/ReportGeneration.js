// import { Outlet } from "react-router-dom";

// import React from "react";

// const Blogs = () => {
//   return (
//     <div>
//       <h1>Under Development</h1>
//       <Outlet />
//     </div>
//   );
// };

// export default Blogs;

import React, { useEffect, useState, useRef } from "react";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Button } from "primereact/button";
import PlotlyComponent from "../plotting/PlotlyComponent";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";

export default function ReportGeneration() {
  const [template, setTemplate] = useState([]);
  const [templates, setTemplates] = useState([]);
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
  const [isFetching, setFetching] = useState(false);

  const fetchTemplateData = () => {
    console.log("already called");
    setFetching(true);
    // It is made false in the Child Function i.e., PlotlyComponent
    setFetchDataTrigger(!fetchDataTrigger);
  };

  const downloadTemplateConfiguration = () => {
    axios("/downloadTemplateConfiguration", {
      method: "POST", //Pretty sure you want a GET method but otherwise POST methods can still return something too.
      responseType: "blob", // important
    })
      .then((response) => {
        //Creates an <a> tag hyperlink that links the excel sheet Blob object to a url for downloading.
        console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        // link.setAttribute("download", `${Date.now()}.xlsx`); //set the attribute of the <a> link tag to be downloadable when clicked and name the sheet based on the date and time right now.
        link.setAttribute("download", `TemplatesConfiguration.xlsx`);
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

  const fetchTemplateDataInExcel = () => {
    // console.log(multiplierData);
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
    formData.append("selectedMeters", JSON.stringify([template]));
    formData.append("multiplierData", JSON.stringify("Not Required"));
    formData.append("fetchBy", "meterID");

    axios("/fetchTemplateDataInExcel", {
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
        link.setAttribute("download", `TemplateData.xlsx`);
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

  useEffect(() => {
    fetch("/getTemplateNames")
      .then((res) => res.json())
      .then((result) => {
        setTemplates(result);
        setTemplate(result[0].value);
      });
  }, []);
  // const content = (
  //   <>
  //     <span className="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">
  //       FA
  //     </span>
  //     <span className="ml-2 font-medium">Farakka Generation Average</span>
  //   </>
  // );

  const toast = useRef(null);

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  return (
    <div className="card">
      <Toast ref={toast}></Toast>
      <span>
        <h4>Report Generation Open Query</h4>{" "}
      </span>
      <Divider />{" "}
      <div style={{ height: "auto" }}>
        <div class="grid">
          <div class="col">
            {" "}
            <label className="font-bold block mb-2">Select Template</label>
            <Dropdown
              value={template}
              onChange={(e) => {
                // console.log(e.value);
                setTemplate(e.value);
              }}
              options={templates}
              optionLabel="name"
              placeholder="Select Template"
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
                  Fetch Template Data{" "}
                </label>
                <Button
                  label="Fetch"
                  severity="success"
                  rounded
                  onClick={() => {
                    fetchTemplateData();
                  }}
                />
              </div>{" "}
            </div>
          </div>

          <div class="col">
            <div className="card flex flex-wrap justify-content-center gap-3">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  Fetch Template Data in Excel
                </label>

                <Button
                  icon="pi pi-file-excel"
                  rounded
                  text
                  raised
                  severity="info"
                  aria-label="User"
                  onClick={() => {
                    fetchTemplateDataInExcel();
                  }}
                />
              </div>{" "}
            </div>
          </div>

          <div class="col">
            <div className="card flex flex-wrap justify-content-center gap-3">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  Change Template Configuration{" "}
                </label>
                <FileUpload
                  mode="basic"
                  name="file"
                  chooseLabel="Upload Configuration"
                  // uploadHandler={console.log("Works")}
                  url="/changeTemplateConfiguration"
                  accept=".xlsx"
                  maxFileSize={1000000}
                  onUpload={onUpload}
                />
              </div>{" "}
            </div>
          </div>

          <div class="col">
            <div className="card flex flex-wrap justify-content-center gap-3">
              <div className="flex-auto">
                <label htmlFor="calendar-24h" className="font-bold block mb-2">
                  {"Download"}
                </label>

                <Button
                  icon="pi pi-cloud-download"
                  rounded
                  text
                  raised
                  severity="info"
                  aria-label="User"
                  onClick={() => {
                    downloadTemplateConfiguration();
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
          selectedMeters={[template]}
          fetchDataTrigger={fetchDataTrigger}
          fetchBy={"meterID"}
          isFetchingStateChanger={setFetching}
          multiplierData={"Not Required"}
          setMultiplierData={null}
          selectedMeterChangeFlag={null}
          setSelectedMeterChangeFlag={null}
          fetchDataType="fetchTemplateWiseData"
        />
      </div>
    </div>
  );
}
