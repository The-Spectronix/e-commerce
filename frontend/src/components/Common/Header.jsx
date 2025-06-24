import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <div className='border-b border-gray-200'>
      {/* topbar */}
      <Topbar />
      {/* navbar */}
      <Navbar />
      {/* cart drawer */}
    </div>
  )
}

export default Header
