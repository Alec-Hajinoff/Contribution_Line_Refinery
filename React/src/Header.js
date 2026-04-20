import React from "react";
import { Link } from "react-router-dom";
import blue from "./ContributionLineLogoColoured.png";
import "./Header.css";

function Header() {
  return (
    <div className="container">
      <div className="row">
        <div className="logo-container">
          <Link to="/">
            <img
              id="logo"
              src={blue}
              alt="A company logo"
              title="A company logo"
            />
          </Link>
        </div>
      </div>
      <div className="row-auto">
        <br />
      </div>
    </div>
  );
}

export default Header;
