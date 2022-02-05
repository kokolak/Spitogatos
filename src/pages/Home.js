import React from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import GlobalContext from '../context/GlobalContext'
import Api from "../webService/Api";
import Modal from 'react-bootstrap/Modal';
import { validation } from '../validations/Validations'

class HomePage extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openUpadteModal = this.openUpadteModal.bind(this);
        this.update = this.update.bind(this);
        this.upDateProp = this.upDateProp.bind(this);
        this.closeModalError = this.closeModalError.bind(this);
    }

    state = {
        user: this.props.user,
        properties: [],
        property: {
            region: "",
            price: "",
            availability: "",
            area: "",
            userId: this.props.user
        },
        updateModal: false,
        objToUpadte: {},
        errorList: [],
        errorFlag: false,
        deleteFlag: false
    }

    static context = GlobalContext;

    componentDidMount() {
        Api.call(
            "http://localhost:8080/user/properties",
            "POST",
            (result) => {
                console.log(result)
                this.setState({
                    properties: result
                });
            },
            (status) => {
                console.log(status)
            }, JSON.stringify(this.state.user)
        );

    }

    handleChange = (e) => {
        const numTest = /^([0-9]{0,255})$/;
        const { name, value } = e.target;
        const prop = this.state.property;
        if ((name === 'price' || name === 'area') && numTest.test(value)) {
            prop[name] = value;
            this.setState({
                property: prop
            })
        } else if (name === 'region' || name === 'availability') {
            prop[name] = value;
            this.setState({
                property: prop
            })
        }
    }

    update = (e) => {
        const numTest = /^([0-9]{0,255})$/;
        const { name, value } = e.target;
        const p = this.state.objToUpadte;
        if ((name === 'price' || name === 'area') && numTest.test(value)) {
            p[name] = value;
            this.setState({
                objToUpadte: p
            })
        } else if (name === 'region' || name === 'availability') {
            p[name] = value;
            this.setState({
                objToUpadte: p
            })
        }
    }

    onSubmit() {
        const errors = validation(this.state.property);
        if (errors.length > 0) {
            this.setState({
                errorList: errors,
                errorFlag: true
            })
        } else {
            Api.call(
                "http://localhost:8080/create/property",
                "POST",
                (result) => {
                    console.log(result)
                    Api.call(
                        "http://localhost:8080/user/properties",
                        "POST",
                        (result) => {
                            this.setState({
                                properties: result
                            });
                        },
                        (status) => {
                            console.log(status)
                        }, JSON.stringify(this.state.user)
                    );
                },
                (status) => {
                    console.log(status)
                }, JSON.stringify(this.state.property)
            );
        }


    }

    onDelete(id) {
        axios.post(`http://localhost:8080/delete/property/` + id)
            .then(res => {
                console.log(res)
                if (res.status == 200) {
                    const est = this.state.properties;
                    est.map((comp, i) => {
                        if (comp.propertyId === id) {
                            let itemRemove = est.indexOf(comp);
                            est.splice(itemRemove, 1);
                        }
                    })
                    this.setState({
                        properties: est,
                        deleteFlag: true
                    })
                }
            })
        // Api.call(
        //     "http://localhost:8080/delete/property/" + id,
        //     "POST",
        //     (result) => {
        //         console.log(result)
        //         Api.call(
        //             "http://localhost:8080/user/properties",
        //             "POST",
        //             (result) => {
        //                 this.setState({
        //                     properties: result
        //                 });
        //             },
        //             (status) => {
        //                 console.log(status)
        //             }, JSON.stringify(this.state.user)
        //         );
        //     },
        //     (status) => {
        //         console.log(status)
        //     }
        // );
    }

    openUpadteModal(id) {
        axios.get(`http://localhost:8080/property/` + id)
            .then(res => {
                console.log(res)
                this.setState({
                    updateModal: true,
                    objToUpadte: res.data
                })
            })
    }

    upDateProp() {
        const errors = validation(this.state.objToUpadte);
        if (errors.length > 0) {
            this.setState({
                errorList: errors,
                errorFlag: true
            })
        } else {
            axios.post(`http://localhost:8080/update/property`, this.state.objToUpadte)
                .then(res => {
                    console.log(res)
                    Api.call(
                        "http://localhost:8080/user/properties",
                        "POST",
                        (result) => {
                            this.setState({
                                properties: result,
                                updateModal: false
                            });
                        },
                        (status) => {
                            console.log(status)
                        }, JSON.stringify(this.state.user)
                    );
                })
        }
    }

    closeModal() {
        this.setState({
            updateModal: false,
            errorFlag: false,
            deleteFlag: false
        })
    }

    closeModalError() {
        this.setState({
            errorFlag: false
        })
    }


    render() {
        const { user, properties, property, updateModal, objToUpadte, errorFlag, errorList, deleteFlag } = this.state;
        console.log(property)
        if (user === {}) {
            <Navigate to="/login" />
        }
        const disableSubmit = (property.price === '' || property.area === '' || property.region === '' || property.availability === '')
        return (
            <>
                <div className="container" style={{ textAlign: "center" }}>
                    <h3 style={{ textAlign: "center", margin: "3rem 0 3rem 0" }}>Σύστημα διαχείρισης αγγελιών {user.username} <small><a href="#" onClick={this.props.logout} style={{ marginLeft: '1rem', fontSize: '15px' }} className="text-info">Logout</a></small></h3>
                    <div className="col-md-12" style={{ display: "flex" }}>
                        <div className="col-md-4" style={{ marginTop: "1rem" }}>
                            <div className="card" style={{ width: "18rem" }}>
                                <div className="card-body">
                                    <h5 className="card-title">Προσθήκη αγγελίας</h5>
                                    <p className="card-text">
                                        <div class="input-group input-group-sm mb-12">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Τιμή</span>
                                            </div>
                                            <input type="text" onChange={this.handleChange} value={property.price} name="price" id="price" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                        </div>
                                        <div class="input-group mb-12" style={{ margin: "1rem 0 1rem 0" }}>
                                            <div className="input-group-prepend" >
                                                <label className="input-group-text" for="region">Περιοχή</label>
                                            </div>
                                            <select className="custom-select" onChange={this.handleChange} value={property.region} name="region" id="region">
                                                <option selected value={''}>Choose...</option>
                                                <option value="Αθήνα">Αθήνα</option>
                                                <option value="Θεσσαλονίκη">Θεσσαλονίκη</option>
                                                <option value="Πάτρα">Πάτρα</option>
                                                <option value="Ηράκλειο">Ηράκλειο</option>
                                            </select>
                                        </div>
                                        <div class="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text" for="availability">Διαθεσιμότητα</label>
                                            </div>
                                            <select className="custom-select" onChange={this.handleChange} value={property.availability} name="availability" id="availability">
                                                <option selected value={''}>Choose...</option>
                                                <option value="1">Πώληση</option>
                                                <option value="0">Ενοικίαση</option>
                                            </select>
                                        </div>
                                        <div class="input-group input-group-sm mb-12" style={{ margin: "1rem 0 1rem 0" }}>
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Τετραγωνικά</span>
                                            </div>
                                            <input type="text" onChange={this.handleChange} value={property.area} name="area" id="area" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                        </div>

                                    </p>
                                    <button type="button" disabled={disableSubmit} onClick={this.onSubmit} className="btn btn-success">Προσθήκη</button>
                                </div>
                            </div>
                        </div>
                        {properties.length == 0 || properties === null ? <div className="col-md-8" style={{ textAlign: "center" }}><p style={{ color: 'red' }}>No Records Found</p></div> : <div className="col-md-8">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Πόλη</th>
                                        <th scope="col">Διαθεσιμότητα</th>
                                        <th scope="col">Τιμή</th>
                                        <th scope="col">Τετραγωνικά</th>
                                        <th scope="col">Ενέργειες</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((prop, i) => {
                                        return (
                                            <tr>
                                                {/* <th scope="row">{prop.propertyId}</th> */}
                                                <td>{prop.region}</td>
                                                <td>{prop.availability === 1 ? 'πώληση' : 'ενοικίαση'}</td>
                                                <td>{prop.price}</td>
                                                <td>{prop.area}</td>
                                                <td><button onClick={this.onDelete.bind(this, prop.propertyId)} type="button" class="btn-sm btn-danger">Διαγραφή</button></td>
                                                <td><button onClick={this.openUpadteModal.bind(this, prop.propertyId)} type="button" class="btn-sm btn-primary">Επεξεργασία</button></td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                        </div>}
                    </div>
                </div>
                <Modal show={updateModal} onHide={this.closeModal}>
                    <Modal.Body>
                        <h4>
                            Upadate Property
                        </h4>
                        <div>
                            <p className="card-text">
                                <div class="input-group input-group-sm mb-12">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Τιμή</span>
                                    </div>
                                    <input type="text" onChange={this.update} value={objToUpadte.price} name="price" id="priceUp" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                </div>
                                <div class="input-group mb-12" style={{ margin: "1rem 0 1rem 0" }}>
                                    <div className="input-group-prepend" >
                                        <label className="input-group-text" htmlFor="regionUp">Περιοχή</label>
                                    </div>
                                    <select className="custom-select" onChange={this.update} value={objToUpadte.region} name="region" id="regionUp">
                                        <option selected value={''}>Choose...</option>
                                        <option value="Αθήνα">Αθήνα</option>
                                        <option value="Θεσσαλονίκη">Θεσσαλονίκη</option>
                                        <option value="Πάτρα">Πάτρα</option>
                                        <option value="Ηράκλειο">Ηράκλειο</option>
                                    </select>
                                </div>
                                <div class="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <label className="input-group-text" htmlFor="availabilityUp">Διαθεσιμότητα</label>
                                    </div>
                                    <select className="custom-select" onChange={this.update} value={objToUpadte.availability} name="availability" id="availabilityUp">
                                        <option selected value={''}>Choose...</option>
                                        <option value="1">Πώληση</option>
                                        <option value="0">Ενοικίαση</option>
                                    </select>
                                </div>
                                <div class="input-group input-group-sm mb-12" style={{ margin: "1rem 0 1rem 0" }}>
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Τετραγωνικά</span>
                                    </div>
                                    <input type="text" onChange={this.update} value={objToUpadte.area} name="area" id="areaUp" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                                </div>

                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.upDateProp} className="btn btn-success">Update</button>
                        <button type="button" onClick={this.closeModal} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errorFlag} onHide={this.closeModalError}>
                    <Modal.Body>
                        <h4>
                            error
                        </h4>
                        {errorList.map((err, i) => {
                            return <p>{err.msg}</p>
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.closeModalError} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal show={deleteFlag} onHide={this.closeModal}>
                    <Modal.Body>
                        <h4>
                            Delete Success!!!
                        </h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick={this.closeModal} className="btn btn-primary">Close</button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}

export default HomePage;