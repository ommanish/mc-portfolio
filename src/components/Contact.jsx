import React from "react";

const Contact = () => {
  return (
    <div
      name="contact"
      className="w-full h-screen flex justify-center items-center bg-[#0a192f]"
    >
      <form
        action="https://getform.io/f/d0a0059d-9f07-4577-b3b6-2472d9663301"
        method="POST"
        className="flex flex-col max-w-[600px] w-full"
      >
        <div className="pb-8">
          <p className="text-4xl font-bold inline border-b-4 text-gray-300 border-pink-600">
            Contact
          </p>
          <p className="py-4 text-gray-300">
            \\ Submit the form or sent me an email - manishchawla09@gmail.com
          </p>
        </div>
        <input
          className="bg-[#ccd6f6] p-2"
          type="text"
          placeholder="Name"
          name="name"
        />
        <input
          className="my-4 p-2 bg-[#ccd6f6]"
          type="email"
          placeholder="Email"
          name="email"
        />
        <textarea
          name="message"
          className="bg-[#ccd6f6] p-2"
          placeholder="message"
          rows="10"
        ></textarea>
        <button className="text-white border-2 hover:bg-pink-600 hover:border-pink-600 px-4 py-3 my-8 mx-auto flex items-center">
          Let's Collaborate
        </button>
      </form>
    </div>
  );
};

export default Contact;
