import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import * as _ from 'lodash';
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { login } from "../../../app/reducers/userSlice";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($verifyToken: String!) {
    verifyEmail_v1(verifyToken: $verifyToken) {
      refreshToken
      token
      user {
        roles{name}
        id,
        email,
        verified
      }
    }
  }
`;

export const VerifyUser: React.FC<any> = ({ match }) => {
  const verifyToken = _.get(match, 'params.verifyToken')
  const [verified, setVerified] = useState(false);

  const history = useHistory()
  const dispatch = useDispatch()

  const [verify, { loading: verifying, data, error: verifiedError }] = useMutation(VERIFY_EMAIL_MUTATION, {
    errorPolicy: "none",
  });

  const doVerifyUser = async () => {
    try {
      const { data } = await verify({ variables: { verifyToken } })
      dispatch(login(data.verifyEmail_v1))
      setVerified(true)
      localStorage.setItem('user.verifyToken', verifyToken)
      setTimeout(() => {
        history.replace('/user/projects')
      }, 2000)
    } catch (ex) {
      console.log('onError', data)
    }

  };

  const onVerifyUser = () => {
    const previouslyVerified = localStorage.getItem('user.verifyToken')
    const userVerified = localStorage.getItem('user.verified') === 'true'

    // user probably comming with the same link
    // what was for his first verified
    if (userVerified && previouslyVerified === verifyToken) {
      history.replace('/user/projects')
    } else {
      doVerifyUser()
    }
  }

  useEffect(() => {
    if (verifyToken) {
      onVerifyUser()
    }
  })


  return (<section>
    <div className="center-y relative text-center" data-scroll-speed="4">
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {verified ? (<div className="alert alert-success" role="alert">Your account was verified <Button>Start creating</Button></div>) : null}
            {verifying ? (<div className="alert alert-dark" role="alert">Your accont is verifing...</div>) : null}
            {!verifyToken || verifiedError ? (<div className="alert alert-dark" role="alert">The code is invalid or already applyed</div>) : null}
          </div>
        </div>
      </div>
    </div>
  </section>)
};

export default VerifyUser;
