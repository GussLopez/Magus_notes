import Clip from "../assets/paperclip.svg"
import Plus from "../assets/plus-lg.svg"
function Sidebar() {

    return (
    <>
    <div className="fixed top-30 left-0  w-16 m-0 flex flex-col text-white ">
        <SideBarIcon icon={<img src={Plus} alt="Plus icon" />} text="Crear Nota"/>
        <SideBarIcon icon={<img src={Clip} alt="Moon icon" />} text="Mis Notas"/>
    </div>
    </>
    )  
}

interface SideBarIconProps {
    icon: React.ReactNode;
    text?: string;
}

const SideBarIcon = ({ icon, text /* = 'Tooltip ⚡' */}: SideBarIconProps) => (
    <div className={`sidebar-icon group`}>
        {icon}

        <span className={`sidebar-tooltip group-hover:scale-100`}>
            {text}
        </span>
    </div>
)

export default SideBarIcon