import { Outlet } from "react-router-dom";

import React from "react";

const Blogs = () => {
  return (
    <div>
      <h1>Under Development</h1>
      <Outlet />
    </div>
  );
};

export default Blogs;

// import React, { useState } from "react";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import { InputText } from "primereact/inputtext";

// export default function Multipliers() {
//   const [visible, setVisible] = useState(false);

//   const footerContent = (
//     <div>
//       <Button
//         label="Cancel"
//         icon="pi pi-times"
//         onClick={() => setVisible(false)}
//         className="p-button-text"
//       />
//       <Button
//         label="Save"
//         icon="pi pi-check"
//         onClick={() => setVisible(false)}
//         autoFocus
//       />{" "}
//     </div>
//   );

//   return (
//     <div className="card flex justify-content-center">
//       <Button
//         label="Set Multipliers"
//         icon="pi pi-external-link"
//         onClick={() => setVisible(true)}
//       />
//       <Dialog
//         header="Select Multipliers for the Meter Data"
//         visible={visible}
//         modal={false}
//         style={{ width: "50vw" }}
//         onHide={() => setVisible(false)}
//         footer={footerContent}
//       >
//         <React.Fragment>
//           FK-01:{" "}
//           <InputText
//             key="FK-01"
//             value={1}
//             onChange={(e) => {
//               console.log(e.target.value);
//               console.log(e);
//             }}
//             keyfilter="int"
//             className="p-inputtext-sm"
//             placeholder="Default multiplier is +1"
//           />
//           <br /> <br />
//         </React.Fragment>
//       </Dialog>
//     </div>
//   );
// }
