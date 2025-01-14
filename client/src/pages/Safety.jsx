import React from 'react';

const Safety = () => {
  return (
    <div className="flex flex-col items-start bg-black-100 w-full px-4  md:px-20 lg:px-36 h-[100vh] md:h-[83vh] overflow-y-auto pt-36">
      <h1 className="text-3xl md:text-4xl font-bold text-zinc-200 mb-6">Safety Guidelines</h1>
      <p className="text-gray-300 mb-6">
        DevLok Chat ensures your communication is private and secure. Follow these guidelines for a safe experience.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">Safety Tips</h2>
      <ul className="list-disc list-inside text-gray-300 mb-6">
        <li>Keep personal information private.</li>
        <li>Be cautious with links—only click from trusted sources.</li>
        <li>Report suspicious activity immediately.</li>
        <li>Update to the latest version for enhanced security.</li>
      </ul>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">Secure Communication</h2>
      <p className="text-gray-300 mb-6">
        DevLok uses server-side encryption to protect your messages. Always log out on shared devices.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">Community Guidelines</h2>
      <ul className="list-disc list-inside text-gray-300 mb-6">
        <li>Be respectful and courteous to others.</li>
        <li>Avoid offensive language or behavior.</li>
        <li>Respect others' privacy and boundaries.</li>
      </ul>

      <h2 className="text-2xl md:text-3xl font-semibold text-zinc-200 mb-4">Need Help?</h2>
      <p className="text-gray-300">
        Contact our support team for assistance. Stay safe and enjoy using DevLok Chat!
      </p>
    </div>
  );
};

export default Safety;
