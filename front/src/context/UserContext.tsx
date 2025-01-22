import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextProps {
    idUsuario: string | null;
    setIdUsuario: (id: string | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [idUsuario, setIdUsuario] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ idUsuario, setIdUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserProvider");
    }
    return context;
};
