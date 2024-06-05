import Link from 'next/link';
import Image from 'next/image';


type HeaderProps = {
  title: string;
  description: string;
};

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className='text-center mb-4'>
      <Link href='/' className='auth-logo mb-5 d-block'>
        <Image
          src='/images/logo-dark.png'
          alt=''
          height={30}
          width={120}
          className='logo logo-dark'
        />
        <Image
          src='/images/logo-light.png'
          alt=''
          height={30}
          width={120}
          className='logo logo-light'
        />
      </Link>
      <h4>{title}</h4>
      <p className='text-muted mb-4'>{description}</p>
    </div>
  );
};

export default Header;
