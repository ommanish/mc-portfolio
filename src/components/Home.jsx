import React from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

const Home = () => {
  return (
    <div name="home" className="w-full h-screen bg-[#0a192f]">
      {/* Container */}
      <div className="max-w-[1000px] mx-auto px-8 flex flex-col justify-center h-full">
        <p className="text-pink-600">Hi, my name is</p>
        <h1 className="text-4xl sm:text-7xl font-bold text-[#ccd6f6]">
          Manish Chawla
        </h1>
        <h2 className="text-4xl sm:text-7xl font-bold text-[#8892b0]">
          I'm a Front-End Developer
        </h2>
        <p className="text-[#8892b0] py-4 max-w-[900px]">
          I'm Experienced Front-end Developer is adept in all stages of advanced
          web development. Knowledgeable in user interface, testing, and
          debugging processes. Able to effectively self-manage during
          independent projects, as well as collaborate in a team setting.
          Proficient in an assortment of technologies, including HTML, CSS,
          JavaScript, Reactjs, Nodejs, and Typescript. Also, create visually
          compelling user experience solutions for clients with design
          technologies such as photoshop and Figma.
        </p>
        <div>
          <button className="text-white group border-2 px-6 py-3 my-2 flex items-center hover:bg-pink-600 hover:border-pink-600">
            View Work{" "}
            <span className="group-hover:rotate-90 duration-300">
              <HiArrowNarrowRight className="ml-4 " />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
