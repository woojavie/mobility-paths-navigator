import { UserProfile } from '@/components/auth/UserProfile'
import { Layout } from '@/components/layout/Layout'

const ProfilePage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-3xl font-bold">Your Profile</h1>
        <UserProfile />
      </div>
    </Layout>
  )
}

export default ProfilePage 