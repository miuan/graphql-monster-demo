import React from 'react'
import { getGraphqlMonsterClientAppRoot } from "../../app/utils"

export const Image = ({ publicKey, width, height }: { publicKey: string, width?: string | number, height?: string | number }) => {
    const _width = width || '100px'
    const _height = height || '100px'

    return (
        <div style={{
            overflow: 'hidden',
            width: _width,
            height: _height
        }}>
            <img
                alt=''
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    minHeight: '100%'
                }}
                src={`${getGraphqlMonsterClientAppRoot()}/download/${publicKey}`} />
        </div>
    )
}

export default Image