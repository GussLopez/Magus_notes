
import {  useDarkMode } from "../interfaces/DarkMode";
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import Footer from "../components/Footer";

function Dashboard() {
    const { isDarkMode } = useDarkMode();

    return (
        <>
            <div className="max-w-screen-lg mx-auto px-2">
                <h1 className="text-4xl font-extrabold my-10">Time Boxing ⏰</h1>
                <div className="md:grid md:grid-cols-2 gap-10">
                    <div className={` ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-5 mb-10 md:mb-0`}>
                        <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-2xl font-bold mb-10`}>Ventas</h3>
                        <p className="mt-3 text-lg text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum enim saepe nemo, beatae cumque hic aliquam</p>
                        <div className="flex justify-between mt-24">
                            <p>Name</p>
                            <p>06 - 11 - 2024</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-10 md:mb-0">
                        <h2 className="text-2xl font-bold mb-4">Ventas Mensuales</h2>
                        <BarChart />
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-10 md:mb-0">
                        <h2 className="text-2xl font-bold mb-4">Distribución</h2>
                        <PieChart />
                    </div>

                    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-5 mb-10 md:mb-0` }>
                        <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-2xl font-bold mb-10`}>Horas productivas</h3>
                        <p className="mt-3 text-lg text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum enim saepe nemo, beatae cumque hic aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum enim saepe nemo, beatae cumque hic aliquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum enim saepe nemo, beatae cumque hic aliquam</p>
                        <div className="flex justify-between mt-36">
                            <p>Name</p>
                            <p>06-11-2024</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Dashboard