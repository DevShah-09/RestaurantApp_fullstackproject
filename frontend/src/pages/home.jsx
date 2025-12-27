import API, { SetAuthToken } from '../api/api';
import {useState , useEffect} from 'react';
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'


const categories=[
  {key:"starters",label:"Starters"},
  {key:"main_course",label:"Main Course"},
  {key:"desserts",label:"Desserts"},
  {key:"drinks",label:"Drinks"},
  {key:"Specials",label:"Specials"},
];

const Home=()=>{

  const navigate = useNavigate();
  const [restaurantData,setRestaurantData] = useState(null);
  const [selectedCategory,setSelectedCategory]=useState(null);
  const [menuItems,setMenuItems]=useState([]);
  const [loading,setLoading]=useState(false);

  //extracting QR token from URL or sessionStorage
  const urlToken = new URLSearchParams(window.location.search).get('qr');
  const qrtoken = urlToken || sessionStorage.getItem('qrtoken');

  //fetch the restaurant and table details
  useEffect(()=>{
    if(!qrtoken) return;
    const fetchDetails=async()=>{
      try{
        const res=await API.get(`api/restaurants/by-qr/${qrtoken}/`);
        setRestaurantData(res.data);
        // Store QR token in sessionStorage for menu page (cleared on browser close)
        sessionStorage.setItem('qrtoken', qrtoken);
      }catch(err) {console.error(err);}
    };
    fetchDetails();
  },[qrtoken]);


  //fetch the menu of the respective restaurant 
  useEffect(()=>{
    if(!selectedCategory || !restaurantData) return;

    const fetchMenu=async()=>{
      setLoading(true);
      try{
        const restaurantId = restaurantData.restaurant_id || restaurantData.id;
        const res=await API.get(`api/restaurants/${restaurantId}/menu/`);
        const find_category=res.data.filter(item => item.meal_type.toLowerCase()===selectedCategory);
        setMenuItems(find_category);
      }catch(err) {console.error(err);}
      setLoading(false);
    };
    fetchMenu();
  },[selectedCategory,restaurantData]);

  return(
    <div 
      className="min-h-screen flex flex-col justify-between items-center"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
    >
      <motion.header
        initial={{ opacity:0 , y:-20 }}
        animate={{ opacity:1 , y:0 }}
        transition={{ duration:0.4 }}
        className="text-red-950 text-6xl text-center font-extrabold pt-7" 
      >
      <h1 className="flex flex-wrap justify-center">
      {restaurantData ? restaurantData.restaurant_name.split("").map(
        (char,index) => (
          <motion.span
            key={index}
            initial={{opacity:0 , y:-50}}
            animate={{opacity:1 , y:0}}
            transition={{delay:index*0.1 , duration:0.5 ,ease:"easeOut"}}
          >
            {char=== " " ? "\u00A0" : char}
          </motion.span>
        )
      ): 'Our Restaurant'}</h1>
      </motion.header>
      <h2 className="bg-yellow-200 text-slate-800 text-4xl font-bold mt-2 mb-3 px-4 py-4 rounded-3xl">Select a Category</h2>
      <div className="text-4xl font-semibold flex flex-col gap-7">
        {categories.map(
          (cat) => (
          <motion.button
            key={cat.key}
            whileTap={{ scale: 1.5  }} 
            onClick={() => navigate(`/menu/${cat.key.toLowerCase()}`)}
            className={`px-4 py-4 rounded-lg text-white bg-stone-950 hover:bg-stone-800`}
          >
            {cat.label}
          </motion.button>
          )
        )}
      </div>

      <div className="w-full flex justify-center">
        <img src="/images/chef.png" alt="Chef" className="w-72 h-auto rounded-full shadow-lg"/>
      </div>

    </div>
  );

}

export default Home;



