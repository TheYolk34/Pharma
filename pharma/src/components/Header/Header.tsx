import {FC} from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header: FC = () => {
    return(
        <nav className="header">
            <Link to="/">
                <img src="/Pharma/logo.png"/>
            </Link>
        </nav>
    )
}

export default Header;