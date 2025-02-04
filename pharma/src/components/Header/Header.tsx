import {FC} from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header: FC = () => {
    return(
        <nav className="header">
            <Link to="/">
                <img src="/logo.png"/>
            </Link>
        </nav>
    )
}

export default Header;