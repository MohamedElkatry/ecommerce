import React from 'react';
import { Link } from 'react-router-dom';
import style from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={style.notFoundContainer}>
      <div className={style.content}>
        <h1 className={style.title}>404</h1>
        <p  className={style.subtitle}>Oops! The page you are looking for does not exist.</p>
        
        <div className={style.buttons}>
          <Link to="/home" className={style.button}>
            Go to Home
          </Link>
          <Link to="/contact" className={style.buttonOutline}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
