import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser, updateUser } from '../actions/userActions'

const UserListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const alert = useAlert()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  const userUpdate = useSelector((state) => state.userUpdate)
  const { success: successUpdate } = userUpdate

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure to delete this  user?')) {
      dispatch(deleteUser(id))
      alert.success('User has been deleted')
    }
  }

  const blockHandler = (user) => {
    if (window.confirm('Do you want to block this user?')) {
      dispatch(updateUser({ ...user, isBlocked: true }))
      alert.success('User has been blocked')
    }
  }

  const unblockHandler = (user) => {
    if (window.confirm('Unblock this user?')) {
      dispatch(updateUser({ ...user, isBlocked: false }))
      alert.success('User has been unblocked')
    }
  }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      navigate('/login')
    }
  }, [dispatch, userInfo, successUpdate, successDelete])

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>BLOCKED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {user.isBlocked ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="primary"
                    className="btn-sm"
                    onClick={() => blockHandler(user)}
                  >
                    <i className="fas fa-user-lock"></i>
                  </Button>
                  <Button
                    variant="success"
                    className="btn-sm"
                    onClick={() => unblockHandler(user)}
                  >
                    <i className="fas fa-unlock-alt"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
