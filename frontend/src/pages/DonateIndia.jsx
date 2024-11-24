import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCampaigns } from "../store/reducers/campaignReducer";
import CampaignCard from "../components/CampaignCard";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import Footer from "../components/Footer";
import Header2 from "../components/Header2";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const DonateIndia = () => {
  const dispatch = useDispatch();
  const { campaigns = [], loading } = useSelector((state) => state.campaign);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    "All",
    "Education",
    "Healthcare",
    "Disaster Relief",
    "Cultural Preservation",
    "Community Development",
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        await dispatch(getCampaigns("active")).unwrap();
      } catch (error) {
        toast.error(error.message || "Failed to fetch campaigns");
      }
    };

    fetchCampaigns();
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    const formattedCategory = category === "All" ? "all" : category;
    setSelectedCategory(formattedCategory);
    setIsMenuOpen(false);
  };

  const filteredCampaigns = Array.isArray(campaigns)
    ? campaigns.filter((campaign) => {
        const matchesSearch =
          campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign?.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          campaign?.category?.toLowerCase() === selectedCategory?.toLowerCase();

        return matchesSearch && matchesCategory;
      })
    : [];

  const CategoryButtons = ({ className = "", isSidebar = false }) => (
    <div className={className}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategorySelect(category)}
          className={`
                        ${
                          isSidebar
                            ? "w-full text-left px-4 py-2 rounded-md"
                            : "px-4 py-2 rounded-full whitespace-nowrap"
                        }
                        transition-all duration-300
                        ${
                          selectedCategory === category.toLowerCase()
                            ? "bg-blue-600 text-white" +
                              (isSidebar
                                ? ""
                                : " shadow-lg transform scale-105")
                            : isSidebar
                            ? "text-gray-700 hover:bg-gray-100"
                            : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                        }
                    `}>
          {category}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Header2 />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Donate India</h1>

          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Left side - Search and Large Screen Menu Button */}
              <div className="flex w-full lg:w-auto items-center gap-4">
                <div className="relative flex-grow lg:flex-grow-0 lg:w-64">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 rounded-full border-2 border-gray-200 
                                                 focus:outline-none focus:border-blue-500 focus:ring-2 
                                                 focus:ring-blue-200 transition-all duration-300 
                                                 shadow-sm hover:shadow-md text-sm"
                    />
                  </div>
                </div>

                {/* Large Screen Menu Button */}
                <button
                  className="hidden lg:block bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>

              {/* Small Screen Category Menu */}
              <CategoryButtons className="lg:hidden flex gap-2 flex-wrap justify-center overflow-x-auto" />
            </div>

            {/* Large Screen Sidebar Menu */}
            {isMenuOpen && (
              <div className="hidden lg:block fixed inset-0 z-50">
                <div
                  className="absolute inset-0 bg-gray-800 bg-opacity-50"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Categories</h3>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-500 hover:text-gray-700">
                        <FaTimes />
                      </button>
                    </div>
                    <CategoryButtons
                      className="flex flex-col gap-2"
                      isSidebar={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          )}

          {!loading && filteredCampaigns.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No campaigns found matching your criteria
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonateIndia;
