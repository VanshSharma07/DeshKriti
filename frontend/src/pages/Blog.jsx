import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const Blog = ({ article }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <img src={article.image} alt={article.title} className="w-full h-96 object-cover mb-6" />
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-gray-600 mb-4">Publié le {new Date(article.date).toLocaleDateString()}</p>
            <div className="mb-4 text-lg leading-relaxed">{article.content}</div>

            <div className="flex justify-between items-center mt-4">
                <Link to="/" className="text-blue-600 hover:underline">Retour au blog</Link>
                <div className="flex items-center gap-2">
                    <span>Partager : </span>
                    <a href={`https://twitter.com/share?url=${window.location.href}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Twitter</a>
                    <a href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Facebook</a>
                </div>
            </div>

            <section className="mt-10">
                <h3 className="text-2xl font-semibold">Articles connexes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {/* Affichage des articles similaires */}
                    {article.relatedArticles.map(related => (
                        <div key={related._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                            <img src='' alt={related.title} className="w-full h-40 object-cover mb-4" />
                            <h4 className="text-xl font-semibold mb-2">{related.title}</h4>
                            <Link to={`/article/${related.slug}`} className="text-blue-600 hover:underline">Lire plus</Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Blog;
