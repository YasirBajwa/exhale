import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, NavLink, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap"; //NavDropdown
import { setCurrentUser, authToken } from "../../../redux/actions/authActions";
// import { basePath } from '../../../apis/sharedApi';
import { LogoSvg } from "../../../assets/svgs";

import "./header-style.css";

class Header extends Component {
  clearToken = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    this.props.setToken(localStorage.getItem("token"));
    this.props.history.push("/");
    this.setState({ loggedin: true });
  };



  render() {
    return (
      <div>
        {/* <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                                <Navbar.Brand href="#home">React Bootstrap Navbar</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="mr-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <Nav.Link href="/about-us">Contact Us</Nav.Link>
                                    <Nav.Link href="/contact-us">About Us</Nav.Link>
                                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                                    </NavDropdown>
                                    </Nav>
                                    
                                </Navbar.Collapse>
                            </Navbar> */}

        <Navbar className="custom" collapseOnSelect sticky="top" expand="lg">
          <Navbar.Brand className="logo-image" as={Link} to="/">
            <LogoSvg />
          </Navbar.Brand>
          <span className="logo_text">LOGO</span>

          <Nav className="mr-auto"></Nav>
          <Nav>
            {this.props.token ? (
              <button
                className="navbar_button mt-0 mb-0"
                onClick={this.clearToken}
              >
                Logout
              </button>
            ) : (
              <>
                {this.props.buttonText === "signup" ? (
                  <NavLink className="nav-link" to="/login">
                    <button className="navbar_button mt-0 mb-0">Sign in</button>
                  </NavLink>
                ) : (
                  <NavLink className="nav-link" to="/signup">
                    <button className="navbar_button navbar_button2 mt-0 mb-0">
                      Sign up as professional
                    </button>
                  </NavLink>
                )}
              </>
            )}
          </Nav>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loader.loading,
    token: state.auth.userToken,
    firstName: state.auth.userFirstName,
    lastName: state.auth.userLastName,
    roleId: state.auth.roleId,
    userImage: state.auth.userImage,
    loginData: state.auth.loginData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    currentUserName: (username) => {
      dispatch(setCurrentUser(username));
    },
    setToken: (token) => {
      dispatch(authToken(token));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
