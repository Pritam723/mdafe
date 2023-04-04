import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import moment from "moment";

export default function PlotlyComponent({
  startDateTime,
  endDateTime,
  selectedMeters,
  fetchDataTrigger,
  fetchBy,
  isFetchingStateChanger,
  fetchDataType,
  energyType,
}) {
  const [data, setData] = useState();
  const [layout, setLayout] = useState();

  useEffect(() => {
    // console.log("Child UseEffect is called");
    // console.log(moment(startDateTime).format("DD-MM-YYYY HH:mm:ss"));
    // console.log(endDateTime);
    axios
      .post("/" + fetchDataType + "/" + fetchBy, {
        startDateTime: moment(startDateTime).format("DD-MM-YYYY HH:mm:ss"),
        endDateTime: moment(endDateTime).format("DD-MM-YYYY HH:mm:ss"),
        selectedMeters: selectedMeters,
        energyType: energyType,
      })
      .then((response) => {
        console.log(response.data);
        let data = [];

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
        setLayout(layout);

        // window.location.reload();
      })
      .then(() => {
        isFetchingStateChanger(false);
      })
      .catch((error) => {});
  }, [fetchDataTrigger]);

  return <Plot data={data} layout={layout} />;
}
