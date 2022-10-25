import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createAxios } from '../../createInstance';
import { logOut } from '../../redux/apiRequest';
import { logOutSuccess } from '../../redux/authSlice';
import store from '../../redux/store';
import './navbar.css';
const NavBar = () => {
	const user = useSelector((state) => state.auth.login.currentUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const axiosJWT = createAxios(user, store.dispatch, logOutSuccess);

	const handleLogout = () => {
		logOut(dispatch, user?._id, navigate, user?.accessToken, axiosJWT);
	};

	return (
		<nav className="navbar-container">
			<Link to="/" className="navbar-home">
				{' '}
				Home{' '}
			</Link>
			{user ? (
				<>
					<p className="navbar-user">
						Hi, <span> {user.userName} </span>{' '}
					</p>
					<Link
						to="/logout"
						className="navbar-logout"
						onClick={handleLogout}
					>
						{' '}
						Log out
					</Link>
				</>
			) : (
				<>
					<Link to="/login" className="navbar-login">
						{' '}
						Login{' '}
					</Link>
					<Link to="/register" className="navbar-register">
						{' '}
						Register
					</Link>
				</>
			)}
		</nav>
	);
};

export default NavBar;
