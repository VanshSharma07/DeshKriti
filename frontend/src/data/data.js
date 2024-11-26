import author1 from "../images/suravi.webp";
import author2 from "../images/harini.webp";
import author3 from "../images/biswajit.webp";
import author4 from "../images/ishan.webp";
import author5 from "../images/Apurba.webp";

// blog post img
import girlImg from "../images/saree.jpeg";
import girlImg2 from "../images/toys.jpeg";
import travelImg from "../images/jewelry.jpeg";
import techImg from "../images/pottery.jpeg";
import foodImg from "../images/spices.jpeg";

const AuthorData = [
  {
    name: "Minerva",
    location: "India",
    posts: 6,
    desc: "Minerva is a writer with a love for culinary traditions and the art of storytelling. Her explorations of Indian spices capture their flavors and their role in shaping cultural narratives.",
    img: author1,
  },
  {
    name: "Harini Banerjee",
    location: "India",
    posts: 4,
    desc: "Harini Banerjee is a historian and art enthusiast who delves into the ethnic treasures of India. Her insightful blogs on tribal jewelry reveal its intricate beauty and the cultural diversity it represents.",
    img: author2,
  },
  {
    name: "Biswajit Saha",
    location: "India",
    posts: 4,
    desc: "A connoisseur of Indian heritage and culture, Biswajit Saha brings history to life through his eloquent writing. With a deep passion for traditional crafts, he explores the stories behind India's timeless artistry.",
    img: author3,
  },
  {
    name: "Alex",
    location: "India",
    posts: 3,
    desc: "A seasoned writer with an eye for detail, Alex celebrates India's age-old traditions through his work. His pieces on wooden toys reflect his appreciation for craftsmanship and sustainability..",
    img: author4,
  },
  {
    name: "Harry",
    location: "India",
    posts: 3,
    desc: "Harry is is an avid lover of ceramics and Indian handicrafts. His blogs on pottery artfully narrate the evolution of this timeless craft, from its humble beginnings to its global acclaim.",
    img: author5,
  },
];
const BlogPosts = [
  {
    img: girlImg,
    tag: "Culture",
    title: "Banarasi Sarees: Threads of Elegance and Tradition",
    desc: "Discover the intricate weaving techniques and cultural heritage behind Banarasi sarees, cherished by Indian communities worldwide.",
    date: "November 18, 2024",
    posttype: "feature",
    route: '/banarasi-saree'
  },
  {
    img: girlImg2,
    tag: "Art",
    title: "Indian Wooden Toys: Craftsmanship Rooted in Tradition",
    desc: "Explore the artistry of Channapatna and Kondapalli toys, offering a nostalgic connection to Indian childhoods.",    
    date: "November 15, 2024",
    posttype: "feature",
    route: '/wooden-toys',
  },
  {
    img: travelImg,
    tag: "Tradition",
    title: "Tribal Jewelry of India: A Celebration of Ethnic Diversity",
    desc: "Delve into the vibrant world of Indian tribal jewelry, a perfect blend of culture, craft, and identity.",
    date: "November 12, 2024",
    posttype: "latest",
    route: '/tribal-jewelry',

  },
  {
    img: techImg,
    tag: "Handicrafts",
    title: "The Art of Indian Pottery: From Terracotta to Blue Pottery",
    desc: "Uncover the beauty and functionality of Indian pottery traditions, cherished by artisans and collectors alike.",
    date: "November 10, 2024",
    posttype: "latest",
    route: '/indian-pottery',

  },
  {
    img: foodImg,
    tag: "Food",
    title: "Indian Spices: The Heart of Our Culinary Heritage",
    desc: "Celebrate the spices that define Indian cuisine, from Kerala’s pepper to Gujarat’s cumin, connecting the diaspora to authentic flavors.",
    date: "November 8, 2024",
    posttype: "latest",
    route: '/indian-spices',

  },
];


export default { AuthorData, BlogPosts };