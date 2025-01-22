function SearchBar() {

    return (
        <>
            <div className={` box-border h-[300px] bg-gray-600 dark:bg-gray-700 pt-10`}>
                <h1 className="font-bold text-3xl text-center motion-preset-typewriter-[25] motion-duration-[7s] mx-auto text-white">Busca Cualquier tema...</h1>
                <div className="relative w-full max-w-[90%] sm:max-w-[400px] mt-10 mx-auto">
                    <input
                        id="home-search"
                        type="search"
                        className={`block w-full h-[40px] sm:h-[45px] rounded-lg shadow-lg outline-none pl-12 pr-4 text-sm sm:text-base bg-white dark:bg-white dark:text-gray-700 focus:ring-2 focus:ring-cyan-500`}
                        placeholder="Buscar..."
                    />
                    <svg
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                    </svg>
                </div>
            </div>
            <div className="custom-shape-divider-top-1733114191">
            <svg  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" ><path  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill text-gray-600 dark:text-gray-700" fill="currentColor" fillOpacity="1"></path></svg>
            </div>

        </>
    )
}

export default SearchBar