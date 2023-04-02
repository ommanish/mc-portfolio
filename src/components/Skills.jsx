import React from "react";
import { skillsData } from "../data/skilldata";

const Skills = () => {
  const skills = skillsData;
  return (
    <div name="skills" className="w-full h-screen bg-[#0a192f]  text-gray-300">
      {/* Container */}
      <div className="max-w-[1000px] mx-auto p-4 flex flex-col justify-center w-full h-full">
        <div>
          <p className="text-4xl font-bold inline border-b-4  border-pink-600">
            Skills
          </p>
          <p className="py-4">\\ These are the technologies I've worked with</p>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-center pb-10">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="shadow-md shadow-[#040c16] hover:scale-110 duration-500"
            >
              <img className="w-20 mx-auto" src={skill.img} alt={skill.name} />
              <p className="my-4">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
