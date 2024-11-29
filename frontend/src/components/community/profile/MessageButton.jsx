import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

const MessageButton = ({ userId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/community/chat/${userId}`);
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
            <FaComments /> Message
        </button>
    );
};

export default MessageButton;