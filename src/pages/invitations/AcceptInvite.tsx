import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AcceptInvite: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	useEffect(() => {
		if (token) {
			localStorage.setItem('invitationToken', token);
			navigate('/auth/login')
		}
	}, [token, navigate]);

	if (!token) {
		return <div>Invalid token</div>
	}

	return (
		<div>
			Redirecting...
		</div>
	);
}

export default AcceptInvite;
