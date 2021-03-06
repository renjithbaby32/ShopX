import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Container, Placeholder } from 'react-bootstrap'
import { ErrorBoundary } from 'react-error-boundary'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
// import UserListScreen from './screens/UserListScreen'
// import UserEditScreen from './screens/UserEditScreen'
// import ProductListScreen from './screens/ProductListScreen'
// import ProductEditScreen from './screens/ProductEditScreen'
// import ProductsByCategoryScreen from './screens/ProductsByCategoryScreen'
import CartScreen from './screens/CartScreen'
import WishListScreen from './screens/WishListScreen'
import CategoriesListScreen from './screens/CategoriesListScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderListScreen from './screens/OrderListScreen'
import AddCategoryScreen from './screens/AddCategoryScreen'
import OrderReportScreen from './screens/OrderReportScreen'
import SalesReportScreen from './screens/SalesReportScreen'
import OfferlistScreen from './screens/OfferlistScreen'
import OfferEditScreen from './screens/OfferEditScreen'
import CreateOfferScreen from './screens/CreateOfferScreen'
import DashboardScreen from './screens/DashboardScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import AddressEditScreen from './screens/AddressEditScreen'
import AddCouponScreen from './screens/AddCouponScreen'
// import ProfileScreen from './screens/ProfileScreen'
import FallbackScreen from './screens/FallbackScreen'
import AddressManageScreen from './screens/AddressManageScreen'
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'))
const UserListScreen = lazy(() => import('./screens/UserListScreen'))
const UserEditScreen = lazy(() => import('./screens/UserEditScreen'))
const ProductListScreen = lazy(() => import('./screens/ProductListScreen'))
const ProductEditScreen = lazy(() => import('./screens/ProductEditScreen'))
const ProductsByCategoryScreen = lazy(() =>
  import('./screens/ProductsByCategoryScreen')
)

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.SCALE,
}

const App = () => {
  const errorHandler = (error, errorInfo) => {
    console.log(error, errorInfo)
  }
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <AlertProvider template={AlertTemplate} {...options}>
            <ErrorBoundary
              FallbackComponent={FallbackScreen}
              onError={errorHandler}
            >
              <Suspense fallback={<h1>Loading...</h1>}>
                <Routes>
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/product/:id" element={<ProductScreen />} />
                  <Route
                    path="/admin/dashboard"
                    element={<DashboardScreen />}
                  />
                  <Route path="/admin/userlist" element={<UserListScreen />} />
                  <Route
                    path="/admin/categories"
                    element={<CategoriesListScreen />}
                  />
                  <Route
                    path="/admin/addcategory"
                    element={<AddCategoryScreen />}
                  />
                  <Route
                    path="/admin/user/:id/edit"
                    element={<UserEditScreen />}
                  />
                  <Route path="/cart/" element={<CartScreen />} />
                  <Route path="/cart/:id" element={<CartScreen />} />
                  <Route path="/wishlist" element={<WishListScreen />} />
                  <Route path="/shipping" element={<ShippingScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/order/:id" element={<OrderScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route
                    path="/addressmanage"
                    element={<AddressManageScreen />}
                  />

                  <Route
                    path="/admin/productlist"
                    element={<ProductListScreen />}
                    exact
                  />
                  <Route
                    path="/admin/productlist/:pageNumber"
                    element={<ProductListScreen />}
                    exact
                  />
                  <Route
                    path="/admin/orderlist"
                    element={<OrderListScreen />}
                    exact
                  />
                  <Route
                    path="/admin/offers"
                    element={<OfferlistScreen />}
                    exact
                  />
                  <Route
                    path="/admin/orderreport"
                    element={<OrderReportScreen />}
                    exact
                  />

                  <Route
                    path="/admin/salesreport"
                    element={<SalesReportScreen />}
                    exact
                  />
                  <Route
                    path="/admin/productsbycategory/:id"
                    element={<ProductsByCategoryScreen />}
                    exact
                  />
                  <Route
                    path="/admin/product/:id/edit"
                    element={<ProductEditScreen />}
                  />
                  <Route
                    path="/admin/offers/:id/edit"
                    element={<OfferEditScreen />}
                  />
                  <Route
                    path="/admin/offers/create"
                    element={<CreateOfferScreen />}
                  />
                  <Route
                    path="/admin/coupons/add"
                    element={<AddCouponScreen />}
                  />
                  <Route
                    path="/search/:keyword"
                    element={<HomeScreen />}
                    exact
                  />
                  <Route
                    path="/page/:pageNumber"
                    element={<HomeScreen />}
                    exact
                  />
                  <Route path="/category/:id" element={<HomeScreen />} exact />
                  <Route
                    path="/forgotPassword"
                    element={<ForgotPasswordScreen />}
                  />
                  <Route
                    path="/address/:id/edit"
                    element={<AddressEditScreen />}
                  />
                  <Route path="/" element={<HomeScreen />} exact />
                  <Route path="/*" element={<FallbackScreen />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AlertProvider>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
