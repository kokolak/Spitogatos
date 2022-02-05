import './App.css';
import LoginPage from './pages/LoginPage'
import HomePage from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react';
import { GlobalContextProvider } from './context/GlobalContext'
import { Navigate } from 'react-router-dom';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.changeUser = this.changeUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  state = {
    user: {}
  }

  changeUser(u) {
    this.setState({
      user: u
    })
  }

  logout() {
    console.log('dfsdsfsdfsd')
    axios.post(`http://localhost:8080/logout`)
      .then(res => {
        this.setState({
          user: {}
        })
      })
  }

  render() {
    const { user } = this.state
    let isLoggedIn = (Object.keys(user).length === 0 && user.constructor === Object)
    return (
      <GlobalContextProvider value={{ user }}>
        <Router>
          <Routes>
            <Route exact path="/" element={<LoginPage setUser={this.changeUser} />} />
            <Route exact path="/login" element={<LoginPage setUser={this.changeUser} />} />
            <Route exact path="/home" element={isLoggedIn ? <LoginPage setUser={this.changeUser} /> : <HomePage user={user} logout={this.logout} />} />
          </Routes>
        </Router>
      </GlobalContextProvider>
    );
  }

}

export default App;
