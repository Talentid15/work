
import { createContext, useState } from "react";

export const PipelineContext = createContext();

function PipelineContextProvider({children}){

    const [pipelineData,setPipelineData] = useState(null);

    const [searchedResponseData, setSearchedResponseData] = useState(null);

    const data ={

        pipelineData,
        setPipelineData,
        searchedResponseData,
        setSearchedResponseData

    }

    return (

        <PipelineContext.Provider value={data}>

            {children}

        </PipelineContext.Provider>
    )
}

export default PipelineContextProvider;

