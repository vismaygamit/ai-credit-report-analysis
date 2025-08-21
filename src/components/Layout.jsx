import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
     {/* <div className="min-h-screen bg-gray-50 font-sans text-gray-800"> */}
      <Header />
      <main className="flex-grow mx-auto container">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
