

const Safety = () => {
  return (
    <div className="flex items-start justify-center flex-col bg-black-100 h-screen w-full px-10">
      <h1 className="text-4xl font-bold text-zinc-200 mb-4">Safety Guidelines</h1>
      <p className="text-gray-300 mb-6">
        DevLok Chat is committed to providing a secure and private communication platform. 
        Here are some guidelines to help you stay safe and secure while using this service.
      </p>

      <h2 className="text-2xl font-semibold text-zinc-200 mb-2">Safety Tips</h2>
      <ul className="list-disc list-inside text-gray-300 mb-6">
        <li>Keep your personal information private. Avoid sharing sensitive details with unknown contacts.</li>
        <li>Be cautious with links. Only click on links from trusted sources, and never share personal information on untrusted websites.</li>
        <li>Report suspicious activity. If you encounter any suspicious behavior, report it immediately.</li>
        <li>Keep your software updated. Ensure you’re using the latest version of the chat app to benefit from security updates.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-zinc-200 mb-2">Using DevLok Chat Securely</h2>
      <p className="text-gray-300 mb-6">
        This chat platform uses end-to-end encryption for your messages, protecting your data from unauthorized access. 
        Always remember to log out of your account on shared devices to prevent unauthorized access.
      </p>

      <h2 className="text-2xl font-semibold text-zinc-200 mb-2">Community Guidelines</h2>
      <ul className="list-disc list-inside text-gray-300 mb-6">
        <li>Be respectful and courteous in all interactions.</li>
        <li>Avoid inappropriate or offensive language.</li>
        <li>Respect the privacy and boundaries of others.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-zinc-200 mb-2">Need Help?</h2>
      <p className="text-gray-300">
        If you need any assistance, feel free to reach out to our support team. Stay safe and enjoy your experience on DevLok Chat!
      </p>
    </div>
  );
};

export default Safety;
