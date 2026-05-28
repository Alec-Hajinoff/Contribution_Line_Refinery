import React from "react";
import "./AboutMe.css";
import myphoto from "./my_edited_photo.jpg";

function AboutMe() {
  return (
    <div className="aboutme-container container my-5">
      {" "}
      {/*my-5 is the margin on the y axis, space at the top and the bottom*/}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-9 clearfix-custom">
          <img
            src={myphoto}
            alt="Alec Hajinoff"
            className="aboutme-photo img-fluid rounded"
          />
          <p>
            My name is Alec Hajinoff, and I am a freelance software engineer
            based in London, United Kingdom. I design and build modern and
            secure web applications for businesses and development teams.
          </p>
          <p>
            My work centres on creating systems that are not only functional,
            but well-organised beneath the surface - where front-end, back-end,
            and data layers interact in a predictable, logical way. I approach
            development as an engineering discipline rather than a collection of
            ad hoc tasks, with an emphasis on structure, transparency, and
            consistency.
          </p>
          <h2 className="h5 mt-4">Background</h2>
          <p>
            My path into software engineering began while working at a food
            wholesale company, where I was looking for a more intellectually
            engaging pursuit outside of work. I had always enjoyed maths and was
            interested in finding a way to apply that way of thinking in a
            practical context.
          </p>
          <p>
            After coming across a software engineering course, I decided to
            explore whether programming could provide that outlet. I enrolled in
            a course at the end of 2023, and from the very first lesson it
            became clear that this was exactly what I had been looking for.
          </p>
          <p>
            The logical structure of code, the precision of how systems behave,
            and the ability to build something tangible from first principles
            immediately resonated with me. Since then, I have committed to
            developing my skills in a focused and consistent way, building both
            theoretical understanding and practical capability.
          </p>
          <h2 className="h5 mt-4">Approach to Software Development</h2>{" "}
          {/*mt-4 is margin top*/}
          <p>
            I approach software development through the lens of engineering
            principles. This provides a structured way to think about problems,
            make decisions, and deliver outcomes that are robust and
            maintainable. My work typically follows a sequence of:
          </p>
          <ul>
            <li>
              <strong>Requirements engineering</strong> - understanding the
              problem clearly before building
            </li>
            <li>
              <strong>Architectural design and modelling</strong> - structuring
              the system in a logical and scalable way
            </li>
            <li>
              <strong>Quantitative analysis and logic</strong> - ensuring
              decisions are reasoned and consistent
            </li>
            <li>
              <strong>Implementation</strong> - building with clarity and
              discipline
            </li>
            <li>
              <strong>Verification and validation</strong> - checking that the
              system behaves as intended
            </li>
            <li>
              <strong>Professional responsibility</strong> - maintaining
              accountability and transparency throughout
            </li>
          </ul>
          <p>
            At a fundamental level, I view every application as a system
            composed of a defined set of elements: logic, data, metadata,
            display, navigation, and user input. Keeping these elements clearly
            separated and well-managed allows the system to remain
            understandable, adaptable, and reliable over time.
          </p>
          <h2 className="h5 mt-4">Professional Characteristics</h2>
          <p>My working style is defined by a small number of traits:</p>
          <ul>
            <li>
              <strong>Patience</strong> - taking the time to understand problems
              properly and avoid rushed decisions
            </li>
            <li>
              <strong>Methodical thinking</strong> - approaching work in a
              systematic, step-by-step manner
            </li>
            <li>
              <strong>Reliability</strong> - following through on commitments
              and maintaining consistency
            </li>
            <li>
              <strong>Analytical mindset</strong> - breaking down complex
              problems into manageable components
            </li>
          </ul>
          <p>
            Rather than treating these as abstract qualities, I aim to reflect
            them directly in how I design systems, write code, and communicate
            throughout a project.
          </p>
          <h2 className="h5 mt-4">Continuous Development</h2>
          <p>
            I place a strong emphasis on continuous learning. Software
            engineering evolves quickly, and maintaining relevance requires
            consistent effort. I have completed formal training across a range
            of areas, including front-end development, back-end programming, and
            full-stack application design. These include courses in Bootstrap,
            jQuery, PHP, Python, React, and full-stack software engineering.
          </p>
          <p>
            Alongside formal learning, I continue to build and refine practical
            projects, using them as a way to deepen my understanding and apply
            concepts in real-world scenarios. Certifications and course
            completions are included on this page as part of that ongoing
            development.
          </p>
          <h2 className="h5 mt-4">Working With Me</h2>
          <p>
            Clients can expect a professional, organised approach combined with
            openness and flexibility. I aim to provide:
          </p>
          <ul>
            <li>
              <strong>
                Clear communication and straightforward discussions
              </strong>
            </li>
            <li>
              <strong>A logical and well-organised development process</strong>
            </li>
            <li>
              <strong>Transparency in how work progresses</strong>
            </li>
            <li>
              <strong>
                A willingness to engage, refine, and improve ideas
                collaboratively
              </strong>
            </li>
          </ul>
          <p>
            Whether working with a small business building a new application or
            alongside an existing development team, my focus is on contributing
            in a way that is reliable and aligned with the long-term success of
            the project.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
