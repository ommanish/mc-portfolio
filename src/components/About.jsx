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
            <p>
              Well, that's exactly what you get with me! As a skilled frontend
              developer, you can count on me to create engaging and
              user-friendly interfaces for your web applications. But what sets
              me apart is my ability to learn quickly and adapt to new
              technologies and programming languages. Whether it's mastering a
              new framework or experimenting with cutting-edge design tools, I'm
              always eager to expand my skillset and take on new challenges.
              With my passion for frontend development and my natural curiosity,
              I'm confident that I can help you build software that not only
              meets your needs but exceeds your expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
