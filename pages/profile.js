import UserProfile from "../components/profile/user-profile"
import { getSession } from "next-auth/client"

function ProfilePage() {
  return <UserProfile />
}

export default ProfilePage

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    }
  }
  return {
    props: { session },
  }
}
