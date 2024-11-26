import React from "react";
import author3 from "../images/biswajit.webp";
import girlImg from "../images/pottery.jpeg";
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
const Pottery = () => {
  return (
    <>
    <Header2/>
    <main className=" mt-12 px-24 max-sm:px-4">
      <section className="w-10/12 max-md:w-full mx-auto">
        <div className="blogHeader">
          <h1 className="text-5xl text-slate-800 max-sm:text-3xl max-sm:text-center font-semibold">
          The Art of Indian Pottery: From Terracotta to Blue Pottery
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
          India’s pottery tradition is a remarkable tapestry of artistry and heritage, reflecting the country’s diverse cultures and centuries-old craftsmanship. From humble terracotta wares to the vibrant hues of Jaipur’s blue pottery, Indian pottery is a symbol of creativity and cultural depth.

          </p>
          <p className="text-slate-800 text-lg text-justify mt-3">
          The origins of Indian pottery date back to the Indus Valley Civilization, where earthenware served as a utility and an art form. Over the centuries, regional techniques and styles evolved, giving rise to diverse forms like the intricate terracotta figurines of West Bengal, the glazed blue pottery of Rajasthan, and the black pottery of Nizamabad.
          </p>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          A Blend of Craftsmanship and Aesthetic
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          Each style of Indian pottery tells a unique story. Terracotta, one of the earliest forms, embodies rustic charm with its earthy tones and intricate carvings, often inspired by nature and mythology. Blue pottery, on the other hand, stands out for its Persian influence, featuring floral patterns and vibrant cobalt blue hues. The use of eco-friendly materials and hand-crafted techniques adds an enduring charm to every piece.
          </p>
          <div className="blockquote italic px-5 py-4 rounded-lg mt-4 bg-slate-800">
            <FormatQuoteOutlinedIcon className="text-slate-700 !text-7xl " />
            <p className="text-xl text-white">
            "Indian pottery is more than clay—it’s history, culture, and imagination shaped into art."
            </p>
          </div>
          <h3 className="text-3xl text-slate-800 font-semibold mt-5">
          Sustainability and Revival
          </h3>
          <p className="text-slate-800 text-lg text-justify mt-3">
          In today’s world, Indian pottery represents sustainable artistry. Made from natural resources like clay and minerals, it offers an eco-conscious alternative to synthetic materials. Despite its rich heritage, the pottery industry has faced challenges due to industrialization and declining patronage.

          Efforts to revive this craft are flourishing, with government initiatives, artisan workshops, and online platforms creating new opportunities for potters. The global popularity of handmade decor has also reignited interest in these traditional crafts. Contemporary designers are fusing ancient styles with modern sensibilities, bringing Indian pottery into the global spotlight.

          Indian pottery is not just about aesthetics—it’s a connection to India’s cultural roots. From terracotta to blue pottery, each piece embodies the skill, imagination, and soul of its creator.
            
           
           
            </p>
          <div className="share text-center mt-12">
            <h4 className="text-xl text-slate-800 font-medium">
            "When you hold Indian pottery, you hold a timeless story shaped by hands and history."
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

export default Pottery;