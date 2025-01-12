import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-start justify-start bg-black-100 w-full md:h-[83vh] px-4 md:px-36 py-10 h-[100vh] overflow-y-scroll md:overflow-y-hidden pt-32 ">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-200 mb-6">About This Project</h1>
      <p className="text-gray-200 mb-8">
        Welcome to DevLok Chat! This platform aims to provide a secure and user-friendly environment
        for seamless communication. Built with a focus on privacy and real-time engagement, DevLok is 
        designed for individuals and communities to connect with confidence.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">Chats Are Secure</h2>
      <p className="text-gray-200 mb-8">
        All chats on DevLok are encrypted server-side, ensuring your conversations remain private. 
        This level of encryption is similar to how passwords are securely stored, giving you peace of 
        mind when using the platform.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">About the Developer</h2>
      <p className="text-gray-200 mb-6">
        Hi, I’m Mukul Rana, the developer behind this project. I’m a Computer Science Engineering 
        undergraduate passionate about full-stack development, with experience in the MERN stack, 
        React, Node.js, and more. I strive to create high-quality, intuitive applications that bring 
        positive impact and innovation to users.
      </p>

      <div className="flex flex-wrap gap-4">
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
          className="bg-gray-900 hover:bg-zinc-200 text-white px-4 py-2 rounded-md transition hover:text-gray-800 duration-200"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default About;
