import React from "react";
import {HomePage, HomePageType} from "./pages/HomePage";
import {Header} from "@fanz-project/ui";
import {apiHelper} from "@fanz-project/services";


type AppType = {}

const App: React.FC<AppType> = () => {
    return <>
        <Header />
        <HomePage />
        </>
}

export default App;
