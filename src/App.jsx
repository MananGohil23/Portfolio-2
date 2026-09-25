import About from './components/About'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Projects from './components/Projects'
import ScrollDraw from './components/ScrollDraw'
import Skills from './components/Skills'
import SvgDefs from './components/SvgDefs'
import { marqueeSkills } from './data/resume'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <SvgDefs />
      <ScrollDraw />

      {/* page-wide paper grain */}
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.35]" />

      <Cursor />

      <Nav />

      <main className="relative">
        <Hero />

        <Marquee items={marqueeSkills} className="my-10" tilt={-1.6} tone="ink" />

        <About />

        <Marquee
          items={['AI', 'Data Analytics', 'Scalable Systems', 'Machine Learning', 'Full-stack', 'Problem Solver']}
          className="my-4"
          tilt={1.4}
          tone="coral"
        />

        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
