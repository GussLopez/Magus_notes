import nosotrosDark from "../assets/nosotros-img-negro.jpg"
import nosotrosWhite from "../assets/nosotros-img-blanco.jpg"
import Footer from "@/components/Footer";
import { useDarkMode } from "@/interfaces/DarkMode";

const Nosotros = () => {
  const {isDarkMode} = useDarkMode()

    return (
      <>
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-2 min-h-screen pt-[50px]">
          <div className="md:grid md:grid-cols-2 md:gap-10">
            <div className="flex flex-col md:justify-center">
              <p className="dark:text-gray-300 font tracking-[6px] font-light">SOBRE NOSOTROS</p>
              <h1 className="font-semibold text-6xl text-gray-900 dark:text-white leading-[60px]">Potenciando el éxito <span className="green-doodle">estudiantil</span> a través del poder de las notas.</h1>
              <p className="mt-5 leading-8 text-lg font-medium dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, culpa fugiat sapiente atque quia nihil eveniet suscipit porro, qui ducimus molestiae! Quibusdam sapiente consequatur maxime at, veniam labore consequuntur cupiditate!</p>
            </div>
            <div className="max-w-[500px] mx-auto md:max-w-full h-auto">
            <img src={isDarkMode ? nosotrosDark : nosotrosWhite} alt="nosotros imagen" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  };
  
  export default Nosotros;