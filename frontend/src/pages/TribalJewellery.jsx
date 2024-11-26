import React from "react";
import author3 from "../images/biswajit.webp";
import girlImg from "../images/jewelry.jpeg";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Footer from "../components/Footer";
import Header2 from "../components/Header2";

const TribalJewellery = () => {
  return (
    <>
    <Header2/>
    <main className=" mt-12 px-24 max-sm:px-4">
      <section className="w-10/12 max-md:w-full mx-auto">
        <div className="blogHeader">
        <h1 className="text-5xl text-slate-800 max-sm:text-3xl max-sm:text-center font-semibold">
        Tribal Jewelry of India: A Sparkling Tribute to Ethnic Heritage
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
                <Link to="">Lakshmi Iyer</Link>
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
          India’s cultural richness finds its most vibrant expression in its tribal jewelry, a testament to the country’s ethnic diversity and artistic heritage. Rooted in age-old traditions, tribal jewelry is more than adornment; it’s a reflection of identity, spirituality, and a way of life.

          </p>
          <p className="text-slate-800 text-lg text-justify mt-3">
          The origins of Indian tribal jewelry trace back to ancient civilizations, where it was used not only for aesthetics but also for rituals, social status, and protection against evil spirits. Crafted by tribes across regions like Bastar in Chhattisgarh, Bhuj in Gujarat, and Orissa’s Santals, this jewelry incorporates natural materials like beads, shells, bones, and metals, each holding cultural significance.
          </p>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          A Fusion of Nature and Craft
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          What makes tribal jewelry truly unique is its raw beauty and deep connection to nature. Crafted with basic tools, these ornaments feature bold designs—chunky necklaces, layered bangles, and intricately carved earrings. The patterns often draw inspiration from flora, fauna, and tribal myths, encapsulating the spirit of their makers.
          </p>
          <div className="blockquote italic px-5 py-4 rounded-lg mt-4 bg-slate-800">
            <FormatQuoteOutlinedIcon className="text-slate-700 !text-7xl " />
            <p className="text-xl text-white">
            "Tribal jewelry is not just an accessory; it’s the essence of a culture worn with pride."
            </p>
          </div>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          Cultural Significance and Revival
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          For India’s tribal communities, jewelry is an integral part of life, symbolizing marital status, fertility, and spiritual beliefs. However, modernity and industrialization have challenged this craft, making its preservation vital. Today, government programs, NGOs, and platforms like exhibitions and online marketplaces are helping artisans sustain their craft and connect with global audiences.

          Tribal jewelry also resonates with sustainability—it uses eco-friendly materials and handcrafted techniques, making it a mindful fashion choice in a mass-produced world. Its timeless appeal has captured the attention of contemporary designers, who incorporate tribal elements into modern accessories.

          Indian tribal jewelry is not merely ornamental; it’s a celebration of India’s ethnic diversity and the artistry of its indigenous communities. By embracing this craft, we honor a legacy of resilience, creativity, and cultural pride.
            
           
           
            </p>
          <div className="share text-center mt-12">
            <h4 className="text-xl text-slate-800 font-medium">
            "Adorn yourself with tribal jewelry—carry a piece of India’s soulful heritage with you." 
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

export default TribalJewellery;