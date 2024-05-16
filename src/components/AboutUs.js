import React from 'react';
import img from '../img/gymg.jpg';
import img1 from '../img/black-black.jpg';
import Navbar from './Navbar';

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div
        className="container-fluid"
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          position: 'relative', // Added position relative to contain the absolute positioned image
        }}
      >
        {/* Background Image */}
        <img
          src={img1}
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
        {/* Content */}
        <div className="row">
            {/* Right Side - Text */}
          <div className="col-md-6 text-start text-light">
            <h2 className="mb-4 text-warning text-center">About Us</h2>
            <p>
  Welcome to our gym! We are passionate about helping you reach your fitness goals. Our team is dedicated to providing personalized training programs tailored to your needs.
</p>
<p>
  At our gym, we foster a supportive community where everyone feels welcome and motivated. Whether you're a beginner or an experienced athlete, we're here to help you succeed.
</p>
<p>
  With state-of-the-art equipment and knowledgeable trainers, we strive for excellence in every workout. Join us today and start your journey to a healthier, stronger you!
</p>



          </div>
          {/* Left Side - Image */}
          <div className="col-md-6">
            <img
              src={img}
              alt="About Us"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
