import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";

export const ConnectBase: React.FC<{ value: any, names?: any, gql: any, item: any }> = ({ value, names, gql, item }) => {
  const element = value
  const name = names.length > 1 && names[1]
  const elementTitle = element.push && element.reduce && names.length > 1 ? (element as any[]).reduce((p, e) => p + `, ${e[name]}`, '').substr(2) : element

  const [title, setTitle] = useState(elementTitle)
  const [data, setData] = useState<any[]>([])

  useQuery(gql.QUERY, {
    onCompleted: (iraw) => {

      const dataFields = Object.getOwnPropertyNames(iraw)
      if (dataFields.length > 0 && iraw[dataFields[0]].length > 0) {
        const raw = iraw[dataFields[0]]

        const final = raw.map((r: any) => ({
          id: r.id,
          checked: title.indexOf(r[name]) !== -1,
          label: r[name]
        }))

        setData(final)
      } else {
        setData([])
      }

    },
  });

  const [addMutation] = useMutation(gql.ADD, { errorPolicy: "none" })

  const [removeMutation] = useMutation(gql.REMOVE, { errorPolicy: "none" })

  const onChecked = (value: any) => {
    const updated = data.map((d: any) => {
      if (d.label === value.label) {
        d.checked = !d.checked
      }
      return { ...d }
    })

    const updateTitle = (updated as any[]).reduce((p, e) => {
      if (e.checked) return `${p}, ${e.label}`
      else return p
    }, '').substr(1)

    if (value.checked) {
      addMutation({
        variables: {
          id1: value.id,
          id2: item.id
        }
      });
    } else {
      removeMutation({
        variables: {
          id1: value.id,
          id2: item.id
        }
      });
    }


    setData(updated)
    setTitle(updateTitle)
  }

  // if(element.push && element.reduce && names.length > 1) {
  //   return (<>ahoj: {(element as any[]).reduce((p, e)=>p + e[names[1]], '')}</>)
  // }

  return (<DropdownButton id="dropdown-basic-button" title={title}>
    {data && data.map((d: any) => (
      <Dropdown.Item onClick={(e: any) => onChecked(d)} >
        <Form.Check
          type="checkbox"
          label={d.label}
          checked={d.checked} />
      </Dropdown.Item>))
    }
  </DropdownButton>)
}

export default ConnectBase