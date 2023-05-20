import React from 'react'
import Grid from '../Grid/Grid'
import './Icon.css'
const Icon = ({initialGrid, title}) => {
    return (
    <div className='container'>
        <div className='row'>
            <div className='col-12 border border-info border-3 rounded bg-dark text-light text-center'>{title}</div>
        </div>
        <div className='row'>
            <div className='col-12 bg-gray'><Grid grid={initialGrid} size='sm'/></div>
        </div>
    </div>
    )
}

export default Icon