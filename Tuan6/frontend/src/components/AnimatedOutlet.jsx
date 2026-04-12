import { useLocation, Outlet } from 'react-router-dom'

export default function AnimatedOutlet() {
  const { pathname } = useLocation()

  return (
    <div className="route-stage" key={pathname}>
      <Outlet />
    </div>
  )
}
