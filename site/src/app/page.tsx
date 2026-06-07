"use client";

import { motion } from "framer-motion";
import { Leaf, GitBranch, Wind, Cpu, Cloud } from "lucide-react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { time: '0m', floral: 10, grassy: 90 },
  { time: '15m', floral: 20, grassy: 70 },
  { time: '30m', floral: 35, grassy: 50 },
  { time: '45m', floral: 55, grassy: 35 },
  { time: '60m', floral: 75, grassy: 25 }, 
  { time: '75m', floral: 90, grassy: 15 },
  { time: '90m', floral: 100, grassy: 5 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/70 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-semibold tracking-tight text-slate-100">Spectra Leaf</span>
          </div>
          <Link 
            href="https://github.com/cepdnaclk/e21-3yp-SPECTRA-LEAF" 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <GitBranch className="w-4 h-4" />
            View GitHub
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none translate-x-[-20%]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            University IoT Engineering Project
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-slate-100"
        >
          Digitizing the Art of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Tea Fermentation
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          An IoT-based olfactory profiling system replacing subjective guesswork with data-driven precision.
          We use multi-channel gas arrays and color sensing to identify the exact &quot;Sweet Spot&quot; where flavor
          and quality are maximized.
        </motion.p>
      </main>

      {/* Science & Architecture Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Science & Architecture</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A seamless integration of precision hardware and scalable cloud infrastructure.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Olfactory Profiling",
              description: "Utilizing a multi-channel gas sensor array to track chemical transitions from grassy aldehydes to floral terpene alcohols in real-time.",
              icon: Wind,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
              border: "border-cyan-500/20"
            },
            {
              title: "Edge Hardware",
              description: "Custom ESP32-based hardware with a robust tri-voltage power regulation system, ensuring precise, noise-free sensor readings in harsh environments.",
              icon: Cpu,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/20"
            },
            {
              title: "Serverless Cloud",
              description: "A highly scalable AWS backend using serverless architecture to process sensor data with machine learning, pinpointing the fermentation sweet spot.",
              icon: Cloud,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              border: "border-blue-500/20"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:bg-slate-800/50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 border ${feature.bg} ${feature.border}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-800/50">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
              Live Dashboard Preview
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Our algorithm continuously monitors the <strong className="text-slate-200 font-medium">Fermentation Plateau</strong>. 
              As the tea leaves oxidize, we track the delicate balance of volatile organic compounds.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              When floral terpene alcohols surge and grassy aldehydes dissipate, they form a critical intersection. This exact moment is identified as the <strong className="text-emerald-400 font-medium">Sweet Spot</strong>, notifying tea makers to halt fermentation and lock in the perfect batch.
            </p>
          </motion.div>

          {/* Browser Frame / Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="flex-[1.5] w-full"
          >
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
              {/* Browser Header */}
              <div className="h-12 border-b border-slate-800 bg-slate-950/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-red-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-yellow-500 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-700 hover:bg-green-500 transition-colors" />
                <div className="mx-auto px-4 py-1 rounded-md bg-slate-900/80 text-xs text-slate-500 font-mono border border-slate-800/50 shadow-inner">
                  dashboard.spectraleaf.io
                </div>
              </div>
              
              {/* Chart Container */}
              <div className="p-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="floral" 
                        name="Floral Terpene Alcohols"
                        stroke="#34d399" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#34d399', strokeWidth: 0 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="grassy" 
                        name="Grassy Aldehydes"
                        stroke="#22d3ee" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#0f172a', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#22d3ee', strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Meet the Engineers */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 z-10 border-t border-slate-800/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Meet the Engineers</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The team behind SPECTRA-LEAF, driving innovation in IoT and agricultural technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Nadeera Kothalawala", regNo: "E/21/226", email: "e21226@eng.pdn.ac.lk" },
            { name: "Lahiru Dinushan", regNo: "E/21/049", email: "e21049@eng.pdn.ac.lk" },
            { name: "Rangana Madhushanka", regNo: "E/21/200", email: "e21200@eng.pdn.ac.lk" },
            { name: "Deshan Dinidu", regNo: "E/21/054", email: "e21054@eng.pdn.ac.lk" }
          ].map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-center flex flex-col items-center hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 p-1 mb-4">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-100">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-1">{member.name}</h3>
              <p className="text-emerald-400 font-mono text-sm mb-3">{member.regNo}</p>
              <a href={`mailto:${member.email}`} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                {member.email}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="text-slate-300 font-semibold text-sm">SPECTRA-LEAF</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} University of Peradeniya - Dept. of Computer Engineering.
          </p>
          <div className="flex items-center gap-4">
            <a href="http://www.ce.pdn.ac.lk/" target="_blank" className="text-slate-500 hover:text-emerald-400 transition-colors text-sm">
              Dept. of CE
            </a>
            <a href="https://github.com/cepdnaclk/e21-3yp-SPECTRA-LEAF" target="_blank" className="text-slate-500 hover:text-emerald-400 transition-colors text-sm">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
