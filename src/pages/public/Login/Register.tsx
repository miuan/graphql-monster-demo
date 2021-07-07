import { useMutation } from "@apollo/client";
import { loader } from 'graphql.macro';
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from "../../../app/hooks";
import { changeState, login, UserToken } from "../../../app/reducers/userSlice";
import { isEmailValid, passwordStrong } from "../../../app/utils";
import PasswordComponent from "./PasswordComponent";

export const REGISTER_MUTATION = loader('./graphql/register.gql')

export const Register: React.FC = () => {
  const defaultPath = process.env.REACT_APP_DEFAULT_USER_PATH || '/user/dashboard'

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [copy, setCopy] = useState("");

  const history = useHistory()
  const dispatch = useAppDispatch();

  const [registerMutation, { loading, data }] = useMutation(REGISTER_MUTATION, {
    errorPolicy: "none",
  });

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailProbablyTaken, setEmailProbablyTaken] = useState(false);
  const [strong, setStrong] = useState(passwordStrong(''))

  const [invalidCopy, setInvalidCopy] = useState(false);

  const onRegister = async () => {
    if (!isEmailValid(email)) {
      return setInvalidEmail(true)
    }

    if (pass !== copy) {
      setInvalidCopy(true)
      return
    }

    try {
      dispatch(changeState('processing'))
      const { data } = await registerMutation({ variables: { email, pass } })
      const userToken = data.register_v1 as UserToken

      dispatch(login(userToken))

      history.replace(defaultPath)
    } catch (ex) {
      console.log('onError', data)
      setEmailProbablyTaken(true)
    }

  };

  const onEmailChange = (event: any) => {
    setEmail(event.target.value);
    setInvalidEmail(false);
    setEmailProbablyTaken(false)
  };

  const onPasswordChange = (event: any) => {
    const pass = event.target.value as string

    setPass(pass);
    setInvalidEmail(false);
    setStrong(passwordStrong(pass))
  };

  const onCopyChange = (event: any) => {
    const c = event.target.value
    setCopy(c)
    setInvalidEmail(false)

    if (c === pass) {
      setInvalidCopy(false)
    }
  };

  return (<>
    <section id="subheader" data-bgimage="url(images/background/5.png) bottom">
      <div className="center-y relative text-center" data-scroll-speed="4">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form action='blank.php' className="row" id='form_subscribe' method="post" name="myForm">
                <div className="col-md-12 text-center">
                  <h1>User Registration</h1>
                  <p>All big things starting here</p>
                </div>
                <div className="clearfix"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="no-top" data-bgimage="url(images/background/3.png) top">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form name="contactForm" id='contact_form' className="form-border" method="post" action='blank.php'>


              <Form>
                {invalidEmail && (<Alert variant={"danger"}>Email is not in good shape...</Alert>)}
                {emailProbablyTaken && (<Alert variant={"danger"}>Email is probably taken, did you <Link to="/forgotten-password">forgotten password</Link>?</Alert>)}
                {invalidCopy && (<Alert variant={"danger"}>The retyped password is not the same</Alert>)}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={onEmailChange}
                    value={email}
                    isInvalid={invalidEmail}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <PasswordComponent password={pass} onPasswordChange={onPasswordChange} strongPassword={strong} />

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Re-Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Retype Password"
                    onChange={onCopyChange}
                    value={copy}
                    isInvalid={invalidCopy}
                  />
                </Form.Group>
              </Form>

              <div id='submit' className="pull-left">
                {!loading && <Button className="btn-round" variant="primary" onClick={() => onRegister()}>Register</Button>}
                {loading && <Button className="btn-round" variant="primary" disabled>Loading...</Button>}

                <div className="clearfix"></div>

                <div className="spacer-single"></div>

                {/* <ul className="list s3">
                  <li>Or login with:</li>
                  <li><a href="#">Facebook</a></li>
                  <li><a href="#">Google</a></li>
                  <li><a href="#">Instagram</a></li>
                </ul> */}

              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default Register;
