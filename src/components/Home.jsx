import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-scroll";

const Home = () => {
  return (
    <div name="home" className="w-full h-screen bg-[#0a192f]">
      {/* Container */}
      <div className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center h-full">
        <span className="text-pink-600">Hi, my name is</span>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#ccd6f6]">
          Manish Chawla
        </h1>
        <h2 className="text-3xl sm:text-5xl font-bold text-[#8892b0]">
          I'm a Senior Frontend Developer & Project Lead.
        </h2>
        <p className="text-[#8892b0] py-4 max-w-[900px]">
          With extensive experience working with web development teams, I excel
          in meeting project milestones with meticulous attention to detail.
          Proficient in front-end development with HTML, CSS, JavaScript,
          React.js, Node.js, and Typescript, I effectively bridge technical
          teams and stakeholders. I also possess a strong grasp of user
          experience design, utilizing tools like Photoshop and Figma. Whether
          working independently or collaboratively, I am dedicated to delivering
          solutions that exceed client expectations.
        </p>
        <div>
          <Link
            to="work"
            smooth={true}
            duration={500}
            className=" w-[170px] cursor-pointer text-white group border-2 px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600"
          >
            View Work
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-4 " />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
