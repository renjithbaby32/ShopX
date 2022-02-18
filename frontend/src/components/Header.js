import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar
        variant="dark"
        style={{ backgroundColor: '#000' }}
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ShopX</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="first-nav">
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to={`/category/smartphone`}
              >
                <Nav.Link>Smartphones</Nav.Link>
              </LinkContainer>
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to={`/category/laptop`}
              >
                <Nav.Link>Laptops</Nav.Link>
              </LinkContainer>
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to="/category/others"
              >
                <Nav.Link>Everything else</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="ml-auto">
              <SearchBox />
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to="/wishlist"
              >
                <Nav.Link>
                  <i className="fas fa-heart"></i> Wishlist
                </Nav.Link>
              </LinkContainer>

              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to="/cart"
              >
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  className="px-3"
                  title={
                    <span style={{ color: 'white' }}>{userInfo.name}</span>
                  }
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer style={{ color: 'white' }} to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={
                    <span style={{ color: 'white', paddingLeft: '1rem' }}>
                      Admin
                    </span>
                  }
                  id="adminmenu"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/offers">
                    <NavDropdown.Item>Offers and Coupons</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/categories">
                    <NavDropdown.Item>Categories</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderreport">
                    <NavDropdown.Item>Order Report</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/salesreport">
                    <NavDropdown.Item>Sales Report</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
