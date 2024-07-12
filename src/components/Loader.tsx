import Spacer from '@/components/spacer'
import Spinner from '@/components/spinner'

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Spacer />
      <Spinner color="#333" />
      <Spacer />
    </div>
  )
}
export default Loader
