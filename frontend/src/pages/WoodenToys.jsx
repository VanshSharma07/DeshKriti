import React from "react";
import author3 from "../images/biswajit.webp";
import girlImg from "../images/toys.jpeg";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";

const WoodenToys = () => {
  return (
    <>
    <Header2/>
    <main className=" mt-12 px-24 max-sm:px-4">
      <section className="w-10/12 max-md:w-full mx-auto">
        <div className="blogHeader">
          <h1 className="text-5xl text-slate-800 max-sm:text-3xl max-sm:text-center font-semibold">
          Indian Wooden Toys: Where Craftsmanship Meets Cultural Legacy
          </h1>
          <div className="metaData mt-5 flex max-sm:flex-col max-sm:gap-2 items-center gap-8">
            <div className="author flex items-center gap-2">
              <img
                src={author3}
                width={30}
                height={30}
                className="rounded-full"
                alt="Wooden Toys"
              />
              <h4 className="text-base font-medium text-slate-800 hover:underline underline-offset-8">
                <Link to="">Harini Banerjee</Link>
              </h4>
            </div>
            <ul className="list-disc text-base text-neutral-600 flex items-center gap-8">
              <li>March 16, 2022</li>
              <li>2 min read</li>
            </ul>
          </div>
        </div>
        <div className="blogCoverImg mt-8">
          <img
            src={girlImg}
            className="w-full object-cover rounded-xl"
            alt=""
          />
        </div>
        <div className="blogContent mt-3">
          <p className="text-slate-800 text-lg text-justify">
          India’s rich cultural tapestry is not only reflected in its textiles but also in its timeless crafts, and Indian wooden toys stand as a unique symbol of this heritage. Rooted in tradition and celebrated for their craftsmanship, these toys are not just playthings but a medium to preserve culture and artistic expression.


The origins of Indian wooden toys can be traced back to ancient times, with references found in texts like the Mahabharata and ancient temples showcasing carvings of wooden toys. Crafted predominantly by skilled artisans from regions like Channapatna in Karnataka, Varanasi in Uttar Pradesh, and Kondapalli in Andhra Pradesh, these toys use locally sourced wood like ivory wood and teak.

          </p>
          <p className="text-slate-800 text-lg text-justify mt-3">
          The origins of Banarasi sarees trace back to the Mughal era when Persian-inspired designs merged with Indian handloom techniques, giving birth to a unique blend of opulence and intricate craftsmanship. These sarees, historically reserved for royalty, were crafted from pure silk and adorned with gold and silver threads, making them symbols of wealth and status.
          </p>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          A Symphony of Colors and Craft
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          What sets Indian wooden toys apart is their vibrant use of natural dyes and intricate designs. From miniature animal figures to detailed human forms and mythological characters, each toy reflects India’s diverse cultural narrative. The craft of toy-making often involves techniques passed down through generations, preserving the authenticity and charm of the art.
          </p>
          <div className="blockquote italic px-5 py-4 rounded-lg mt-4 bg-slate-800">
            <FormatQuoteOutlinedIcon className="text-slate-700 !text-7xl " />
            <p className="text-xl text-white">
            "An Indian wooden toy is more than a plaything; it’s a piece of culture carved with love."
            </p>
          </div>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          Sustainability and Significance
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          In a world dominated by plastic, Indian wooden toys represent a sustainable and eco-friendly alternative. Their production employs natural materials and dyes, making them safe for children and kind to the environment. Beyond sustainability, they also play an educational role, introducing children to India’s cultural stories and traditions.

Efforts to revive and sustain this craft are gaining momentum, with government initiatives, NGOs, and e-commerce platforms helping artisans showcase their work globally. The rise of “Make in India” has further boosted interest in these heritage crafts.
            </p>
          <div className="share text-center mt-12">
            <h4 className="text-xl text-slate-800 font-medium">
            "Crafted with care, these wooden toys are tradition’s gift to the future."
            </h4>
            <ul className="flex justify-center gap-5 max-sm:gap-3 mt-5">
              <li>
                <Link className="bg-zinc-100 p-2 flex justify-center items-center w-fit text-slate-800 rounded-full">
                  <FacebookOutlinedIcon />
                </Link>
              </li>
              <li>
                <Link className="bg-zinc-100 p-2 flex justify-center items-center w-fit text-slate-800 rounded-full">
                  <TwitterIcon />
                </Link>
              </li>
              
              <li>
                <Link className="bg-zinc-100 p-2 flex justify-center items-center w-fit text-slate-800 rounded-full">
                  <LinkedInIcon />
                </Link>
              </li>
              <li>
                <Link className="bg-zinc-100 p-2 flex justify-center items-center w-fit text-slate-800 rounded-full">
                  <MailOutlineOutlinedIcon />
                </Link>
              </li>
              <li>
                <Link className="bg-zinc-100 p-2 flex justify-center items-center w-fit text-slate-800 rounded-full">
                  <LinkOutlinedIcon />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    
    </main>
    <Footer/>
    </>
  )
}

export default WoodenToys