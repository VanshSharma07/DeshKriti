import React from "react";
import { Link } from "react-router-dom";
import Header2 from "../components/Header2";
import Footer from "../components/Footer";
function MonthArchive() {
  return (
    <>
    <Header2/>
      <main className="mt-12 px-24 max-sm:px-4">
        <section className=" flex items-center flex-col">
          <h2 className="text-center text-5xl text-slate-800 font-semibold">
            Monthly Archive
          </h2>
          <div className="archiveContainer w-2/3 max-sm:w-11/12 mt-12 flex flex-col gap-6">
            <div className="archiveCard flex flex-col gap-2">
              <h4 className="text-blue-600 text-2xl font-medium">May 2022</h4>
              <hr />
              <ul className="mt-5 flex flex-col gap-5">
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
              </ul>
            </div>
            <div className="archiveCard flex flex-col gap-2">
              <h4 className="text-blue-600 text-2xl font-medium">May 2022</h4>
              <hr />
              <ul className="mt-5 flex flex-col gap-5">
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
              </ul>
            </div>
            <div className="archiveCard flex flex-col gap-2">
              <h4 className="text-blue-600 text-2xl font-medium">May 2022</h4>
              <hr />
              <ul className="mt-5 flex flex-col gap-5">
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
              </ul>
            </div>
            <div className="archiveCard flex flex-col gap-2">
              <h4 className="text-blue-600 text-2xl font-medium">May 2022</h4>
              <hr />
              <ul className="mt-5 flex flex-col gap-5">
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
                  </Link>
                </li>
                <li>
                  <span className="text-neutral-600 text-base">May 04</span> -{" "}
                  <Link
                    to=""
                    className="text-lg font-medium text-slate-800 hover:underline underline-offset-7"
                  >
                    Autumn is a second spring when every leaf is a flower
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
}

export default MonthArchive;