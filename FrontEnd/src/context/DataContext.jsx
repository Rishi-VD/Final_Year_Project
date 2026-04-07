import { createContext, useContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

// Optional custom hook (clean usage)
export const useData = () => useContext(DataContext);