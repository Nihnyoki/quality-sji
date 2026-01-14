import React from 'react';
import { Link } from '@tanstack/react-router';
import BackButton from '../components/BackButton';

const SandileCV: React.FC = () => (
  <main className="min-h-screen bg-transparent">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <BackButton className="inline-flex items-center rounded-full border border-slate-700/60 bg-slate-900/45 px-4 py-2 text-sm font-medium text-slate-200/90 hover:bg-slate-900/65">
          Back
        </BackButton>
      </div>

      <section className="rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-merriweather text-2xl sm:text-3xl font-semibold text-slate-50">
              Sandile Joshua Innocent Mnqayi
            </h1>
            <p className="mt-2 text-slate-200/90">
              QA Test Lead / Automation Architect — building reliable quality systems with pragmatic automation, risk-based strategy, and strong engineering collaboration.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-200/90">
            <span className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1">
              Centurion, Gauteng (South Africa)
            </span>
            <a
              href="mailto:wifizi.gokhinki@gmail.com"
              className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1 hover:bg-slate-900/65"
            >
              Email
            </a>
            <a
              href="https://github.com/Nihnyoki"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1 hover:bg-slate-900/65"
            >
              GitHub
            </a>
            <a
              href="https://www.youtube.com/channel/UCR8DJ0lguiwKsDIRZ3v_fjw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1 hover:bg-slate-900/65"
            >
              YouTube
            </a>
            <Link
              to="/quality-philosophy"
              className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1 hover:bg-slate-900/65"
            >
              Blog
            </Link>
            <a
              href="/doc/cv_latest.pdf"
              className="inline-flex items-center rounded-none border border-slate-700/60 bg-slate-900/45 px-3 py-1 hover:bg-slate-900/65"
            >
              Download CV
            </a>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm p-6">
          <h2 className="font-merriweather text-lg font-semibold text-slate-50">What I Do</h2>
          <ul className="mt-3 space-y-2 text-slate-200/90 text-sm list-disc ml-5">
            <li>Design scalable automation frameworks (UI, API, integration) and quality gates for CI/CD.</li>
            <li>Lead QA teams with clear strategy, coaching, and measurable quality outcomes.</li>
            <li>Translate business risk into effective test strategy (coverage where it matters most).</li>
            <li>Drive testing maturity: observability, telemetry-informed coverage, and fast feedback loops.</li>
          </ul>
        </section>

        <section className="rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm p-6">
          <h2 className="font-merriweather text-lg font-semibold text-slate-50">Core Skills</h2>
          <ul className="mt-3 space-y-2 text-slate-200/90 text-sm list-disc ml-5">
            <li>Test Automation Architecture & Framework Design</li>
            <li>BDD & Living Documentation (Cucumber)</li>
            <li>API, Backend & Integration Testing</li>
            <li>CI/CD Quality Gates and release readiness</li>
            <li>QA leadership, mentorship, and delivery enablement</li>
            <li>Agile & hybrid SDLC execution</li>
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm p-6">
        <h2 className="font-merriweather text-lg font-semibold text-slate-50">Selected Experience</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-200/90">
          <div className="rounded-none border border-slate-700/60 bg-slate-900/45 p-4">
            <div className="font-semibold text-slate-50">4-SURE Technology Solutions</div>
            <div className="text-slate-300">QA Lead / Senior QA Engineer (2023 – Present)</div>
            <ul className="mt-2 list-disc ml-5 space-y-1">
              <li>Lead a QA team of 5 engineers in a SaaS environment.</li>
              <li>Define and execute QA strategy across enterprise clients.</li>
              <li>Introduce scalable automation frameworks and quality practices.</li>
            </ul>
          </div>
          <div className="rounded-none border border-slate-700/60 bg-slate-900/45 p-4">
            <div className="font-semibold text-slate-50">Banking & Enterprise Delivery</div>
            <div className="text-slate-300">ABSA • WesBank • Nedbank (2017 – 2020)</div>
            <ul className="mt-2 list-disc ml-5 space-y-1">
              <li>Automation strategy per system context (desktop, web, APIs).</li>
              <li>API and integration testing in regulated environments.</li>
              <li>Java-based frameworks and enterprise-grade test approach.</li>
            </ul>
          </div>
          <div className="rounded-none border border-slate-700/60 bg-slate-900/45 p-4">
            <div className="font-semibold text-slate-50">Test Leadership</div>
            <div className="text-slate-300">Concurrent Systems (2013 – 2016)</div>
            <ul className="mt-2 list-disc ml-5 space-y-1">
              <li>Led test strategy and mentored junior engineers.</li>
              <li>Built repeatable delivery patterns for quality assurance.</li>
            </ul>
          </div>
          <div className="rounded-none border border-slate-700/60 bg-slate-900/45 p-4">
            <div className="font-semibold text-slate-50">Systems Testing</div>
            <div className="text-slate-300">Kapsch TrafficCom (2016 – 2017)</div>
            <ul className="mt-2 list-disc ml-5 space-y-1">
              <li>End-to-end testing across software + hardware systems.</li>
              <li>Support-driven feedback into test strategy and regression coverage.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-none border border-slate-700/60 bg-slate-900/35 backdrop-blur shadow-sm p-6">
        <h2 className="font-merriweather text-lg font-semibold text-slate-50">Quality Architecture Philosophy</h2>
        <p className="mt-3 text-sm text-slate-200/90 leading-relaxed">
          I treat quality as a system-level design concern, not a phase in the SDLC. The goal is to build testability into architecture and pipelines,
          use automation as an enabling platform, and continuously align coverage to real user risk.
        </p>
        <ul className="mt-3 space-y-2 text-slate-200/90 text-sm list-disc ml-5">
          <li>Quality built into architecture, pipelines, and delivery workflows</li>
          <li>Automation frameworks treated as long-lived platforms</li>
          <li>Test strategy aligned to risk, business value, and system complexity</li>
          <li>Observability, telemetry, and feedback loops as first-class quality signals</li>
          <li>Strong collaboration across QA, engineering, and product</li>
        </ul>
      </section>
    </div>
  </main>
);

export default SandileCV;
