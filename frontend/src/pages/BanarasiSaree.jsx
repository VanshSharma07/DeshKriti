import React from "react";
import author3 from "../images/biswajit.webp";
import girlImg from "../images/saree.jpeg";
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
const BanarasiSaree = () => {
  return (
    <>
    <Header2/>
    <main className=" mt-12 px-24 max-sm:px-4">
      <section className="w-10/12 max-md:w-full mx-auto">
        <div className="blogHeader">
          <h1 className="text-5xl text-slate-800 max-sm:text-3xl max-sm:text-center font-semibold">
          Banarasi Sarees: Where Every Thread Weaves a Tale of Timeless Elegance and Cultural Splendor.
          </h1>
          <div className="metaData mt-5 flex max-sm:flex-col max-sm:gap-2 items-center gap-8">
            <div className="author flex items-center gap-2">
              <img
                src={author3}
                width={30}
                height={30}
                className="rounded-full"
                alt=""
              />
              <h4 className="text-base font-medium text-slate-800 hover:underline underline-offset-8">
                <Link to="">Biswajit Saha</Link>
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
          India’s rich cultural tapestry is best represented by its textiles, and among them, the Banarasi saree stands as a crown jewel. Originating from the holy city of Varanasi (Banaras), these sarees are not just garments but a legacy of art, tradition, and heritage woven into six yards of elegance.


          </p>
          <p className="text-slate-800 text-lg text-justify mt-3">
          The origins of Banarasi sarees trace back to the Mughal era when Persian-inspired designs merged with Indian handloom techniques, giving birth to a unique blend of opulence and intricate craftsmanship. These sarees, historically reserved for royalty, were crafted from pure silk and adorned with gold and silver threads, making them symbols of wealth and status.
          </p>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          Intricate Designs: A Symphony of Detail
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          What makes a Banarasi saree distinctive is its intricate motifs and patterns. Inspired by Mughal architecture, flora, and fauna, the designs include jhallar (lace-like patterns on the border), butidar (richly woven motifs), and meenakari (embroidery with vibrant colors). Each piece is a testament to the unparalleled skill of Banaras weavers, who often spend months perfecting a single saree.
          </p>
          <div className="blockquote italic px-5 py-4 rounded-lg mt-4 bg-slate-800">
            <FormatQuoteOutlinedIcon className="text-slate-700 !text-7xl " />
            <p className="text-xl text-white">
            "Draped in a Banarasi saree, you don't just wear fabric—you wear centuries of artistry, tradition, and grace."
            </p>
          </div>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          A Timeless Symbol of Indian Heritage
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
            Banarasi sarees have transcended time to remain one of the most sought-after attires for Indian weddings and festivals. The saree drapes every bride in elegance, reflecting her connection to Indian culture and history. Its timeless appeal has also captured global attention, with designers incorporating its motifs and patterns into contemporary fashion.
            
            Efforts are being made to revive and sustain the Banarasi saree industry. Government initiatives, collaborations with fashion designers, and e-commerce platforms are helping artisans reach wider markets. Additionally, campaigns promoting "Make in India" have rejuvenated interest in Banarasi sarees globally.
            
           
            Banarasi sarees are not just garments; they are heirlooms, embodying the soul of Indian artistry. Every thread tells a story of dedication, culture, and timeless beauty. Owning a Banarasi saree is akin to owning a piece of history, a treasure that bridges the past with the present, and continues to inspire generations with its elegance and tradition.
            
           
           
            </p>
          <div className="share text-center mt-12">
            <h4 className="text-xl text-slate-800 font-medium">
            "A tradition woven into timeless elegance."
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
  );
};

export default BanarasiSaree;