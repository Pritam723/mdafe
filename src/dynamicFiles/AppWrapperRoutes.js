import React, { useState } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import Home from "./dataFetching/Home";
import ReportGeneration from "./dataFetching/ReportGeneration";
import ComponentWiseDataFetch from "./dataFetching/ComponentWiseDataFetch";
import NoPage from "./dataFetching/NoPage";
import FetchMeterData from "./dataFetching/FetchMeterData";
import FetchActiveReactive from "./dataFetching/FetchActiveReactive";
import ConfigDataChangeLog from "./dataFetching/ConfigDataChangeLog";

export default function AppWrapperRoutes() {
  // const [activeIndex, setActiveIndex] = useState();

  const items = [
    {
      label: "Meter Data Archival Application",
      icon: "pi pi-fw pi-home",
      url: "/",
    },
    {
      label: "Fetch Data by Meter ID",
      icon: "pi pi-fw pi-id-card",
      url: "/dataByID",
    },
    // {
    //   label: "Fetch Data by Meter Number",
    //   icon: "pi pi-fw pi-language",
    //   url: "/dataByNo",
    // },

    // {
    //   label: "Active/Reactive Data by Meter ID",
    //   icon: "pi pi-fw pi-id-card",
    //   url: "/activeReactiveByID",
    // },
    // {
    //   label: "Active/Reactive Data by Meter Number",
    //   icon: "pi pi-fw pi-language",
    //   url: "/activeReactiveByNo",
    // },
    {
      label: "Component-wise Data Fetch",
      icon: "pi pi-fw pi-file-pdf",
      url: "/componentWiseData",
    },
    {
      label: "Configuration Files Change Log",
      icon: "pi pi-fw pi-file-edit",
      url: "/cfgLog",
    },
    {
      label: "Report Generation",
      icon: "pi pi-fw pi-file-pdf",
      url: "/reportGeneration",
    },
    // {
    //   label: "Necessary Files",
    //   icon: "pi pi-fw pi-cog",
    //   url: "/necessaryFiles",
    // },
  ];

  return (
    <BrowserRouter>
      <div className="col-12 md:col-12">
        <div className="card card-w-title">
          {/* <h5>TabMenu</h5> */}
          <TabMenu
            model={items}
            activeIndex={-1} // Do not point to any Index
            // onTabChange={(e) => setActiveIndex(e.index)}
          />
          <Routes>
            <Route exact path={"/"} element={<Home />} />
            <Route
              path={"/dataByID"}
              element={<FetchMeterData fetchBy="meterID" />}
            />
            <Route
              path={"/dataByNo"}
              element={<FetchMeterData fetchBy="meterNO" />}
            />
            <Route
              path={"/activeReactiveByID"}
              element={<FetchActiveReactive fetchBy="meterID" />}
            />
            <Route
              path={"/activeReactiveByNO"}
              element={<FetchActiveReactive fetchBy="meterNO" />}
            />{" "}
            <Route
              path={"/componentWiseData"}
              element={<ComponentWiseDataFetch />}
            />
            <Route path={"/cfgLog"} element={<ConfigDataChangeLog />} />{" "}
            <Route path={"/reportGeneration"} element={<ReportGeneration />} />
            {/* <Route path={"/necessaryFiles"} element={<Blogs />} /> */}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </div>
      </div>{" "}
    </BrowserRouter>
  );
}
