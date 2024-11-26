import React from "react";
import Tag1 from "../images/culture.webp";
import Tag2 from "../images/art.jpeg";
import Tag3 from "../images/tradition.jpeg";
import Tag4 from "../images/handicrafts.jpeg";
import Tag5 from "../images/food.jpeg";
import Tag6 from "../images/tag-travel-cover.webp";
import Tag7 from "../images/tag-food-cover.webp";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
const Tags = () => {
  return (
    <>
    <Header2/>
    <section className="mt-12 px-24 max-sm:px-4">
      <h2 className="text-center text-5xl text-slate-800 font-semibold">
        Categories
      </h2>
      <div className="tagContainer flex flex-wrap gap-8 mt-12 justify-center">
        <div className="tagCard border border-neutral-200 rounded-lg w-80 flex items-center justify-between p-5">
          <div className="tagDesc">
            <h5 className="text-xl font-semibold text-slate-800">
            Culture
            </h5>
            <small className="text-base text-neutral-600">6 posts</small>
          </div>
          <div className="img">
            <img src={Tag1} className="rounded-md" alt="" />
          </div>
        </div>
        <div className="tagCard border border-neutral-200 rounded-lg w-80 flex items-center justify-between p-5">
          <div className="tagDesc">
            <h5 className="text-xl font-semibold text-slate-800">
            Art
            </h5>
            <small className="text-base text-neutral-600">6 posts</small>
          </div>
          <div className="img">
            <img src={Tag2} className="rounded-md" alt="" />
          </div>
        </div>
        <div className="tagCard border border-neutral-200 rounded-lg w-80 flex items-center justify-between p-5">
          <div className="tagDesc">
            <h5 className="text-xl font-semibold text-slate-800">
            Tradition
            </h5>
            <small className="text-base text-neutral-600">6 posts</small>
          </div>
          <div className="img">
            <img src={Tag3} className="rounded-md" alt="" />
          </div>
        </div>
        <div className="tagCard border border-neutral-200 rounded-lg w-80 flex items-center justify-between p-5">
          <div className="tagDesc">
            <h5 className="text-xl font-semibold text-slate-800">
            Handicrafts
            </h5>
            <small className="text-base text-neutral-600">6 posts</small>
          </div>
          <div className="img">
            <img src={Tag4} className="rounded-md" alt="" />
          </div>
        </div>
        <div className="tagCard border border-neutral-200 rounded-lg w-80 flex items-center justify-between p-5">
          <div className="tagDesc">
            <h5 className="text-xl font-semibold text-slate-800">
            Food
            </h5>
            <small className="text-base text-neutral-600">6 posts</small>
          </div>
          <div className="img">
            <img src={Tag5} className="rounded-md" alt="" />
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default Tags;