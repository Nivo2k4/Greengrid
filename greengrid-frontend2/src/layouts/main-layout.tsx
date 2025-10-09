import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout(){
   
    return(
        <div className="w-screen">
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    )
    
    
}