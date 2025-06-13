import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

//carousel
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import { useSocket } from 'src/context/hooks';

import { TeamMember } from 'src/types';
import { startChat } from 'src/lib/socket';

type Props = {
  teamMembers?: TeamMember[];
  setSearch: (search: string) => void;
}

const TeamMembers: React.FC<Props> = ({ 
  setSearch, 
  teamMembers = [],
}) => {
  const socket = useSocket();
  const { tid } = useParams();

  const responsive = {
    0: { items: 2 },
    576: { items: 3 },
    768: { items: 4 },
  };

  const handleMemberClick = (teamMember: TeamMember) => (e: React.MouseEvent<HTMLElement>) => {
    if(socket?.connected) {
      startChat(
        socket, 
        {team_id: tid as string, receiver_id: String(teamMember.user.id)}
      );
      setSearch('');
    }else {
      toast.error('Could not establish connection with chat server');
    }
  }

  return (
    <div className="px-4 pb-4 dot_remove" dir="ltr" >
      <AliceCarousel
        responsive={responsive}
        mouseTracking
        autoPlayInterval={3000}
        disableDotsControls={false}
        disableButtonsControls={false}
      >
        {teamMembers?.map(teamMember => (
          <div key={teamMember.id} className="item clickable" onClick={handleMemberClick(teamMember)}>
            <div className="user-status-box">
              <div aria-label='status' className={`avatar-xs mx-auto d-block chat-user-img ${teamMember.online && 'online'} `}>
                <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                  {/* <img src={avatar2} alt="user-img" className="img-fluid rounded-circle" /> */}
                  {teamMember.full_name.charAt(0)}
                </span>
                  <span className="user-status" />
              </div> 
                <h5 className="font-size-10 text-truncate mt-3 mb-1">{teamMember.full_name}</h5>
            </div>
          </div>
        ))}
      </AliceCarousel>
    </div>
  );
}

export default TeamMembers;
