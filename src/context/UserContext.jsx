import { Children, createContext, useState } from "react";

export const UserContext = createContext();

function UserContextProvider({ children }) {


    const [isSignedUp, setSignedUp] = useState(false);

    const data = {

        isSignedUp,
        setSignedUp
    }

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;


