import React from "react";

const Home = () => {
  return <h1>Welcome to Meter Data Archival Application</h1>;
};

export default Home;

// import React from "react";
// import { useSpring, animated } from "react-spring";
// import meterImage from "../../GI-Nav.png";

// const Home = () => {
//   const springProps = useSpring({
//     from: { opacity: 0, marginTop: -50 },
//     to: { opacity: 1, marginTop: 0 },
//     config: { duration: 1000 },
//   });

//   return (
//     <div className="home-container">
//       <animated.div style={springProps}>
//         <h1>Welcome to the Meter Data Archival Web Application</h1>
//       </animated.div>
//       <animated.div style={springProps}>
//         <p>
//           This application allows you to manage and archive meter data
//           efficiently.
//         </p>
//       </animated.div>
//       <animated.img
//         src={meterImage}
//         alt="Meter Data"
//         style={springProps}
//         className="meter-image"
//       />
//     </div>
//   );
// };

// export default Home;
