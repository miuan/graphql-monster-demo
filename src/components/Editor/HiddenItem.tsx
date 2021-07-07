import _ from 'lodash'
import React, { useEffect } from 'react'

export const HiddenItem = ({name, value, register, setValue, storedData}:any) =>{

    const isRelation = name.endsWith('Id')
    const storedDataName = isRelation ? name.substr(0, name.length-2) : name
    
    useEffect(()=>{
        if(storedData && storedData[storedDataName]) {
            let storedId: string
      
            if(isRelation) storedId = _.get(storedData, [storedDataName, 'id'])
            else storedId = storedData[storedDataName]
      
            setValue(name, storedId)
            
        } else setValue(name, value)
    }, [storedData, value])
    
    
    return (
        <React.Fragment>
            <input type="hidden" {...register(name)} />
        </React.Fragment>
    )
}

export default HiddenItem