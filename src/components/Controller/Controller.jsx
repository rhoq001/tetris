import React, {useRef} from 'react'
import { Button } from 'react-bootstrap'
import {BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsFillArrowDownSquareFill} from 'react-icons/bs'
import {ImDownload} from 'react-icons/im'
import {AiOutlineRotateLeft} from 'react-icons/ai'
import {IoMdSwap} from 'react-icons/io'


const Controller = ({swapPiece, moveControl, rotateControl, forwardedRef}) => {
    const childRef = useRef(null);
    // Assign the childRef to forwardedRef
    if (forwardedRef) {
        forwardedRef.current = childRef.current;
    }
    return (
    <>
        <div className="col-12 border-success border-3 border">
            <div className="row">
                <div className="col-4 mt-5 mb-2 text-center"><Button onClick={() => moveControl({row_add: 0, col_add: -1})} className="w-75 bg-dark"><BsFillArrowLeftSquareFill className="justify-content-center display-5" /></Button></div>
                <div className="col-4 mt-5 mb-2 text-center"><Button className="w-75 bg-dark mb-4 mb-lg-5"><ImDownload className="justify-content-center display-5"/></Button></div>
                <div className="col-4 mt-5 mb-2 text-center"><Button onClick={() => moveControl({row_add: 0, col_add: 1})} className="w-75 bg-dark"><BsFillArrowRightSquareFill className="justify-content-center display-5" /></Button></div>
            </div>
            <div className="row">
                <div className="col-3 mb-5 text-center"> <Button onClick={() => swapPiece()} className="rounded-pill bg-dark"><IoMdSwap className="justify-content-center display-5" /></Button></div>
                <div className="col-4 offset-1 mb-5 text-center"> <Button ref={childRef} onClick={() => moveControl({row_add: 1, col_add: 0})} className="w-75 bg-dark"><BsFillArrowDownSquareFill className="justify-content-center display-5" /></Button></div>
                <div className="col-3 offset-1 mb-5 text-center"> <Button onClick={() => rotateControl(-1)} className="rounded-pill bg-dark"><AiOutlineRotateLeft className="justify-content-center display-5" /></Button></div>
            </div>
        </div>
    </>
    )
}

export default Controller