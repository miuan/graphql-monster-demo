import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Header.css'


export const PublicHeader = () => (<div className="header-light transparent scroll-light container">
  <div className="row">
    <div className="col-md-2">
      <Dropdown>
        <Dropdown.Toggle variant="normal" id="dropdown-basic">
          Menu
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/">Home</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    <div className="header-text col-md-8">
      <div>
        This is public Header
      </div>
    </div>
    <div className="col-md-2">
      <Link className="" to="/login">Login</Link> or <Link className="" to="/register">Register</Link>
    </div>
  </div>
</div>)



export default PublicHeader