import React from "react";
import './Row.css';


export interface IFilteredFieldDesc {
  name: string
  title?: string
  component?: React.FC<any>
}

export type IFilteredField = IFilteredFieldDesc | string

export interface IListRowParams {
  item: any
  field: IFilteredField
}

const getElementFromField = (item: any, field: IFilteredField) => {
  const fieldDesc = field as IFilteredFieldDesc

  const names = fieldDesc.name ? fieldDesc.name.split('.') : (field as string).split('.')
  const element = item[names[0]]

  return { element, name: names[0], names }
}

export const ListRowItem: React.FC<IListRowParams> = ({ item, field }) => {
  const { element, name, names } = getElementFromField(item, field)

  if (!element) {
    return (<>ERR NOT EXIST:{name}</>)
  }

  if ((field as IFilteredFieldDesc).component) {
    const component = (field as IFilteredFieldDesc).component
    return (<>{component && component({ value: element, names, item })}</>)
  }

  if (element.substr && element.length > 50) {
    return (<>{element.substr(0, 47)}...</>)
  }

  if (element.push && element.reduce && names.length > 1) {
    return (<>{(element as any[]).reduce((p, e) => p + e[names[1]], '')}</>)
  }

  return (
    <>
      {element}
    </>
  );
};

