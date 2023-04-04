// import React, { useState } from "react";
// import { MultiSelect } from "primereact/multiselect";
// import METER_LOGO from "./staticFiles/imageFiles/Meter.png";

// export default function GroupedDoc() {
//   const [selectedCities, setSelectedCities] = useState(null);

//   const foo = (arr) => {
//     var map = {};

//     console.log(arr);

//     for (let idx = 0; idx < arr.length; idx++) {
//       // console.log("Checkinhg at start");
//       // console.log(arr);
//       // console.log(map);
//       // console.log(arr[i].split(" "));

//       let meter = arr[idx].split(" ")[0];
//       let polarity = arr[idx].split(" ")[1];

//       if (map[meter]) {
//         let delPolarity = meter + " " + map[meter] + " Polarity";
//         console.log(delPolarity);

//         let arrSet = new Set(arr); // a = Set(5) {1, 2, 3, 4, 5}
//         arrSet.delete(delPolarity); // a = Set(5) {1, 2, 4, 5}
//         arr = Array.from(arrSet); // [1, 2, 4, 5]
//       }

//       map[meter] = polarity;
//       console.log("Check");
//       console.log(arr);
//       console.log(map);
//     }
//     // map = {};

//     setSelectedCities(arr);
//     console.log(arr);
//   };

//   const groupedCities = [
//     {
//       label: "FK-01 label",
//       code: "FK-01 code",
//       items: [
//         {
//           value: "FK-01 Default Polarity",
//           name: "FK-01 Default",
//         },
//         {
//           value: "FK-01 Opposite Polarity",
//           name: "FK-01 Opposite",
//         },
//       ],
//     },
//     {
//       label: "FK-02 label",
//       code: "FK-02 code",
//       items: [
//         {
//           value: "FK-02 Default Polarity",
//           name: "FK-02 Default",
//         },
//         {
//           value: "FK-02 Opposite Polarity",
//           name: "FK-02 Opposite",
//         },
//       ],
//     },
//     {
//       label: "FK-03 label",
//       code: "FK-03 code",
//       items: [
//         {
//           value: "FK-03 Default Polarity",
//           name: "FK-03 Default",
//         },
//         {
//           value: "FK-03 Opposite Polarity",
//           name: "FK-03 Opposite",
//         },
//       ],
//     },
//     {
//       label: "FK-04 label",
//       code: "FK-04 code",
//       items: [
//         {
//           value: "FK-04 Default Polarity",
//           name: "FK-04 Default",
//         },
//         {
//           value: "FK-04 Opposite Polarity",
//           name: "FK-04 Opposite",
//         },
//       ],
//     },
//     {
//       label: "FK-05 label",
//       code: "FK-05 code",
//       items: [
//         {
//           value: "FK-05 Default Polarity",
//           name: "FK-05 Default",
//         },
//         {
//           value: "FK-05 Opposite Polarity",
//           name: "FK-05 Opposite",
//         },
//       ],
//     },
//   ];

//   const groupedItemTemplate = (option) => {
//     return (
//       <div className="flex align-items-center">
//         <img
//           alt={option.label}
//           src={METER_LOGO}
//           className={`mr-2 flag flag-${option.code.toLowerCase()}`}
//           style={{ width: "18px" }}
//         />
//         <div>{option.label}</div>
//       </div>
//     );
//   };

//   return (
//     <div className="card flex justify-content-center">
//       <MultiSelect
//         value={selectedCities}
//         options={groupedCities}
//         onChange={(e) => {
//           foo(e.value);
//           // console.log(selectedCities);
//         }}
//         optionLabel="name"
//         optionGroupLabel="label"
//         optionGroupChildren="items"
//         optionGroupTemplate={groupedItemTemplate}
//         placeholder="Select Cities"
//         className="w-full md:w-20rem"
//       />
//     </div>
//   );
// }

import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function MaximizableDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="card flex justify-content-center">
      <Button
        label="Show"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
      />
      <Dialog
        header="Header"
        visible={visible}
        maximizable
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </div>
  );
}
