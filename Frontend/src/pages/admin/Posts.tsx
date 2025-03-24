import Header from '@/components/admin/common/Header'
import Sidebar from '@/components/admin/common/Sidebar'
import PostDetialsTable from '@/components/admin/post/PostDetialsTable'

const Posts = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={'post'} />
      <div className="w-full h-full flex flex-col overflow-auto scrollbar-hidden">
        <Header title={'Posts'} />
        <PostDetialsTable />
      </div>
    </div>
  )
}

export default Posts
