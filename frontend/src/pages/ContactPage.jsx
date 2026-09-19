import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Badge from '../components/common/Badge';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does the 4-part scoring formula work?',
      a: 'We evaluate your resume across Skill Match (40%), Experience Relevance (30%), ATS Formatting (20%), and Keyword Density (10%) to give a balanced, explainable rating out of 100.',
    },
    {
      q: 'What file formats are supported?',
      a: 'We support modern PDF (.pdf) and Microsoft Word documents (.docx, .doc) up to 5MB in size.',
    },
    {
      q: 'Is my resume data kept confidential?',
      a: 'Yes. Your uploaded files are encrypted, stored in your private user history, and never shared with third parties.',
    },
    {
      q: 'Can I re-analyze my resume after making edits?',
      a: 'Absolutely! Uploading updated versions allows you to track your score progression over time in your History dashboard.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="indigo" size="sm">Get in Touch</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Contact ResumeIQ Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions, feedback, or need enterprise ATS integrations? Reach out to our engineering team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Send us a message</span>
            </h2>

            {submitted ? (
              <div className="p-8 text-center space-y-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Message Received!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Thank you for contacting ResumeIQ. Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Feature request / Feedback"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion Side */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
                >
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
