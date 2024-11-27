import { useState, useEffect, useRef } from "react";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const FAQ = () => {
  const [showText, setShowText] = useState(false); // State for text animation
  const [showButtons, setShowButtons] = useState(false); // State for button animation
  const [showArrow, setShowArrow] = useState(false); // State for arrow animation
  const [activeQuestion, setActiveQuestion] = useState(null); // State to track which FAQ is active

  const faqRefs = useRef([]);

  // Handle scroll animation for FAQ page content
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500); // Delay for text animation

    const buttonTimer = setTimeout(() => {
      setShowButtons(true);
    }, 1000); // Delay for button animation

    const arrowTimer = setTimeout(() => {
      setShowArrow(true);
    }, 1250); // Delay for arrow animation

    return () => {
      clearTimeout(timer);
      clearTimeout(buttonTimer);
      clearTimeout(arrowTimer);
    };
  }, []);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index); // Toggle active question
  };

  return (
    <>
      <NavigationBar page="faq" />
      <div className="flex flex-col items-center px-0 sm:px-8 lg:px-16 text-gray-900 min-h-screen">
        <header className="text-center bg-fixed mb-12 min-h-screen min-w-full bg-cover x" style={{ backgroundImage: 'url(https://i.ibb.co/xJVj1H7/home.png)' }}>
          <div className="min-h-screen flex flex-col justify-evenly items-center bg-gradient-to-b from-transparent to-black p-8 md:p-12">
            <div>
              <h1 className={`text-4xl md:text-5xl font-bold text-white mb-12 leading-tight transition-opacity duration-300 ease-in-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                Frequently Asked Questions
              </h1>
              <p className={`text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto whitespace-nowrap leading-relaxed transition-opacity duration-1000 ease-in-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                Find answers to the most common questions about FoodLogPro.
              </p>
            </div>
            <a href="#info">
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-4xl text-white transition-transform duration-500 ease-in-out animate-bounce transform ${showArrow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              />
            </a>
          </div>
        </header>

        {/* FAQ Section */}
        <section className="w-full min-h-fit max-w-7xl text-center bg-white py-32 mb-12" id="info">
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">General Questions</h2>
            <div className="space-y-4">
              {[
                { question: "How do I track my meals?", answer: "Simply log your meals using the app, and FoodLogPro will keep track of your meals and provide insightful statistics and recommendations." },
                { question: "How do I edit my meals?", answer: "To edit your meals, simply click on the piece of information you'd like to change. For instance, clicking on the meal name will allow you to edit it directly, making it easy to update your details on the spot." },
                { question: "Is my data secure?", answer: "We take your privacy seriously and use industry-standard encryption to protect your data." },
                { question: "Do you offer any health insights?", answer: "Yes, FoodLogPro provides health insights based on your eating habits to help you make healthier choices." }
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
                      icon={activeQuestion === index ? faChevronUp : faChevronDown}
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
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
