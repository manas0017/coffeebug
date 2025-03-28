import React from "react";
// import CustomerNavbar from "../CustomerNavbar/CustomerNavbar.jsx";
import CustomerFooter from "../CustomerFooter/CustomerFooter.jsx";

const Homepage = () => {
  return (
    <div>
      {/* <div><CustomerNavbar /></div> */}
      <div className="font-sans">
        <section className="relative text-center bg-[url('/img/landing.png')] bg-cover bg-center py-40">
          <h1 className="text-6xl" style={{ fontFamily: 'Kaoly Demo, sans-serif', color: '#1C3A41' }}>

            The<br></br>
            <span className="text-green-600">Coffee</span>
            <br></br>Bug
          </h1>



          <button className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg">Order Now</button>
        </section>
      </div>

      <section className="flex px-10 py-16 items-center">
        <div className="w-1/2">
          <h2 className="text-3xl font-bold">Customization</h2>
          <p className="mt-4 text-gray-600">
            <strong>Coffee Bug</strong> believes every coffee lover deserves a cup made their way! Customize your drink with a wide range of options.
          </p>
          <button className="mt-4 px-6 py-3 bg-blue-400 text-white rounded-lg">Customize</button>
        </div>
        <div className="w-1/2">
          <img src="/img/Customization.png" alt="Customization" className="rounded-lg shadow-md w-full" />
        </div>
      </section>
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">

          {/* Offer 1 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
            <img src="/img/CoffeeBeans.png" alt="Offer 1" className="w-full h-48 object-cover rounded-xl" />
            <h3 className="text-2xl font-semibold mt-4">Buy 1 Get 1 Free</h3>
            <p className="text-gray-600 mt-2">Enjoy our special BOGO offer on selected drinks.</p>
            <button className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-300">
              Claim Offer
            </button>
          </div>

          {/* Offer 2 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
            <img src="/img/Bakery.png" alt="Offer 2" className="w-full h-48 object-cover rounded-xl" />
            <h3 className="text-2xl font-semibold mt-4">20% Off All Custom Drinks</h3>
            <p className="text-gray-600 mt-2">Personalize your coffee and get a 20% discount!</p>
            <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition duration-300">
              Grab Now
            </button>
          </div>

          {/* Offer 3 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
            <img src="/img/Purpledrink.png" alt="Offer 3" className="w-full h-48 object-cover rounded-xl" />
            <h3 className="text-2xl font-semibold mt-4">Free Pastry with Large Coffee</h3>
            <p className="text-gray-600 mt-2">Order any large coffee and get a free pastry of your choice.</p>
            <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-300">
              Order Now
            </button>
          </div>

        </div>
      </section>

      <CustomerFooter />

      <h1>this home page for customer</h1>
    </div>
  )
}

export default Homepage;
