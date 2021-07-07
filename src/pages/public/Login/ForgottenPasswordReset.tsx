import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { changeState, login } from "../../../app/reducers/userSlice";
import { isPasswordValid, passwordStrong } from "../../../app/utils";
import PasswordComponent from "./PasswordComponent";

export const FORGOTTEN_PASSWORD_CHECK_MUTATION = loader('./graphql/forgotten-password-check.gql')
export const FORGOTTEN_PASSWORD_RESET_MUTATION = loader('./graphql/forgotten-password-reset.gql')


export const ForgotenPasswordReset: React.FC<any> = ({ match }) => {
  const token = _.get(match, 'params.token')
  const [password, setPassword] = useState("");
  const [copy, setCopy] = useState("");

  const history = useHistory()
  const dispatch = useDispatch()

  const [doForgottenPasswordCheck, { loading: loadingForgottenPasswordCheck, data: dataForgottenPasswordCheck }] = useMutation(FORGOTTEN_PASSWORD_CHECK_MUTATION, {
    errorPolicy: "none",
  });

  const [doForgottenPasswordReset, { loading, data }] = useMutation(FORGOTTEN_PASSWORD_RESET_MUTATION, {
    errorPolicy: "none",
  });


  const { 1: setInvalidPass } = useState(false);
  const [strong, setStrong] = useState(passwordStrong(''))
  const [invalidCopy, setInvalidCopy] = useState(false);

  useEffect(() => {
    const doCheck = async () => {
      try {
        await doForgottenPasswordCheck({ variables: { token } })
      } catch (ex) {

      } finally {
      }

    }

    doCheck()

  }, [token, doForgottenPasswordCheck])

  const onReset = async () => {
    if (!strong.valid) {
      return
    }

    if (password !== copy) {
      setInvalidCopy(true)
      return
    }

    try {
      dispatch(changeState('processing'))
      const { data } = await doForgottenPasswordReset({ variables: { token, password } })
      dispatch(login(data.reset))
      history.replace('/user/projects')
    } catch (ex) {
      console.log('onError', data)

    }

  };

  const onPasswordChange = (event: any) => {
    const pass = event.target.value as string

    setPassword(pass);
    const valid = isPasswordValid(pass)
    setInvalidPass(!valid);
    setStrong(passwordStrong(pass))
  };

  const onCopyChange = (event: any) => {
    const c = event.target.value
    setCopy(c)
    setInvalidPass(false)

    if (c === password) {
      setInvalidCopy(false)
    }
  };

  if (loadingForgottenPasswordCheck) {
    return (<Alert variant={"success"}>Checking token</Alert>)
  } else if (dataForgottenPasswordCheck && dataForgottenPasswordCheck.check && dataForgottenPasswordCheck.check.status === 'valid') {
    return (<>
      <section id="subheader" data-bgimage="url(images/background/5.png) bottom">
        <div className="center-y relative text-center" data-scroll-speed="4">
          <div className="container">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <form action='blank.php' className="row" id='form_subscribe' method="post" name="myForm">
                  <div className="col-md-12 text-center">
                    <h1>User Password Reset</h1>
                    <p>You will be back soon</p>
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
                  {/* {invalidPass && (<Alert variant={"danger"}>The password have to contain capital letter,lower letter, a number and must be 6-16 characters long</Alert>)}   */}
                  {invalidCopy && (<Alert variant={"danger"}>The retyped password is not the same</Alert>)}
                  <PasswordComponent password={password} onPasswordChange={onPasswordChange} strongPassword={strong} />

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
                  {!loading && <Button className="btn-round" variant="primary" onClick={() => onReset()} disabled={!strong.valid}>Reset password</Button>}
                  {loading && <Button className="btn-round" variant="primary" disabled>Loading...</Button>}

                  <div className="clearfix"></div>


                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
    );
  } else {
    return (<Alert variant={"danger"}>The <b>{token}</b> is not valid or already used</Alert>)
  }


};

export default ForgotenPasswordReset;
