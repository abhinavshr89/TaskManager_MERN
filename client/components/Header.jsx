import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Header({ setTasks, setIsAuthenticated, isAuthenticated, setTaskTitle }) {
    const [allTasks, setAllTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:1001/api/v1/task/mytask/", { withCredentials: true });
            setAllTasks(response.data.tasks);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [isAuthenticated]);

    const handleLogout = async () => {
        try {
            const { data } = await axios.get("http://localhost:1001/api/v1/user/logout", { withCredentials: true });
            alert(data.message);
            setIsAuthenticated(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const filterTasks = (filterType) => {
        let filteredTasks = [];
        switch (filterType) {
            case "completed":
                filteredTasks = allTasks.filter((task) => task.status === "completed");
                setTaskTitle("Completed Tasks");
                break;
            case "incomplete":
                filteredTasks = allTasks.filter((task) => task.status === "incomplete");
                setTaskTitle("Incomplete Tasks");
                break;
            case "archived":
                filteredTasks = allTasks.filter((task) => task.archived === true);
                setTaskTitle("Archived Tasks");
                break;
            default:
                filteredTasks = allTasks;
                setTaskTitle("Tasks");
                break;
        }
        setTasks(filteredTasks);
    };

    return (
        <Navbar expand="lg" className={`bg-body-tertiary ${isAuthenticated ? "" : "d-none"}`}>
            <Container>
                <Navbar.Brand as={Link} to="/">TASK MANAGER</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to={"/"} className="nav-link">Home</Link>
                        <NavDropdown title="Filter Tasks">
                            <NavDropdown.Item onClick={() => filterTasks("all")}>All Tasks</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => filterTasks("completed")}>Completed Tasks</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => filterTasks("incomplete")}>Incomplete Tasks</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => filterTasks("archived")}>Archived Tasks</NavDropdown.Item>
                        </NavDropdown>
                        <Link to={"/profile"} className="nav-link">Profile</Link>
                        <Button variant="link" onClick={handleLogout}>LOGOUT</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <ToastContainer />
        </Navbar>
    );
}

export default Header;
