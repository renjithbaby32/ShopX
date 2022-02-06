import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'

const DashboardScreen = () => {
  const [products, setProducts] = React.useState([])
  const [info, setInfo] = React.useState()
  const [infoLastMonth, setInfoLastMonth] = React.useState()
  const [info2, setInfo2] = React.useState()
  const [info3, setInfo3] = React.useState()
  const [lower, setLower] = React.useState('2000-01-01')
  const [upper, setUpper] = React.useState('2040-01-01  ')

  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()
  const currentMonth = `${yyyy}-${mm}-${dd}`
  const previousMonth1 = `${mm - 1 > 0 ? yyyy : yyyy - 1}-${
    mm - 1 > 0 ? mm - 1 : 12 + mm
  }-${dd}`
  const previousMonth2 = `${mm - 2 > 0 ? yyyy : yyyy - 1}-${
    mm - 2 > 0 ? mm - 2 : 12 + Number(mm) - 2
  }-${dd}`
  const previousMonth3 = `${mm - 3 > 0 ? yyyy : yyyy - 1}-${
    mm - 3 > 0 ? mm - 3 : 12 + Number(mm) - 3
  }-${dd}`
  const previousMonth4 = `${mm - 2 > 0 ? yyyy : yyyy - 1}-${
    mm - 4 > 0 ? mm - 4 : 12 + Number(mm) - 4
  }-${dd}`

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const fetchData = async () => {
    const { data } = await axios.get(
      `/api/orders/report/${currentMonth}?lower=${previousMonth1}`
    )
    setProducts(data.products)
    setInfo(data)

    const responsePrevious1Month = await axios.get(
      `/api/orders/report/${previousMonth1}?lower=${previousMonth2}`
    )
    setInfoLastMonth(responsePrevious1Month.data)

    const responsePrevious2Month = await axios.get(
      `/api/orders/report/${previousMonth2}?lower=${previousMonth3}`
    )
    setInfo2(responsePrevious2Month.data)

    const responsePrevious3Month = await axios.get(
      `/api/orders/report/${previousMonth3}?lower=${previousMonth4}`
    )
    setInfo3(responsePrevious3Month.data)
  }

  ChartJS.register(
    ArcElement,
    CategoryScale,
    PointElement,
    LineElement,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  )

  const labels = [
    previousMonth4 + ' - ' + previousMonth3,
    previousMonth3 + ' - ' + previousMonth2,
    previousMonth2 + ' - ' + previousMonth1,
    previousMonth1 + ' - ' + currentMonth,
  ]

  const data = {
    labels,
    datasets: [
      {
        label: `Total amout`,
        data: [
          info3 && info3.total,
          info2 && info2.total,
          infoLastMonth && infoLastMonth.total,
          info && info.total,
        ],
        backgroundColor: 'rgba(177, 252, 3, 0.5)',
      },
      {
        label: `Paid amout`,
        data: [
          info3 && info3.paid,
          info2 && info2.paid,
          infoLastMonth && infoLastMonth.paid,
          info && info.paid,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: `Pending amout`,
        data: [
          info3 && info3.unpaidAmount,
          info2 && info2.unpaidAmount,
          infoLastMonth && infoLastMonth.unpaidAmount,
          info && info.unpaidAmount,
        ],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  const quantityData = {
    labels,
    datasets: [
      {
        label: `Total quantity sold`,
        data: [
          info3 && info3.qty,
          info2 && info2.qty,
          infoLastMonth && infoLastMonth.qty,
          info && info.qty,
        ],
        backgroundColor: 'rgba(177, 252, 3, 0.5)',
      },
    ],
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Consolidated Revenue (Monthly)',
      },
    },
  }

  const optionsForQuantity = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Quantity Sold (Monthly)',
      },
    },
  }

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    }

    fetchData()
  }, [dispatch, userInfo])

  return (
    <>
      <Bar className="container" data={data} options={options} />
      <Line
        className="container"
        data={quantityData}
        options={optionsForQuantity}
      />
    </>
  )
}

export default DashboardScreen
