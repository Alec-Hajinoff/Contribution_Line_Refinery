import React from "react";
import "./MainRegLog.css";
import Main from "./Main.js";
import UserRegistration from "./UserRegistration.js";
import UserLogin from "./UserLogin.js";

function MainRegLog() {
  return (
    <div className="container text-center">
      <div className="row">
        <div className="col-12 col-md-9">
          <Main />
        </div>
        <div className="col-12 col-md-3">
          <p className="section-divider">New client? Please register:</p>
          <UserRegistration />
          <p className="section-divider">Existing client? Please login:</p>
          <UserLogin />
        </div>
      </div>
    </div>
  );
}

export default MainRegLog;
