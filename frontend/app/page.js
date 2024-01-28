"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@mui/material';

export default function Home() {
  const router = useRouter();

  const redirectToAlbum = () => {
    router.push('/album');
  };

  const redirectToLogin = () => {
    router.push('/api/auth/login');
  }
  const { user, error } = useUser()
  console.log(user)
  if (error) {
    return (
      <div>
        {error.message}
      </div>
    )
  }
  if (user) {
    return (
      <div className='main-img'>
       <Image src="/brain.png" width={650} height={650}/>
       <Button sx={{ backgroundColor: "lightcoral", "&:hover": {backgroundColor: "lightcoral", color: "white"}, }} variant='contained' onClick={redirectToAlbum} className="home-button">Continue to Album</Button>
     </div>
    )
  }
  else {
    return (
      <div className='main-img'>
       <Image src="/brain.png" width={650} height={650}/>
       <Button sx={{ backgroundColor: "lightcoral", "&:hover": {backgroundColor: "lightcoral", color: "white"}, }} variant='contained' onClick={redirectToLogin} className="home-button">Click here to Login</Button>
     </div>
    )
  }
}

