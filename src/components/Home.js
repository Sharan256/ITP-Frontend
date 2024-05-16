import React from 'react'
import img from '../img/back.jpg'
import { Link, NavLink } from 'react-router-dom'
import Navbar from'./Navbar'
export default function Home() {
  return (
    <div>
      <Navbar/>
    <div
      className="container-fluid"
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        src= {img}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '850px',
          objectFit: 'cover',
          zIndex: -1,
        }}
      />
      <div className="row ">
        <div className="col-md-8 text-start ">
          <h1 className="mb-4 text-warning display-1 ">Transform Your Body, Elevate Your Mind</h1>
          <button className="btn btn-warning btn-lg"><NavLink className="nav-link text-dark"  to="/register">GET STARTED</NavLink></button>
          
        </div>
      </div>
    </div>
    </div>
  )
}
