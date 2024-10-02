import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";

const PopulatedNavBar = () => {
    return (
        <NavBar>
            <NavItem>SPEED</NavItem>
            <NavItem route="/" end>
                Home
            </NavItem>
            <NavItem dropdown route="/articles">
                Articles <IoMdArrowDropdown />
                <NavDropdown>
                    <NavItem route="/articles">View Articles</NavItem>
                    <NavItem route="/articles/new">Submit New</NavItem>
                    <NavItem route="/articles/review">Review</NavItem>  {/* 新增：审核页面的导航链接 */}
                    <NavItem route="/articles/search">Search</NavItem>  {/* 新增：搜索页面的导航链接 */}
                    <NavItem route="/extract-info">Extract Info</NavItem>
                </NavDropdown>
            </NavItem>
        </NavBar>
    );
};

export default PopulatedNavBar;
