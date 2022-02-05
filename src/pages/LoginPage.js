import React from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Api from "../webService/Api";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.register = this.register.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
        this.registerModal = this.registerModal.bind(this);
    }

    state = {
        user: {
            username: '',
            password: ''
        },
        userRegister: {
            username: '',
            password: ''
        },
        redirectToHomePage: false,
        modalFlag: false,
        modalFlagRegister: false,
        modalFlagSuccess: false,
        errorFlag: false,
        errorMsg: ''
    }

    componentDidMount() {
        console.log('component did mount')
    }

    handleChange = (e) => {
        const user = this.state.user;
        user[e.target.name] = e.target.value;
        this.setState({
            user: user
        })
    }

    handleChangeRegister = (e) => {
        const user = this.state.userRegister;
        user[e.target.name] = e.target.value;
        this.setState({
            userRegister: user
        })
    }

    handleLogin() {
        axios.post(`http://localhost:8080/login/user`, this.state.user)
            .then(res => {
                if (res.data !== null && res.data !== '') {
                    this.props.setUser(res.data);
                    this.setState({
                        redirectToHomePage: true
                    })
                } else {
                    this.setState({
                        modalFlag: true
                    })
                }
            })
    }

    closeModal() {
        this.setState({
            modalFlag: false,
            modalFlagRegister: false,
            modalFlagSuccess: false,
            errorFlag: false
        })
    }

    register() {
        axios.post(`http://localhost:8080/register/user`, this.state.userRegister)
            .then(res => {
                console.log(res)
            }).catch(err => {
                if (err.response.data.status === 1000) {
                    this.setState({
                        errorFlag: true,
                        errorMsg: err.response.data.errorMsg
                    })
                }
                console.log(err.response.data.errorMsg)
            })
        // Api.call(
        //     "http://localhost:8080/register/user",
        //     "POST",
        //     (result) => {
        //         this.setState({
        //             modalFlagSuccess: true,
        //             modalFlagRegister: false
        //         });
        //     },
        //     (status) => {
        //         console.log(status)
        //     }, JSON.stringify(this.state.userRegister)
        // );
    }

    registerModal() {
        this.setState({
            modalFlagRegister: true
        })
    }

    render() {
        const { redirectToHomePage, user, modalFlag, modalFlagRegister, userRegister, modalFlagSuccess } = this.state;
        console.log(userRegister);
        const disableLogin = user.username === '' || user.password === ''
        const disableRegister = userRegister.username === '' || userRegister.password === ''
        if (redirectToHomePage) {
            return <Navigate to='/home' />
        }
        return (
            <React.Fragment>
                <div id="login">
                    <h3 className="text-center text-white pt-5">Login form</h3>
                    <div className="container">
                        <div id="login-row" className="row justify-content-center align-items-center">
                            <div id="login-column" className="col-md-6">
                                <div id="login-box" className="col-md-12">
                                    <form id="login-form" className="form">
                                        <h3 className="text-center text-info">Login</h3>
                                        <div className="form-group">
                                            <label for="username" className="text-info">Username:</label><br />
                                            <input type="text" onChange={this.handleChange} name="username" id="user_n" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label for="password" className="text-info">Password:</label><br />
                                            <input type="password" onChange={this.handleChange} name="password" id="user_p" className="form-control" />
                                        </div>
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <input disabled={disableLogin} onClick={this.handleLogin} id="login_btn" name="submit" className="btn btn-info btn-md" value="login" />
                                        </div>
                                        <div id="register-link" className="text-right">
                                            <a href="#" onClick={this.registerModal} className="text-info">Register here</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={modalFlag} onHide={this.closeModal}>
                    <Modal.Body>
                        <h4>
                            Incorrect username or password
                        </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.closeModal} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={modalFlagSuccess} onHide={this.closeModal}>
                    <Modal.Body>
                        <h4>
                            You have been registered successfully
                        </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.closeModal} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={modalFlagRegister} onHide={this.closeModal}>
                    <Modal.Body>
                        <div id="login">
                            <h3 className="text-center text-white pt-5">Register form</h3>
                            <div id="login-row" className="row justify-content-center align-items-center">
                                <div id="login-column" className="col-md-6">
                                    <div id="login-box" className="col-md-12">
                                        <form id="login-form" className="form">
                                            <h3 className="text-center text-info">Register Form</h3>
                                            <div className="form-group">
                                                <label for="username" className="text-info">Username:</label><br />
                                                <input type="text" onChange={this.handleChangeRegister} name="username" id="user_n" className="form-control" />
                                            </div>
                                            <div className="form-group">
                                                <label for="password" className="text-info">Password:</label><br />
                                                <input type="password" onChange={this.handleChangeRegister} name="password" id="user_p" className="form-control" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer style={{ marginTop: '1rem', textAlign: 'center', justifyContent: 'center' }}>
                        <button disabled={disableRegister} onClick={this.register} className="btn btn-sm btn-success">register</button>
                        <button type="button" onClick={this.closeModal} className="btn btn-sm btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.errorFlag} onHide={this.closeModal}>
                    <Modal.Body>
                        <h4>
                            A user already exists
                        </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.closeModal} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
            </ React.Fragment>
        );
    }

}

export default LoginPage;