import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-scroll";

const Home = () => {
  return (
    <div name="home" className="w-full h-screen bg-[#0a192f]">
      {/* Container */}
      <div className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center h-full">
        <p className="text-pink-600">Hi, my name is</p>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#ccd6f6]">
          Manish Chawla
        </h1>
        <h2 className="text-3xl sm:text-5xl font-bold text-[#8892b0]">
          I'm a Project Manager with a background in Front-End Development.
        </h2>
        <p className="text-[#8892b0] py-4 max-w-[900px]">
          With extensive experience in guiding teams through all stages of web
          development projects, I excel in ensuring that project milestones are
          met while maintaining a keen attention to detail. My foundation in
          front-end development, encompassing technologies like HTML, CSS,
          JavaScript, Reactjs, Nodejs, and Typescript, allows me to bridge the
          gap between technical teams and stakeholders effectively. Beyond just
          technical know-how, I also bring a sharp understanding of user
          experience design, having worked with tools such as Photoshop and
          Figma. Whether working independently or collaborating within a team
          setting, I pride myself on steering projects to successful outcomes,
          delivering solutions that not only meet but exceed client
          expectations.
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
