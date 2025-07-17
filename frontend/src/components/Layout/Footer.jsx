import React from 'react';
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { useSelector } from "react-redux";

function Footer() {
  const { isAuthorized } = useSelector((state) => state.user);

  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved by Ijaz Akbar.</div>
      <div>
        <Link to={'https://github.com/ijaz003/'} target='_blank'><FaGithub /></Link>
        <Link to={'https://www.linkedin.com/in/ijaz-akbar/'} target='_blank'><FaLinkedin /></Link>
        <Link to={'https://www.instagram.com/ijaz_khan0009/'} target='_blank'><RiInstagramFill /></Link>
      </div>
    </footer>
  );
}

export default Footer;