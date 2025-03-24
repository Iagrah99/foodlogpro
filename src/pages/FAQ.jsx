import { useState, useEffect, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import emailjs from "@emailjs/browser";

const FAQ = () => {
  const [showText, setShowText] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqRefs = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    const buttonTimer = setTimeout(() => setShowButtons(true), 1000);
    const arrowTimer = setTimeout(() => setShowArrow(true), 1250);

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
      clearTimeout(arrowTimer);
    };
  }, []);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_vaoftu4", // replace with your actual service ID
        "template_qr2ldcg", // replace with your EmailJS template ID
        formRef.current,
        "r3JrZ6KWi6Q6Ys1zH" // your public API key (user ID)
      )
      .then(
        (result) => {
          console.log("Email sent successfully!", result.text);
          alert("Your message has been sent!");
          formRef.current.reset();
        },
        (error) => {
          console.error("Email sending failed:", error.text);
          alert("Something went wrong. Please try again later.");
        }
      );
  };

  return (
    <>
      <NavigationBar page="faq" />
      <div className="flex flex-col items-center px-0 sm:px-8 lg:px-16 text-gray-900 dark:text-gray-100 bg-slate-50 dark:bg-gray-900 min-h-screen">
        <header
          className="text-center bg-fixed mb-12 min-h-screen min-w-full bg-cover"
          style={{ backgroundImage: "url(https://i.ibb.co/xJVj1H7/home.png)" }}
        >
          <div className="min-h-screen flex flex-col justify-evenly items-center bg-gradient-to-b from-transparent to-black p-8 md:p-12">
            <div>
              <h1
                className={`text-4xl md:text-5xl font-bold text-white mb-12 leading-tight transition-opacity duration-300 ease-in-out ${
                  showText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                Frequently Asked Questions
              </h1>
              <p
                className={`text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto whitespace-nowrap leading-relaxed transition-opacity duration-1000 ease-in-out ${
                  showText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                Find answers to the most common questions about FoodLogPro.
              </p>
            </div>
            <a href="#info">
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-4xl text-white transition-transform duration-500 ease-in-out animate-bounce transform ${
                  showArrow
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              />
            </a>
          </div>
        </header>

        {/* FAQ Section */}
        <section
          className="w-full min-h-fit max-w-7xl text-center bg-slate-50 dark:bg-gray-900 py-32 mb-12"
          id="info"
        >
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              General Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "How do I track my meals?",
                  answer:
                    "Simply log your meals using the app, and FoodLogPro will keep track of your meals and provide insightful statistics and recommendations.",
                },
                {
                  question: "How do I edit my meals?",
                  answer:
                    "To edit your meals, simply click on the piece of information you'd like to change. For instance, clicking on the meal name will allow you to edit it directly, making it easy to update your details on the spot.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "We take your privacy seriously and use industry-standard encryption to protect your data.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  ref={(el) => (faqRefs.current[index] = el)}
                  className="faq-item p-6 rounded-lg bg-green-700 shadow-lg transform transition-transform duration-1000 cursor-pointer"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex justify-between items-center text-white">
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <FontAwesomeIcon
                      icon={
                        activeQuestion === index ? faChevronUp : faChevronDown
                      }
                      className="text-2xl"
                    />
                  </div>
                  {activeQuestion === index && (
                    <p className="mt-4 text-lg text-gray-100">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support Form */}
        <section
          className="w-full max-w-5xl px-6 text-center bg-slate-50 dark:bg-gray-900 py-24 mb-20"
          id="support-contact"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Need Help or Have Feedback?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 max-w-xl mx-auto">
            If you're experiencing issues, have a feature request, or just need
            help using FoodLogPro, send us a message below.
          </p>
          <div className="max-w-2xl mx-auto text-left">
            <form
              ref={formRef}
              onSubmit={sendEmail}
              className="space-y-6 bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md dark:shadow-lg"
            >
              <div className="form-group">
                <label
                  htmlFor="name"
                  className="block text-gray-800 dark:text-gray-200 font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-slate-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="email"
                  className="block text-gray-800 dark:text-gray-200 font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-slate-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="message"
                  className="block text-gray-800 dark:text-gray-200 font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="6"
                  placeholder="Describe the issue or ask your question..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-slate-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition dark:bg-green-600 dark:hover:bg-green-500"
              >
                Submit Support Request
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
