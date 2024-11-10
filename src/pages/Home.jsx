import NavigationBar from "../components/NavigationBar"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCalendarAlt, faChartLine, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../app.css'

const Home = () => {

  const navigate = useNavigate();
  const [showText, setShowText] = useState(false); // State to trigger animation
  const [isMobileView, setIsMobileView] = useState(false); // State to detect screen width
  const [showButtons, setShowButtons] = useState(false); // State to trigger animation
  const [showArrow, setShowArrow] = useState(false)

  const featureRefs = useRef([]); // To hold references to each feature div
  const testimonialRefs = useRef([]);
  const ctaRef = useRef(null); // Ref for the Call to Action section

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('reveal')) {
            entry.target.classList.add('reveal');

            // Delay enabling pointer events until after the transition
            setTimeout(() => {
              entry.target.classList.add('active'); // Enable interactions
            }, 900); // Match this duration with the CSS transition time (0.9s)
          }
        });
      },
      { threshold: 1 }
    );

    // Observe each feature div
    featureRefs.current.forEach((div) => {
      if (div) observer.observe(div);
    });

    testimonialRefs.current.forEach((div) => {
      if (div) observer.observe(div);
    });

    if (ctaRef.current) observer.observe(ctaRef.current);

    // Cleanup the observer on unmount
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Trigger the button animation after component mounts
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1000); // Delay to control when animation starts

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  useEffect(() => {
    // Trigger the arrow animation after component mounts
    const timer = setTimeout(() => {
      setShowArrow(true);
    }, 1250); // Delay to control when animation starts

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  useEffect(() => {
    // Function to handle resizing events and detect screen width
    const handleResize = () => {
      if (window.innerWidth < 768) { // Mobile/tablet breakpoint
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    // Check on initial load
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Trigger animation when component is mounted
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500); // Delay to control when animation starts (can adjust this)

    return () => clearTimeout(timer); // Clean up timer
  }, []);

  return (
    <> {isMobileView ? (
      <div className="w-full bg-yellow-100 text-center py-6">
        <p className="text-xl text-gray-900 font-semibold">
          We have detected that you are using a mobile device, please download our mobile app instead, thank you!
        </p>
      </div>
    ) :
      <>
        <NavigationBar page="home" />
        <div className="flex flex-col items-center px-0 sm:px-8 lg:px-16 text-gray-900 min-h-screen">
          <header className="text-center mb-12 min-h-screen min-w-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.ibb.co/JR2Qm9W/bg-home.png)' }}>
            <div className="min-h-screen flex flex-col justify-evenly items-center bg-gradient-to-b from-transparent to-black p-8 md:p-12">

              <div>
                {/* Heading with fade-in effect */}
                <h1 className={`text-4xl md:text-5xl font-bold text-white mb-6 leading-tight transition-opacity duration-1000 ease-in-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  Welcome to FoodLogPro!
                </h1>

                {/* Paragraph with fade-in effect */}
                <p className={`text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed transition-opacity duration-1000 ease-in-out ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                  Your personalised meal tracker that helps you keep track of what you've been eating, plan your meals, and make healthier choices like a true pro.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-6 mt-6">
                  <button
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg py-3 px-10 rounded-full shadow-xl transition duration-500 ease-in-out transform ${showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      }`}
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </button>
                  <a
                    href="#about"
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg py-3 px-10 rounded-full no-underline shadow-xl transition duration-500 ease-in-out transform ${showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      }`}
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <a
                href="#about"
                className={`text-white transition-opacity duration-1000 ease-in-out ${showArrow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              >
                <FontAwesomeIcon icon={faChevronDown} className="text-4xl animate-bounce" />
              </a>
            </div>
          </header>

          <section id="about" className="w-full min-h-screen flex flex-col justify-between max-w-7xl text-center bg-white pt-32 pb-12 mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 mb-12">
              Why Use FoodLogPro?
            </h2>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div
                ref={(el) => (featureRefs.current[0] = el)}
                className="feature p-10 md:p-12 lg:p-14 rounded-lg bg-green-700 shadow-lg transform transition-transform duration-1000"
              >
                <FontAwesomeIcon icon={faUtensils} className="text-5xl text-gray-100 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">Track Your Meals</h3>
                <p className="text-lg text-gray-100">
                  Easily log meals and see how long it's been since you last had a certain dish.
                </p>
              </div>

              {/* Feature 2 */}
              <div
                ref={(el) => (featureRefs.current[1] = el)}
                className="feature p-10 md:p-12 lg:p-14 rounded-lg bg-green-700 shadow-lg transform transition-transform duration-1000"
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="text-5xl text-gray-100 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">Plan Ahead</h3>
                <p className="text-lg text-gray-100">
                  Stay organized by planning your weekly dinners, making it easier to eat balanced meals.
                </p>
              </div>

              {/* Feature 3 */}
              <div
                ref={(el) => (featureRefs.current[2] = el)}
                className="feature p-10 md:p-12 lg:p-14 rounded-lg bg-green-700 shadow-lg transform transition-transform duration-1000"
              >
                <FontAwesomeIcon icon={faChartLine} className="text-5xl text-gray-100 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-200 mb-4">Health Insights</h3>
                <p className="text-lg text-gray-100">
                  Discover patterns in your eating habits, helping you make healthier choices.
                </p>
              </div>
            </div>
            <a href="#testimonials" className="text-black mt-15 block">
              <FontAwesomeIcon icon={faChevronDown} className="text-4xl animate-bounce" />
            </a>
          </section>

          {/* Testimonials Section - White Background */}
          <section id="testimonials" className="w-full min-h-screen flex flex-col justify-between max-w-7xl mt-20 text-center bg-white pt-24 pb-16">
            <h2 className="text-4xl font-semibold text-gray-900 mt-24">
              What Our Users Say
            </h2>
            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 gap-12">

              {/* Testimonial 1 */}
              <div
                ref={(el) => (testimonialRefs.current[0] = el)}
                className="testimonial bg-gray-100 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between h-full"
              >
                <p className="text-lg text-gray-700 italic mb-6">
                  "FoodLogPro has completely changed how I approach dinner planning. I love the simplicity and ease of tracking!"
                </p>
                <img
                  src="https://i.ibb.co/HxsZB1c/Alex-T.png"
                  alt="Alex T"
                  className="w-48 h-48 rounded-full border-4 border-indigo-500 mb-6 shadow-lg"
                />
                <div className="flex justify-center">
                  <p className="text-xl text-gray-900 font-semibold">— Alex T.</p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div
                ref={(el) => (testimonialRefs.current[1] = el)}
                className="testimonial bg-gray-100 p-10 rounded-lg shadow-lg flex flex-col items-center justify-between h-full"
              >
                <p className="text-lg text-gray-700 italic mb-6">
                  "A fantastic tool for keeping track of my meals. I no longer struggle with deciding what to cook!"
                </p>
                <img
                  src="https://i.ibb.co/G3Trw1J/Sarah-H.png"
                  alt="Sarah H"
                  className="w-48 h-48 rounded-full border-4 border-indigo-500 mb-6 shadow-lg"
                />
                <div className="flex justify-center">
                  <p className="text-xl text-gray-900 font-semibold">— Sarah H.</p>
                </div>
              </div>
            </div>
            <a href="#cta" className="text-black mt-15 block">
              <FontAwesomeIcon icon={faChevronDown} className="text-4xl animate-bounce" />
            </a>
          </section>

          {/* Call to Action Section - White Background */}
          <div id="cta" ref={ctaRef} className="cta-section min-h-screen flex flex-col justify-evenly  mt-16 w-full max-w-7xl text-center bg-white py-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Make Meal Tracking Easy?
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Join FoodLogPro today and start your journey to healthier eating. Track meals, plan ahead, and get insightful health tips—all in one place.
              </p>
              <div className="flex justify-center gap-6 mt-6">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xl py-3 px-12 rounded-full shadow-lg transition duration-300 ease-in-out"
                  onClick={() => navigate("/register")}>
                  Join Now
                </button>
              </div>
            </div>
            <a href="#" className="text-black mt-15 block">
              <FontAwesomeIcon icon={faChevronUp} className="text-4xl animate-bounce" />
            </a>
          </div>
        </div></>}
    </>
  )
}

export default Home
