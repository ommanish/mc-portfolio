import React from "react";

const About = () => {
  return (
    <div name="about" className="w-full h-screen  bg-[#0a192f] text-gray-300">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8">
          <div className="sm:text-right pb-8 pl-4">
            <p className="text-4xl font-bold inline border-b-4 border-pink-600">
              About
            </p>
          </div>
          <div></div>
        </div>
        <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
          <div className="sm:text-right text-4xl font-bold">
            <p>Hi. I'm Manish, nice to meet you. Please take a look around.</p>
          </div>
          <div>
            {/* <p>
              I am passionate about building excellent software that improves
              the lives of those around me. I specialize in creating software
              for clients ranging from individuals and small-businesses all the
              way to large enterprise corporations. What would you do if you had
              a software expert available at your fingertips?
            </p> */}
            {/* <p>
              Hello, I am an accomplished Project Manager with a strong
              background in frontend development. I pride myself on my
              capability to understand technical nuances, ensuring that projects
              align with both business objectives and user needs. What sets me
              apart is my adaptive nature and readiness to embrace new
              technologies, methodologies, and tools. My background in frontend
              development provides me with a unique perspective that facilitates
              smooth communication between stakeholders and technical teams. I
              possess an inherent curiosity and eagerness to enhance my
              management and technical skills alike. With this attitude, I am
              confident in guiding projects to not just meet but exceed your
              expectations. I thrive when faced with challenges and am always on
              the lookout to incorporate the latest in design and technological
              innovations. Let's collaborate; with my leadership and your
              vision, we can create something truly extraordinary.
            </p> */}
            <p>
              Hello! I'm a Project Manager with a strong focus on frontend
              development. My approach is all about blending technical know-how
              with business and user needs. I love adapting to new tech and
              methods, which helps me keep projects fresh and innovative. <br />
              With my background in frontend development, I'm great at
              communicating with both stakeholders and tech teams. I'm always
              keen to learn and grow in both management and tech areas. Leading
              projects to success, and often beyond, is what I do best.
              <br /> I enjoy tackling new challenges and keeping up with the
              latest in design and tech. I'm looking forward to working together
              to create something special and impactful. Let's make our visions
              a reality!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
