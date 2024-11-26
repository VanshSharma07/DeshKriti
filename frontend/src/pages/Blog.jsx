import React from "react";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import HeroImg from "../images/hero.png";
import FeaturedPost from "../components/FeaturedPost";
import LatestPost from "../components/LatestPost";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
const Blog = () => {
  return (
    <>
    <Header2 />
      <main className="px-24 max-sm:px-5">
        <section className="hero flex justify-between gap-4 items-center max-md:flex-col">
          <div className="content flex flex-col gap-6 w-full">
            <h1 className="text-slate-800 text-6xl font-bold">
              DESHKRITI
            </h1>
            <p className="text-slate-800 text-2xl">
              India's Heritage at your doorstep. Explore the rich heritage of India with us. We bring you the best of Indian culture, history, and art.
            </p>
            <div className="subscribeBox flex gap-3">
          
            
            </div>
            <div className="socialLinkContainer flex gap-3 items-center">
              <h5>Follow:</h5>
              <ul className="flex gap-3 text-slate-800">
                <li>
                  <Link>
                    <TwitterIcon />
                  </Link>
                </li>
                <li>
                  <Link>
                    <FacebookIcon />
                  </Link>
                </li>
                <li>
                  <Link>
                    <InstagramIcon />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="img flex justify-center max-md:hidden">
            <img src={HeroImg} className="rounded-full w-48 h-auto" alt="" />
          </div>
        </section>
        <FeaturedPost />
        <LatestPost />
      </main>
      <Footer />
    </>
  );
};

export default Blog;
