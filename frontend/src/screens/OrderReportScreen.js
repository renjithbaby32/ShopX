import React, { useEffect, forwardRef } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { listOrders } from '../actions/orderActions'
import MaterialTable from 'material-table'
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons'

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const OrderReportScreen = () => {
  const columns = [
    { title: 'Order ID', field: '_id' },
    { title: 'User', field: 'user.name' },
    { title: 'Placed At', field: 'createdAt', type: 'date' },
    {
      title: 'Total amount',
      field: 'totalPrice',
      type: 'currency',
      currencySetting: {
        locale: 'en',
        currencyCode: 'inr',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    },
    {
      title: 'Order items',
      field: 'orderItems[0].name',
      type: 'string',
      sorting: true,
      searchable: true,
    },
    { title: 'Paid', field: 'isPaid' },
    { title: 'Dispatched', field: 'isPaid' },
    { title: 'Out for delivery', field: 'isPaid' },
    { title: 'Delivered', field: 'isPaid' },
  ]
  const data = [{ testing: 'testing' }]
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    }

    dispatch(listOrders())
  }, [dispatch, userInfo])

  return (
    <>
      <MaterialTable
        icons={tableIcons}
        data={orders}
        columns={columns}
        title={'Order Report'}
        options={{
          filtering: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
          exportButton: true,
          exportAllData: true,
        }}
      />
    </>
  )
}

export default OrderReportScreen
