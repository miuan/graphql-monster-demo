import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { isEmailValid } from "../../../app/utils";

const FORGOTTEN_PASSWORD_REQUEST_MUTATION = loader('./graphql/forgotten-password-request.gql');

export const ForgottenPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false)

  const [doForgottenPassword, { loading, data, }] = useMutation(FORGOTTEN_PASSWORD_REQUEST_MUTATION, {
    errorPolicy: "none",
  });

  const onRequestSend = async () => {
    setEmailSent(false)
    if (email && isEmailValid(email)) {
      setInvalidEmail(false)
      try {
        await doForgottenPassword({ variables: { email } })
        setEmailSent(true)
      } catch (ex) {
        console.log('onError', data)
        setInvalidEmail(true)
      }
    } else {
      setInvalidEmail(true)
    }
  };

  const onEmailChange = (event: any) => {
    setEmail(event.target.value);
    setInvalidEmail(false);
  };

  if (emailSent) {
    return (
      <>
        <Alert variant={"success"}>We sent to You instruction to email {email}. Check your mailbox (don't forget check spam as well)</Alert>
      </>
    )
  }

  return (<>
    <section id="subheader" data-bgimage="url(images/background/5.png) bottom">
      <div className="center-y relative text-center" data-scroll-speed="4">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form action='blank.php' className="row" id='form_subscribe' method="post" name="myForm">
                <div className="col-md-12 text-center">
                  <h1>Forgotten Password</h1>
                  <p>Shortly You will be back</p>
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


              </Form>

              <div id='submit' className="pull-left">
                {!loading && <Button className="btn-round" variant="primary" onClick={() => onRequestSend()}>Send Recovery Link</Button>}
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
};

export default ForgottenPassword;
