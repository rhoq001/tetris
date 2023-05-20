import { v4 as uuidv4 } from 'uuid';
import './Grid.css'

const Grid = ({grid, size}) => {

    return (
        <div className='col-12'>
            {grid.map((row) =>
            <div key={uuidv4()} className='row flex-nowrap'>
                {row.map((column) =>
                    <div key={uuidv4()} className={`aspect-ratio-square-${size} rounded ${column.isFilled ? 'shiny-color' : column.color} col border-2 border`}></div>
                )}
            </div>
            )}
        </div>
    );
}

export default Grid