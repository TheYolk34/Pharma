import { FC, ReactNode } from "react";
import Header from "../Header/Header";

const Layout: FC<{children: ReactNode}> = ({children}) => {
    return(
        <div id="layuout">
            <Header/>
            {children}
        </div>
    )
}

export default Layout;