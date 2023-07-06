import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export default function PlotlyComponent({
  startDateTime,
  endDateTime,
  selectedMeters,
  fetchDataTrigger,
  fetchBy,
  isFetchingStateChanger,
  multiplierData,
  setMultiplierData,
  selectedMeterChangeFlag,
  setSelectedMeterChangeFlag,
  fetchDataType,
  energyType,
  componentType,
}) {
  const [data, setData] = useState();
  const [layout, setLayout] = useState();
  const [previousMultiplierData, setPreviousMultiplierData] = useState(null);
  // let previousMultiplierData = null;
  const [DialogBody, setDialogBody] = useState(null);
  const [visible, setVisible] = useState(false);

  var tagColorArray = ["primary", "success", "info", "warning", "danger"];

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          closeDialog();
        }}
        className="p-button-text"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={() => {
          buildDialogBody();
          setVisible(false);
        }}
        autoFocus
      />{" "}
    </div>
  );

  const closeDialog = () => {
    console.log("Setting Previous data");
    console.log(previousMultiplierData);
    console.log("Now setting");
    setMultiplierData(previousMultiplierData);
    setVisible(false);
  };

  const buildDialogBody = () => {
    let DialogBody = [];
    console.log(multiplierData);
    let index = -1;
    for (const [meterID, multiplier] of Object.entries(multiplierData)) {
      index = index + 1;
      DialogBody.push(
        <React.Fragment key={meterID}>
          <Tag
            severity={tagColorArray[index % tagColorArray.length]}
            value={meterID + " : "}
          ></Tag>
          {"   "}
          <InputText
            defaultValue={multiplierData[meterID]}
            onChange={(e) => {
              console.log(e.target.value);
              console.log(meterID);
              multiplierData[meterID] = e.target.value;
              setMultiplierData(multiplierData);

              // console.log(multiplierData);
            }}
            keyfilter="int"
            className="p-inputtext-sm"
            placeholder="Default multiplier is +1"
          />
          <br /> <br />
        </React.Fragment>
      );
    }

    setDialogBody(DialogBody);
  };

  const fetchData = () => {
    axios
      .post("/" + fetchDataType + "/" + fetchBy, {
        startDateTime: moment(startDateTime).format("DD-MM-YYYY HH:mm:ss"),
        endDateTime: moment(endDateTime).format("DD-MM-YYYY HH:mm:ss"),
        selectedMeters: selectedMeters,
        energyType: energyType,
        componentType: componentType,
        multiplierData: multiplierData,
      })
      .then((response) => {
        console.log(response.data);
        let data = [];
        // let multiplierData = {};
        let DialogBody = [];

        let index = -1;

        for (const [meterID, meterData] of Object.entries(
          response.data.yAxisDataForAllMeters
        )) {
          index = index + 1;
          data.push({
            type: "scatter",
            mode: "lines",
            name: meterID,
            x: response.data.xAxisData,
            y: meterData,
            //   line: { color: "#17BECF" },
            visible: index != 0 && index != 1 ? "legendonly" : true,
          });
          // console.log(
          //   "For " + meterID + " value is " + multiplierData[meterID]
          // );
          if (multiplierData != "Not Required") {
            if (multiplierData[meterID] === undefined) {
              multiplierData[meterID] = null;
            }

            DialogBody.push(
              <React.Fragment key={meterID}>
                <Tag
                  severity={tagColorArray[index % tagColorArray.length]}
                  value={meterID + " : "}
                ></Tag>
                {"   "}
                <InputText
                  key={meterID}
                  defaultValue={multiplierData[meterID]}
                  onChange={(e) => {
                    console.log(e.target.value);
                    console.log(meterID);
                    multiplierData[meterID] = e.target.value;
                    setMultiplierData(multiplierData);

                    // console.log(multiplierData);
                  }}
                  keyfilter="int"
                  className="p-inputtext-sm"
                  placeholder="Default multiplier is +1"
                />
                <br /> <br />
              </React.Fragment>
            );
            setDialogBody(DialogBody);
          }
        }

        // var trace1 = {
        //   type: "scatter",
        //   mode: "lines",
        //   name: "line1",
        //   x: response.data.xAxisData,
        //   y: response.data.yAxisData,
        //   //   line: { color: "#17BECF" },
        // };

        var layout = {
          width: 1500,
          height: 500,
          title: fetchDataType == "fetchMeterData" ? "Datewise Meter Data" : "",
          xaxis: {
            autorange: true,
            range: [response.data.startDateTime, response.data.endDateTime],
            // rangeselector: {
            //   buttons: [
            //     {
            //       count: 1,
            //       label: "1m",
            //       step: "month",
            //       stepmode: "backward",
            //     },
            //     {
            //       count: 6,
            //       label: "6m",
            //       step: "month",
            //       stepmode: "backward",
            //     },
            //     { step: "all" },
            //   ],
            // },
            rangeslider: {
              range: [response.data.startDateTime, response.data.endDateTime],
            },
            type: "date",
          },
          yaxis: {
            autorange: true,
            // range: [86.8700008333, 138.870004167],
            type: "linear",
          },
        };
        setData(data);
        // console.log(data);
        console.log(multiplierData);
        setLayout(layout);
        setMultiplierData(multiplierData);

        // window.location.reload();
      })
      .then(() => {
        isFetchingStateChanger(false);
        setSelectedMeterChangeFlag(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    // console.log("Child UseEffect is called");
    // console.log(moment(startDateTime).format("DD-MM-YYYY HH:mm:ss"));
    // console.log(endDateTime);
    fetchData();
  }, [fetchDataTrigger]);

  return (
    <React.Fragment>
      {" "}
      {!selectedMeterChangeFlag &&
      selectedMeters &&
      selectedMeters.length &&
      selectedMeters[0]["name"] &&
      multiplierData != "Not Required" ? (
        <React.Fragment>
          <br />
          <br />
          <div className="card flex justify-content-center">
            <Button
              label="Set Multipliers"
              // icon="pi pi-external-link"
              severity="secondary"
              onClick={() => {
                console.log(multiplierData);
                let bufferData = Object.assign({}, multiplierData);
                setPreviousMultiplierData(bufferData);
                // previousMultiplierData = multiplierData;
                setVisible(true);
              }}
              rounded
            />
          </div>
          <br />
          <Dialog
            header="Select Multipliers for the Data"
            visible={visible}
            modal={false}
            position={"right"}
            style={{ width: "20vw" }}
            onHide={() => {
              closeDialog();
            }}
            footer={footerContent}
          >
            {DialogBody}
          </Dialog>{" "}
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <Plot data={data} layout={layout} />
    </React.Fragment>
  );
}
