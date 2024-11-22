import React from 'react';

const About = () => {
  return (
    <div className="flex items-start justify-start flex-col bg-black-100 h-screen w-full px-40 py-40">
      <h1 className="text-4xl font-bold text-zinc-200 mb-4">About This Project</h1>
      <p className="text-gray-200 mb-6">
        Welcome to DevLok Chat! This platform aims to provide a secure and user-friendly
        environment for seamless communication. Built with a focus on privacy and real-time 
        engagement, DevLok is designed for individuals and communities to connect with confidence.
      </p>

      <h2 className="text-2xl font-semibold text-zinc-200 mb-2">About the Developer</h2>
      <p className="text-gray-200 mb-4">
        Hi, I’m Mukul Rana, the developer behind this project. I’m a Computer Science Engineering
        undergraduate passionate about full-stack development, with experience in the MERN stack, React,
        Node.js, and more. I strive to create high-quality, intuitive applications that bring 
        positive impact and innovation to users.
      </p>

      <div className="flex gap-4 mt-4">
        <a 
          href="https://www.linkedin.com/in/mukul-webdev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200 hover:bg-blue-700"
        >
          LinkedIn
        </a>
        <a 
          href="https://github.com/mukulpythondev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:bg-zinc-200 text-white px-4 py-2 rounded-md transition hover:text-gray-800 duration-200 bg-gray-900"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default About;
