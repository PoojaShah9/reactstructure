import React from "react";
import "./login.css";
import axios from "axios";
import urls from "../../url";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false,
            loading: false,
            errors: {
                email: '',
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {email, password, errors} = this.state;

        console.log('state', this.state);
        // stop here if form is invalid
        if (!(email && password && errors.email)) {
            return;
        }

        this.setState({loading: true});
        axios.post(`${urls.API}/user/login`, this.state)
            .then(user => {
                console.log('user res', user);
                alert('Login Successfully..!');
                window.location = '/dashboard';
                this.setState({
                    password: '',
                    email: ''
                });
            })
            .catch((error) => {
                this.setState({
                    password: '',
                    email: ''
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
            default:
                break;
        }
        this.setState({errors, [name]: value});
    }

    render() {
        const {email, password, submitted, loading, errors} = this.state;
        return (
            <body>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-xl-6 mx-auto">
                        <div className="card card-signin flex-row my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign In</h5>
                                <form noValidate className="form-signin" name="form" onSubmit={this.handleSubmit}>
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
                                    </div>

                                    <button className="btn btn-lg btn-primary btn-block text-uppercase"
                                            type="submit" disabled={loading}>Sign In
                                    </button>
                                    <a className="d-block text-center mt-2 small" href="/register">Sign Up</a>
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

export {Login};
