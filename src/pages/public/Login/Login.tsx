import { useMutation } from '@apollo/client';
import { loader } from 'graphql.macro';
import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { changeState, login, UserToken } from '../../../app/reducers/userSlice';
import { getGraphqlMonsterClientAppRoot } from '../../../app/utils';
import { isEmailValid } from './utils';

export const LOGIN_QL = loader('./graphql/login.gql')

export const Login: React.FC = () => {
    const [email, setEmail] = useState(localStorage.getItem('user.email') || '')
    const [pass, setPass] = useState('')

    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidPass, setInvalidPass] = useState(false)

    const history = useHistory()
    const query = new URLSearchParams(history.location.search)
    const path = query.get('path')
    const role = query.get('role')
    const defaultPath = process.env.REACT_APP_DEFAULT_USER_PATH || '/user/dashboard'

    const dispatch = useAppDispatch();
    const [loginMutation, { loading }] = useMutation(LOGIN_QL, { errorPolicy: 'none' });

    const onLogin = async () => {
        if (!isEmailValid(email)) {
            return setInvalidEmail(true)
        }

        try {
            dispatch(changeState('processing'))
            const { data }: any = await loginMutation({ variables: { email, pass } })
            const userToken = data.login_v1 as UserToken

            dispatch(login(userToken))
            // go to path in case user want to reach some page before login
            // or go to default path
            history.replace(path || defaultPath)
        } catch (e) {
            setInvalidEmail(true)
            setInvalidPass(true)
            setPass('')
        }
    }

    const onEmailChange = (event: any) => {
        setEmail(event.target.value)
        setInvalidEmail(false)
        setInvalidPass(false)
    }

    const onPasswordChange = (event: any) => {
        setPass(event.target.value)
        setInvalidEmail(false)
        setInvalidPass(false)
    }

    const onBackClick = () => {
        history.goBack()
    }

    return (<>
        <section id="subheader" data-bgimage="url(images/background/5.png) bottom">
            <div className="center-y relative text-center" data-scroll-speed="4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <form action='blank.php' className="row" id='form_subscribe' method="post" name="myForm">
                                <div className="col-md-12 text-center">
                                    <h1>User Login</h1>
                                    <p>We was missed you already</p>
                                    {role && <Alert variant={'warning'}>You trying to reach part what is under registered user with <b>{role}</b> role protection. <Link to={'/'} onClick={onBackClick}>Please take me back</Link></Alert>}
                                    {(!role && path) && <Alert variant={'warning'}>You trying to reach part what is under registered user protection. <Link to={'/'} onClick={onBackClick}>Please take me back</Link></Alert>}
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
                        <Form name="contactForm" id='contact_form' className="form-border" >
                            {!invalidPass && <h3>Login to your account</h3>}
                            {invalidPass && <Alert variant={'danger'}>Email or password is not valid. Did You <Link to="/forgotten-password">forgotten your password</Link>?</Alert>}
                            {invalidEmail && (<Alert variant={"danger"}>Email is not in good shape...</Alert>)}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="text" placeholder="Enter email" onChange={onEmailChange} value={email} isInvalid={invalidEmail} />
                            </Form.Group>


                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' onChange={onPasswordChange} value={pass} isInvalid={invalidPass} />
                                <Form.Text className="text-muted">
                                    We'll never share your password with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <div id='submit' className="pull-left">
                                {!loading && <Button className="btn-round" variant="primary" onClick={() => onLogin()}>Login</Button>}
                                {loading && <Button className="btn-round" variant="primary" disabled>Loading...</Button>}
                                <div className="clearfix"></div>

                                <div className="spacer-single"></div>

                                <ul className="list s3">
                                    <li>Or login with:</li>
                                    <li><a href={`${getGraphqlMonsterClientAppRoot()}/auth/github`}>GitHub</a></li>
                                    <li><a href={`${getGraphqlMonsterClientAppRoot()}/auth/facebook`}>Facebook</a></li>
                                    <li><a href={`${getGraphqlMonsterClientAppRoot()}/auth/google`}>Google</a></li>
                                </ul>

                            </div>

                        </Form>
                    </div>
                </div>
            </div>
        </section>
    </>)
}

export default Login