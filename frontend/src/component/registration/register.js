import React from "react";
import "../login/login.css";
import axios from "axios";
import urls from "../../url";


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            email: '',
            password: '',
            lastName: '',
            submitted: false,
            loading: false,
            errors: {
                email: '',
                password: '',
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {firstName, lastName, password, email, errors} = this.state;

        console.log('state', this.state);
        // stop here if form is invalid
        if (!(firstName && lastName && password && email && errors.email && errors.password)) {
            return;
        }

        this.setState({loading: true});

        axios.post(`${urls.API}/user`, this.state)
            .then(user => {
                this.setState({
                    firstName: '',
                    lastName: '',
                    password: '',
                    email: '',
                    submitted: false
                });
                window.location = '/';
            })
            .catch((error) => {
                this.setState({
                    firstName: '',
                    lastName: '',
                    password: '',
                    email: '',
                    submitted: false
                });
                console.log(error);
            });
    }

    handleChange(e) {
        const {name, value} = e.target;
        let errors = this.state.errors;
        const validEmailRegex = RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        switch (name) {
            case 'email':
                errors.email =
                    validEmailRegex.test(value)
                        ? true
                        : false;
                break;
            case 'password':
                errors.password =
                    value.length < 6
                        ? false
                        : true;
                break;
            default:
                break;
        }
        this.setState({errors, [name]: value});
    }

    render() {
        const {firstName, lastName, password, email, submitted, loading, errors} = this.state;
        return (
            <body>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-xl-6 mx-auto">
                        <div className="card card-signin flex-row my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign Up</h5>
                                <form noValidate className="form-signin" name="form" onSubmit={this.handleSubmit}>
                                    <div className="form-label-group">
                                        <input type="text" id="inputfirstName" className="form-control"
                                               placeholder="First Name" required name="firstName"
                                               value={firstName} onChange={this.handleChange}/>
                                        <label htmlFor="inputfirstName">First Name</label>
                                        {submitted && !firstName &&
                                        <div className="text-danger">First Name is required</div>
                                        }
                                    </div>
                                    <div className="form-label-group">
                                        <input type="text" id="inputlastName" className="form-control"
                                               placeholder="Last Name" required autoFocus name="lastName"
                                               value={lastName} onChange={this.handleChange}/>
                                        <label htmlFor="inputlastName">Last Name</label>
                                        {submitted && !lastName &&
                                        <div className="text-danger">Last Name is required</div>
                                        }
                                    </div>

                                    <div className="form-label-group">
                                        <input type="email" id="inputEmail" className="form-control"
                                               placeholder="Email" required name="email"
                                               value={email} onChange={this.handleChange}/>
                                        <label htmlFor="inputEmail">Email</label>
                                        {submitted && !email &&
                                        <div className="text-danger">Email is required</div>
                                        }
                                        {!errors.email && email &&
                                        <div className="text-danger">Email is not valid</div>}
                                    </div>

                                    <div className="form-label-group">
                                        <input type="password" id="inputPassword" className="form-control"
                                               placeholder="Password" required name="password"
                                               value={password} onChange={this.handleChange}/>
                                        <label htmlFor="inputPassword">Password</label>
                                        {submitted && !password &&
                                        <div className="text-danger">Password is required</div>
                                        }
                                        {!errors.password && password &&
                                        <div className="text-danger">Password must be 6 characters long!</div>}
                                    </div>

                                    <button className="btn btn-lg btn-primary btn-block text-uppercase"
                                            type="submit" disabled={loading}>Sign Up
                                    </button>
                                    <a className="d-block text-center mt-2 small" href="/">Sign In</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </body>
        );
    }
}

export {Register};
