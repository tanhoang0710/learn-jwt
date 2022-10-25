import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, getAllUsers } from '../../redux/apiRequest';
import store from '../../redux/store';
import './home.css';
import { createAxios } from '../../createInstance';
import { loginSuccess } from '../../redux/authSlice';

const HomePage = () => {
	const user = useSelector((state) => state.auth.login?.currentUser);
	const userList = useSelector((state) => state.users.users?.allUsers);
	const msg = useSelector((state) => state.users?.msg);
	const navigate = useNavigate();

	const axiosJWT = createAxios(user, store.dispatch, loginSuccess);

	const handleDelete = (id) => {
		deleteUser(user?.accessToken, store.dispatch, id, axiosJWT);
	};

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
		if (user?.accessToken) {
			getAllUsers(user?.accessToken, store.dispatch, axiosJWT);
		}
	}, []);

	return (
		<main className="home-container">
			<div className="home-title">User List</div>
			<div className="home-role">{`Your role: ${
				user?.admin ? 'Admin' : 'User'
			}`}</div>
			<div className="home-userlist">
				{userList?.map((user) => {
					return (
						<div className="user-container">
							<div className="home-user">{user.userName}</div>
							<div
								className="delete-user"
								onClick={() => handleDelete(user?._id)}
							>
								{' '}
								Delete{' '}
							</div>
						</div>
					);
				})}
			</div>
			{msg}
		</main>
	);
};

export default HomePage;
