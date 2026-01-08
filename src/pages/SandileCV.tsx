import React from 'react';

const SandileCV: React.FC = () => (
  <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow">
    <h1 className="text-3xl font-bold mb-2">Sandile Joshua Innocent Mnqayi</h1>
    <h2 className="text-xl text-blue-700 mb-4">QA Automation Architect | Software Engineer in Test</h2>
    <div className="mb-4">
      <span className="font-semibold">Centurion, Gauteng, South Africa</span><br />
      <span>Email: <a href="mailto:wifizi.gokhinki@gmail.com" className="text-blue-600 underline">wifizi.gokhinki@gmail.com</a></span><br />
      <span>Mobile: 067 932 3805</span><br />
      <span>GitHub: <a href="https://github.com/Nihnyoki" className="text-blue-600 underline">Nihnyoki</a></span><br />
      <span>YouTube: <a href="https://www.youtube.com/channel/UCR8DJ0lguiwKsDIRZ3v_fjw" className="text-blue-600 underline">Channel</a></span>
    </div>
    <h3 className="text-lg font-semibold mt-6 mb-2">Professional Summary</h3>
    <p className="mb-4">
      QA Automation Architect with over 15 years of experience designing, implementing, and scaling quality assurance and test automation solutions across banking, telecommunications, SaaS, and enterprise systems. Specialist in automation strategy, test architecture, CI/CD quality gates, and framework design, with deep hands-on expertise in Java-based automation, BDD (Cucumber), API testing, and system integration testing.
    </p>
    <h3 className="text-lg font-semibold mt-6 mb-2">Core Competencies</h3>
    <ul className="list-disc ml-6 mb-4">
      <li>Test Automation Architecture & Framework Design</li>
      <li>BDD & Living Documentation (Cucumber)</li>
      <li>API, Backend & Integration Testing</li>
      <li>CI/CD Quality Gates</li>
      <li>QA Leadership & Mentorship</li>
      <li>Agile & Hybrid SDLC</li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Professional Experience</h3>
    <ul className="list-disc ml-6 mb-4">
      <li><b>4-SURE Technology Solutions</b> – QA Lead / Senior QA Engineer (2023 – Present)<br />
        Lead a QA team of 5 engineers in a SaaS environment.<br />
        Define and execute QA strategy across multiple enterprise clients.<br />
        Introduce scalable automation frameworks and quality practices.
      </li>
      <li><b>Nedbank</b> – Automation Engineer (2020)<br />
        Delivered desktop, API, and web automation solutions.<br />
        Designed automation strategies per system context.
      </li>
      <li><b>WesBank</b> – Automation Engineer (2018 – 2020)<br />
        Automated banking APIs and payment mandate systems.<br />
        Built Java-based automation frameworks.
      </li>
      <li><b>ABSA</b> – Web Services Tester (2017 – 2018)<br />
        API and integration testing within regulated banking systems.
      </li>
      <li><b>Kapsch TrafficCom</b> – QA & Third Line Support Engineer (2016 – 2017)<br />
        End-to-end testing across software and hardware systems.
      </li>
      <li><b>Concurrent Systems</b> – Test Lead Engineer (2013 – 2016)<br />
        Led test strategy and mentored junior engineers.
      </li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Education</h3>
    <ul className="ml-6 mb-4">
      <li>National Diploma in Electrical Engineering (Telecommunications)<br />
        Mangosuthu University of Technology<br />
        Dean’s Commendation for Academic Excellence
      </li>
    </ul>
    <h3 className="text-lg font-semibold mt-6 mb-2">Quality Architecture Philosophy</h3>
    <p className="mb-4">
      I believe quality is a system-level architectural concern, not a phase in the SDLC. My approach to Quality Architecture focuses on designing testability into systems from the outset, using automation as an enabling platform rather than a verification afterthought.
    </p>
    <ul className="list-disc ml-6 mb-4">
      <li>Quality built into architecture, pipelines, and delivery workflows</li>
      <li>Automation frameworks treated as long-lived platforms</li>
      <li>Test strategy aligned to risk, business value, and system complexity</li>
      <li>Observability, telemetry, and feedback loops as first-class quality signals</li>
      <li>Strong collaboration between QA, engineering, product and AI 🙂</li>
    </ul>
    <p className="mb-4">
      I regularly write about Quality Architecture, test automation strategy, and system thinking in QA on my blog: <a href="https://quality-sji.vercel.app/quality-philosophy" className="text-blue-600 underline">Quality Philosophy Blog</a>
    </p>
  </div>
);

export default SandileCV;
