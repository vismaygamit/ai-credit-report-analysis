import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="bg-blue-50 text-center py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
            AI-Powered Credit Report Analysis in Seconds
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Understand your credit like never before. Our AI analyzes your
            credit reports to uncover insights, identify errors, and give you a
            clear action plan fast, simple, and secure.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              <Link to="/analyzer">Get Started</Link>
            </button>
            {/* <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition">Learn More</button> */}
          </div>
        </div>
      </section>
      <section className="py-10 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            🔍 What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                📊 Analyze Your Reports
              </h3>
              <p className="text-gray-600">Upload your credit report PDF</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                ⚠️ Detect Hidden Errors
              </h3>
              <p className="text-gray-600">
                Get alerted to potential mistakes or outdated information
                hurting your score like late payments
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">
                ✅ Get Personalized Insights
              </h3>
              <p className="text-gray-600">
                Receive clear, jargon-free recommendations tailored to your
                credit profile. Understand what actions can boost your score the
                most.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
