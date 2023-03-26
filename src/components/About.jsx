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
              Hello, I am a skilled frontend developer with a passion for
              creating engaging and user-friendly interfaces for web
              applications. I take pride in my ability to learn quickly and
              adapt to new technologies and programming languages, which sets me
              apart from others in my field. With my natural curiosity and
              eagerness to expand my skillset, I am confident in my ability to
              help you build software that not only meets your needs but exceeds
              your expectations. I am always up for a challenge and excited to
              experiment with cutting-edge design tools and master new
              frameworks. Let me bring my expertise and passion to your team and
              together we can build something truly remarkable.ç
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
