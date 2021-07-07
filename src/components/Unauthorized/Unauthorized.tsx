import React from "react";
import { Alert } from 'react-bootstrap'

export const Unauthorized = ({where = ''}) => {
    return (<Alert variant={'danger'}>{`Unauthorized ${where} access`}</Alert>)
}

export default Unauthorized