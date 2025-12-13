import type { PropsWithChildren } from "react"

const MainLayout = ({ children }: PropsWithChildren) => {
  return <main className="main-container">{children}</main>
}

export default MainLayout
