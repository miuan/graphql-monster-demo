import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom'

const UserHeader = ({ user, onLogout }: any) => (<div className="header-light transparent scroll-light container">
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

      <Dropdown>
        <Dropdown.Toggle variant="normal" id="dropdown-basic">
          Admin
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="/admin/users">Users</Dropdown.Item>
          <Dropdown.Item href="/admin/roles">Roles</Dropdown.Item>
        </Dropdown.Menu>

      </Dropdown>
    </div>
    <div className="header-text col-md-8">
      <div>
        This Header only for loged user with admin role
      </div>
    </div>
    <div className="col-md-2">
      <Dropdown>
        <Dropdown.Toggle variant="normal" id="dropdown-basic">
          User
        </Dropdown.Toggle>



        <Dropdown.Menu>
          <Dropdown.Item href="/"><Link to="/user/dashboard" >User Dashboard</Link></Dropdown.Item>
          <Dropdown.Item href="/"><Link className="" to="/" onClick={onLogout}>Logout</Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
</div>)

export default UserHeader