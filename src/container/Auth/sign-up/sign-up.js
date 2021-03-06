import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { emailValidator, passwordValidator, confirmPasswordValidator, TextValidator} from '../../../shared/validators/Validators'
import { succesSwal, errorSwal} from '../../../components/swal/Swal';
import { setUserFirstName, authToken, authData} from '../../../redux/actions/authActions'
import { loading} from '../../../redux/actions/loaderActions'
import { signupUser } from'../../../apis/authApi';
import Header from '../../../container/Layout/Header';

import styles from '../sign-in/login-style.module.css'
import { SignupText, SignupButton } from "../../screens/LandingScreen/style";


class SignUp extends Component {

    constructor(props) {
      super(props)
    
      this.state = {
        fullName:'',
        email:'',
        password:'',
        confirmPassword:'',
        show_hide:false,
        show_hide2:false
      };
    };
    
    componentDidMount = () => {
        document.getElementById('root').scrollIntoView();;
        this.checkToken();
    }

    checkToken = () => {
        if(localStorage.getItem("token"))
        {
            this.props.history.push('/initial-assesment')
        }    
    }

    changeShowHide = ()=>{
        const hideShow = this.state.show_hide;
        if(hideShow)
        {
            this.setState({show_hide: false})
        }
        else
        {
            this.setState({show_hide: true})
        }       
    }

    changeShowHide2 = ()=>{
        const hideShow = this.state.show_hide2;
        if(hideShow)
        {
            this.setState({show_hide2: false})
        }
        else
        {
            this.setState({show_hide2: true})
        }       
    }

    handleChange=(event)=> {
        this.setState({
            [event.target.name]: event.target.value});
    }

    click = async(e)=> { 
        e.preventDefault();
        let errorStatus = false;

        let nameValidator = await TextValidator(this.state.fullName);
        let emailvalidator = await emailValidator(this.state.email);
        let passwordvalidator = await passwordValidator(this.state.password);
        let confirmPassValidator = await confirmPasswordValidator(this.state.password,this.state.confirmPassword);
        
        
        if(nameValidator){
            this.setState({nameError: nameValidator})
            errorStatus = true;
        }
        if(emailvalidator){
            this.setState({emailError: emailvalidator})
            errorStatus = true;
        }
        if(passwordvalidator){
            this.setState({passwordError: passwordvalidator})
            errorStatus = true;
        }
        if(confirmPassValidator){
            this.setState({confirmPasswordError: confirmPassValidator})
            errorStatus = true;
        }

        if(!errorStatus)
        {
            this.submitSignup();
        } 
                
    }

    submitSignup = async() => {
        this.props.loading(true);
        let response;

        response = await signupUser({email:this.state.email, password:this.state.password, name:this.state.fullName });
        
        if(response.status === 400){
            response = await response.json();
            errorSwal('oops',response.message);
            this.props.loading(false);
        }
        else if(response.status === 200)
        {
            response = await response.json();

            this.props.loading(false);
            succesSwal( response.message);
            localStorage.setItem("token",response.token);
            localStorage.setItem("firstName",response.user.name);
            this.props.setFirstName(response.user.name);
            this.props.setToken(response.token);


            this.props.history.push('/initial-assesment');
            
        }
    }

    render() {
        return (
            <div className="position-relative">
                <Header buttonText='signup'/>
                <div  className={`container ${styles.page_main}`} style={{width:'100%'}}>
                    <Row className="justify-content-center">
                        <div className="col-lg-6 col-md-8 col-12">
                            <SignupText isOk={true}>Sign up to <span style={{color:'#eab105'}}>Exhale</span></SignupText>
                            <form className="mt-4" onSubmit={this.click}>                                
                                    <Row>
                                        <Col xs={12} className="mt-2 mb-2">
                                            <label>Full Name</label>
                                            <span className="position-relative">
                                                <input type="text" placeholder="Enter your name" name="fullName" value={this.state.fullName}
                                                onChange={this.handleChange} maxLength="50"   required />
                                                {this.state.nameError && <span className='error'>{this.state.nameError}</span>}
                                            </span>                                           
                                        </Col> 
                                        <Col xs={12} className="mt-2 mb-2">                                  
                                            <label>Email</label>
                                            <span className="position-relative">
                                                <input type="text" placeholder="e.g. name@example.com" name="email" value={this.state.email}
                                                onChange={this.handleChange} maxLength="60"
                                                required />
                                                {this.state.emailError && <span className='error'>{this.state.emailError}</span>}
                                            </span>                                       
                                        </Col>
                                        <Col  xs={12} className="mt-2 mb-2">                                  
                                            <label>Password</label>
                                            <span className="position-relative">
                                                <input type={this.state.show_hide ? "text" : "password"} placeholder="Enter your password" name="password" value={this.state.password}
                                                onChange={this.handleChange} maxLength="30"
                                                required />
                                                <i className={this.state.show_hide ? "hide-show fa fa-eye" : "hide-show fa fa-eye-slash" } onClick={this.changeShowHide}></i>
                                            </span> 
                                            {this.state.passwordError && <span className='error'>{this.state.passwordError}</span>}
                                
                                        </Col>
                                        <Col xs={12} className="mt-2 mb-2">                                  
                                            <label>Confirm Password</label>
                                            <span className="position-relative">
                                                <input type={this.state.show_hide2 ? "text" : "password"} placeholder="Enter your password" 
                                                name="confirmPassword" value={this.state.confirmPassword}
                                                onChange={this.handleChange} maxLength="30"
                                                required />
                                                <i className={this.state.show_hide2 ? "hide-show fa fa-eye" : "hide-show fa fa-eye-slash" } onClick={this.changeShowHide2}></i>
                                            </span>   
                                            {this.state.confirmPasswordError && <span className='error'>{this.state.confirmPasswordError}</span>}                                   
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col xs={12} className="mt-2">
                                            <div className="my-3">
                                                <input type="checkbox" value="lsRememberMe" id="rememberMe" /> 
                                                <label className={`ml-3 ${styles.remember_label}`} htmlFor="rememberMe">I agree with</label>
                                                <Link className="pl-1" from="/signup" to="/termsandcondition">
                                                        Terms and Conditions
                                                </Link>
                                            </div>

                                            <SignupButton style={{width:'100%'}} type="submit" className="mt-4">Sign up</SignupButton>
                                            <Link from="/signup" to="/login">
                                                <SignupButton outline={true} style={{width:'100%'}} >Sign up as professional</SignupButton>
                                            </Link>
                                        </Col>
                                    </Row>
                                </form>                                                                           
                        </div>
                    </Row>
                                
                </div>

            </div>       
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loader.loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setToken        :   token           => {dispatch(authToken(token))},
        setFirstName    :   firstName       => {dispatch(setUserFirstName(firstName))},
        setLoginData    :   loginData       => {dispatch(authData(loginData))},
        loading         :   loadingStatus   => {dispatch(loading(loadingStatus))}    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));